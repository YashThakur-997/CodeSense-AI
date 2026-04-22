import { GridBackgroundDemo } from '@/components/ui/gridbackground';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type ConversationMessage = {
  id: string;
  speaker: 'Candidate' | 'Interviewer';
  text: string;
  isFinal: boolean;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

function Interview({ username, imageUrl }: { username: string; imageUrl?: string }) {
  const [isInterviewRunning, setIsInterviewRunning] = useState(false);
  const [statusText, setStatusText] = useState('Idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlaybackTimeRef = useRef(0);
  const audioDecodeChainRef = useRef<Promise<void>>(Promise.resolve());
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);

  const socket: Socket = useMemo(
    () =>
      io(BACKEND_URL, {
        transports: ['websocket'],
        withCredentials: true,
      }),
    []
  );

  const isSpeaking = isInterviewRunning;

  const upsertTranscript = (speaker: 'Candidate' | 'Interviewer', text: string, isFinal: boolean) => {
    if (!text.trim()) return;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.speaker === speaker && !last.isFinal) {
        const merged = [...prev];
        merged[merged.length - 1] = {
          ...last,
          text,
          isFinal,
        };
        return merged;
      }

      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          speaker,
          text,
          isFinal,
        },
      ];
    });
  };

  const enqueueIncomingAudio = (binaryChunk: ArrayBuffer | Uint8Array | Blob) => {
    let payloadPromise: Promise<ArrayBuffer>;

    if (binaryChunk instanceof Blob) {
      payloadPromise = binaryChunk.arrayBuffer();
    } else if (binaryChunk instanceof ArrayBuffer) {
      payloadPromise = Promise.resolve(binaryChunk);
    } else {
      const copied = new Uint8Array(binaryChunk.byteLength);
      copied.set(binaryChunk);
      payloadPromise = Promise.resolve(copied.buffer);
    }

    audioDecodeChainRef.current = audioDecodeChainRef.current.then(async () => {
      const arrayBuffer = await payloadPromise;
      if (!arrayBuffer.byteLength) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);

      const startAt = Math.max(ctx.currentTime + 0.03, nextPlaybackTimeRef.current);
      source.start(startAt);
      nextPlaybackTimeRef.current = startAt + decoded.duration;
    }).catch((decodeError) => {
      console.error('Audio decode/playback failed:', decodeError);
    });
  };

  const stopInterview = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    socket.emit('end-interview');
    setIsInterviewRunning(false);
    setStatusText('Ended');
  };

  const startInterview = async () => {
    try {
      setError(null);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaStreamRef.current = mediaStream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const recorder = new MediaRecorder(mediaStream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (event) => {
        if (!event.data || event.data.size === 0) return;
        const chunk = await event.data.arrayBuffer();
        socket.emit('audio-chunk', {
          audio: chunk,
          mimeType,
          timestamp: Date.now(),
        });
      };

      recorder.start(300);
      socket.emit('start-interview', {
        candidateName: username,
      });

      setIsInterviewRunning(true);
      setStatusText('Listening...');
    } catch (startError) {
      setError('Microphone access failed. Please allow microphone permission and retry.');
      console.error(startError);
    }
  };

  useEffect(() => {
    socket.on('interview-status', (payload: { status?: string }) => {
      if (payload?.status) {
        if (payload.status === 'active') {
          setStatusText('Live Interview');
        } else if (payload.status === 'ended') {
          setStatusText('Ended');
          setIsInterviewRunning(false);
        } else {
          setStatusText(payload.status);
        }
      }
    });

    socket.on('transcript-update', (payload: { speaker: 'Candidate' | 'Interviewer'; text: string; isFinal?: boolean }) => {
      upsertTranscript(payload.speaker, payload.text, Boolean(payload.isFinal));
    });

    socket.on('ai-audio-chunk', (audioPayload: ArrayBuffer | Uint8Array | Blob) => {
      enqueueIncomingAudio(audioPayload);
    });

    socket.on('interview-error', (payload: { message?: string }) => {
      setError(payload?.message || 'Unexpected interview error.');
    });

    return () => {
      socket.removeAllListeners('interview-status');
      socket.removeAllListeners('transcript-update');
      socket.removeAllListeners('ai-audio-chunk');
      socket.removeAllListeners('interview-error');
      stopInterview();
      socket.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!transcriptContainerRef.current) return;
    transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
  }, [messages]);

  const interviewerMessages = messages.filter((message) => message.speaker === 'Interviewer');

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-black overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 relative bg-black min-h-0">
        <GridBackgroundDemo />

        {/* Title Section - Using top-0 instead of inset-0 to prevent blocking clicks */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-center pt-10 sm:pt-16 md:pt-20 z-30 pointer-events-none px-4">
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">Interview Section</h1>
        </div>

        {/* Cards Container */}
        <div className="absolute inset-0 flex flex-col z-20 justify-center items-center gap-6 px-4 pt-24 pb-10">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {!isInterviewRunning ? (
              <Button onClick={startInterview} className="bg-white text-black hover:bg-neutral-200 font-semibold px-6">
                Start Interview
              </Button>
            ) : (
              <Button onClick={stopInterview} variant="destructive" className="font-semibold px-6">
                Stop Interview
              </Button>
            )}
            <span className="text-sm text-neutral-300 bg-neutral-900/70 border border-neutral-700 px-3 py-2 rounded-md">
              Status: {statusText}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full max-w-5xl justify-center">
            {/* Card 1: Interviewer */}
            <Card className="w-full sm:w-80 h-64 flex flex-col items-center justify-center bg-neutral-900 border-neutral-800 text-white">
              <div className="relative flex items-center justify-center w-24 h-24">
              {/* Blinking Aura behind the logo */}
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full bg-gray-500/40 animate-ping scale-90 z-0"></div>
              )}
              {/* The Logo */}
              <img 
                src={'https://avatars.githubusercontent.com/u/9919?s=200&v=4'} 
                alt='Avatar' 
                className="rounded-full w-20 h-20 relative z-10 border-2 border-neutral-700" 
              />
            </div>
            <p className="mt-4 text-neutral-400 font-medium">Interviewer</p>
            <p className="text-xs text-neutral-500 mt-2 px-4 text-center line-clamp-3">
              {interviewerMessages.length > 0
                ? interviewerMessages[interviewerMessages.length - 1].text
                : 'The AI interviewer response will appear here in real time.'}
            </p>
            </Card>

            {/* Card 2: Candidate */}
            <Card className="w-full sm:w-80 h-64 flex flex-col items-center justify-center bg-neutral-900 border-neutral-800 text-white">
              <div className="relative w-20 h-20">
                <img 
                  src={imageUrl || 'https://avatars.githubusercontent.com/u/9919?s=200&v=4'}
                  alt='Avatar' 
                  className="rounded-full w-full h-full object-cover border-2 border-neutral-700" 
                />
              </div>
              <p className="mt-4 text-neutral-400 font-medium">{username}</p>
              <p className="text-xs text-neutral-500 mt-2 px-4 text-center">
                Speak naturally. Your transcript is streamed to the AI interviewer.
              </p>
            </Card>
          </div>

          <Card className="w-full max-w-5xl bg-neutral-900/90 border-neutral-800 text-white p-4">
            <h2 className="text-lg font-semibold mb-3">Live Transcript</h2>
            <div ref={transcriptContainerRef} className="h-64 overflow-y-auto space-y-3 pr-2">
              {messages.length === 0 && (
                <p className="text-neutral-500 text-sm">No transcript yet. Start the interview to begin streaming.</p>
              )}
              {messages.map((message) => (
                <div key={message.id} className="rounded-md border border-neutral-800 bg-neutral-950/80 p-3">
                  <p className="text-xs uppercase tracking-wide text-neutral-400">{message.speaker}</p>
                  <p className="text-sm text-neutral-100 mt-1 whitespace-pre-wrap">{message.text}</p>
                </div>
              ))}
            </div>
            {error && (
              <p className="text-red-400 text-xs mt-3 bg-red-500/10 border border-red-500/30 p-2 rounded-md">{error}</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Interview;