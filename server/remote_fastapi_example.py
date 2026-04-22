"""
Reference FastAPI websocket service for remote voice interview inference.

This service receives binary audio chunks from the Node relay websocket,
runs speech-to-text (Whisper), response generation (Gemma), text-to-speech
(Coqui TTS), and returns transcript + interviewer response + synthesized audio.

Install (example):
  pip install fastapi uvicorn websockets numpy scikit-learn sentence-transformers

Run:
  uvicorn remote_fastapi_example:app --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

import json
from dataclasses import dataclass

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

app = FastAPI(title="Remote Voice Interview Server")


@dataclass
class ChunkRecord:
    text: str
    embedding: list[float]


class RepoContextStore:
    def __init__(self) -> None:
        self.embedder = SentenceTransformer("all-MiniLM-L6-v2")
        self.chunks: list[ChunkRecord] = []

    def load_from_repomix(self, xml_text: str, chunk_chars: int = 900) -> None:
        normalized = xml_text.replace("\r\n", "\n")
        slices = [normalized[i : i + chunk_chars] for i in range(0, len(normalized), chunk_chars)]
        clean_slices = [s.strip() for s in slices if s.strip()]
        if not clean_slices:
            self.chunks = []
            return

        vectors = self.embedder.encode(clean_slices, normalize_embeddings=True)
        self.chunks = [ChunkRecord(text=text, embedding=vector.tolist()) for text, vector in zip(clean_slices, vectors)]

    def search(self, query: str, k: int = 4) -> str:
        if not self.chunks:
            return ""

        query_vec = self.embedder.encode([query], normalize_embeddings=True)
        matrix = [record.embedding for record in self.chunks]
        scores = cosine_similarity(query_vec, matrix)[0]
        ranked = sorted(enumerate(scores), key=lambda pair: pair[1], reverse=True)[:k]
        return "\n\n".join(self.chunks[idx].text for idx, _score in ranked)


context_store = RepoContextStore()


def transcribe_with_whisper(audio_bytes: bytes) -> str:
    """
    Replace with your Whisper inference call.
    Return a short transcript string for the current audio chunk.
    """
    # Placeholder: this should call your actual Whisper model runtime.
    if not audio_bytes:
        return ""
    return "candidate answer fragment"


def generate_with_gemma(transcript: str, retrieved_context: str) -> str:
    """
    Replace with your Gemma generation call.
    """
    if not transcript:
        return ""

    prompt = (
        "You are an interview assistant. Use the retrieved repository context when relevant.\n"
        f"Candidate transcript: {transcript}\n"
        f"Repository context: {retrieved_context[:2500]}\n"
        "Reply with one interviewer sentence."
    )
    # Placeholder: swap with your real Gemma inference call.
    _ = prompt
    return "Thanks, can you explain the tradeoff behind that design choice?"


def synthesize_with_coqui(text: str) -> bytes:
    """
    Replace with your Coqui TTS inference call.
    Return encoded audio bytes (wav/ogg) that browser can decode.
    """
    if not text:
        return b""
    # Placeholder: replace with true TTS output.
    return b""


@app.websocket("/ws/interview")
async def interview_ws(websocket: WebSocket) -> None:
    await websocket.accept()

    try:
        while True:
            message = await websocket.receive()

            if "text" in message and message["text"] is not None:
                payload = json.loads(message["text"])
                event_type = payload.get("type")

                if event_type == "start":
                    # Node relay can send repoContext directly (preferred).
                    repo_context = payload.get("repoContext") or ""
                    if repo_context:
                        context_store.load_from_repomix(repo_context)
                    await websocket.send_text(json.dumps({"type": "ready"}))
                    continue

                if event_type == "stop":
                    await websocket.send_text(json.dumps({"type": "stopped"}))
                    break

            if "bytes" in message and message["bytes"] is not None:
                audio_chunk = message["bytes"]
                transcript = transcribe_with_whisper(audio_chunk)

                if transcript:
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "transcript",
                                "transcript": transcript,
                                "isFinal": True,
                            }
                        )
                    )

                retrieved_context = context_store.search(transcript, k=4)
                interviewer_text = generate_with_gemma(transcript, retrieved_context)

                if interviewer_text:
                    await websocket.send_text(
                        json.dumps(
                            {
                                "type": "response",
                                "response": interviewer_text,
                            }
                        )
                    )

                    tts_audio = synthesize_with_coqui(interviewer_text)
                    if tts_audio:
                        await websocket.send_bytes(tts_audio)
    except WebSocketDisconnect:
        return
    except Exception as exc:
        await websocket.send_text(json.dumps({"type": "error", "message": str(exc)}))
