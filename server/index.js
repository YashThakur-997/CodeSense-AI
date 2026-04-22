const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const WebSocket = require('ws');
const { Server } = require('socket.io');
const VoiceInterviewSession = require('./models/voiceInterview');


dotenv.config();

//Importing routes
const authRoutes = require('./routes/auth.routes');
const interviewRoutes = require('./routes/interview.routes');

const app = express();
const PORT = process.env.PORT;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const REMOTE_VOICE_WS_URL = process.env.REMOTE_VOICE_WS_URL || '';
const REMOTE_AUTH_TOKEN = process.env.REMOTE_AUTH_TOKEN || '';

const relayState = new Map();

function getNgrokHeaders() {
  const headers = {
    'ngrok-skip-browser-warning': 'true',
  };

  if (REMOTE_AUTH_TOKEN) {
    headers.Authorization = `Bearer ${REMOTE_AUTH_TOKEN}`;
  }

  return headers;
}

function toBuffer(payload) {
  if (!payload) return null;

  if (Buffer.isBuffer(payload)) {
    return payload;
  }

  if (payload instanceof ArrayBuffer) {
    return Buffer.from(payload);
  }

  if (ArrayBuffer.isView(payload)) {
    return Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength);
  }

  if (typeof payload === 'string') {
    try {
      return Buffer.from(payload, 'base64');
    } catch {
      return null;
    }
  }

  return null;
}

async function appendTurn(sessionId, speaker, text) {
  if (!sessionId || !text || !text.trim()) return;

  await VoiceInterviewSession.findByIdAndUpdate(sessionId, {
    $push: {
      turns: {
        speaker,
        text: text.trim(),
      },
    },
  });
}

async function closeRelay(socketId, status = 'ended') {
  const state = relayState.get(socketId);
  if (!state) return;

  if (state.remoteWs && state.remoteWs.readyState === WebSocket.OPEN) {
    state.remoteWs.close();
  }

  if (state.sessionId) {
    await VoiceInterviewSession.findByIdAndUpdate(state.sessionId, {
      status,
      endedAt: new Date(),
    }).catch(() => {});
  }

  relayState.delete(socketId);
}

app.use(cookieParser());
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Optional fallback for debugging uploads. Streaming through Socket.io is preferred.
app.post('/interview/upload-chunk', upload.single('audio'), (req, res) => {
  const size = req.file?.buffer?.length || 0;
  return res.status(200).json({
    success: true,
    bytesReceived: size,
    mimeType: req.file?.mimetype || null,
  });
});

app.use('/auth', authRoutes);
app.use('/interview', interviewRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    credentials: true,
  },
  maxHttpBufferSize: 10 * 1024 * 1024,
});

io.on('connection', (socket) => {
  socket.emit('interview-status', {
    status: 'connected',
    socketId: socket.id,
  });

  socket.on('start-interview', async (payload = {}) => {
    try {
      if (!REMOTE_VOICE_WS_URL) {
        socket.emit('interview-error', {
          message: 'REMOTE_VOICE_WS_URL is not configured on backend.',
        });
        return;
      }

      await closeRelay(socket.id, 'restarted');

      const session = await VoiceInterviewSession.create({
        socketId: socket.id,
        candidateName: payload.candidateName || 'Candidate',
        repoUrl: payload.repoUrl || '',
        status: 'active',
        metadata: {
          role: payload.role || 'Software Engineer',
          difficulty: payload.difficulty || 'medium',
          language: payload.language || 'mixed',
        },
      });

      const remoteWs = new WebSocket(REMOTE_VOICE_WS_URL, {
        headers: getNgrokHeaders(),
      });

      relayState.set(socket.id, {
        remoteWs,
        sessionId: session._id,
      });

      remoteWs.on('open', () => {
        remoteWs.send(
          JSON.stringify({
            type: 'start',
            sessionId: String(session._id),
            candidateName: payload.candidateName || 'Candidate',
            repoUrl: payload.repoUrl || '',
            repoContext: payload.repoContext || '',
            role: payload.role || 'Software Engineer',
            difficulty: payload.difficulty || 'medium',
            language: payload.language || 'mixed',
          })
        );

        socket.emit('interview-status', {
          status: 'active',
          sessionId: session._id,
        });
      });

      remoteWs.on('message', async (rawData, isBinary) => {
        try {
          if (isBinary) {
            socket.emit('ai-audio-chunk', rawData);
            return;
          }

          const data = JSON.parse(rawData.toString());

          if (data.type === 'error') {
            socket.emit('interview-error', {
              message: data.message || 'Remote inference error',
            });
            return;
          }

          const transcriptText = data.transcript || data.candidateText || '';
          if (transcriptText) {
            socket.emit('transcript-update', {
              speaker: 'Candidate',
              text: transcriptText,
              isFinal: Boolean(data.isFinal),
            });

            if (data.isFinal) {
              await appendTurn(session._id, 'Candidate', transcriptText);
            }
          }

          const aiResponse = data.response || data.interviewerText || '';
          if (aiResponse) {
            socket.emit('transcript-update', {
              speaker: 'Interviewer',
              text: aiResponse,
              isFinal: true,
            });

            await appendTurn(session._id, 'Interviewer', aiResponse);
          }

          if (data.ttsAudioBase64) {
            socket.emit('ai-audio-chunk', Buffer.from(data.ttsAudioBase64, 'base64'));
          }
        } catch (error) {
          socket.emit('interview-error', {
            message: `Failed to parse remote message: ${error.message}`,
          });
        }
      });

      remoteWs.on('error', (error) => {
        socket.emit('interview-error', {
          message: `Remote websocket error: ${error.message}`,
        });
      });

      remoteWs.on('close', async () => {
        await closeRelay(socket.id, 'ended');
        socket.emit('interview-status', {
          status: 'ended',
        });
      });
    } catch (error) {
      socket.emit('interview-error', {
        message: `Interview start failed: ${error.message}`,
      });
    }
  });

  socket.on('audio-chunk', (payload = {}) => {
    const state = relayState.get(socket.id);
    if (!state || !state.remoteWs || state.remoteWs.readyState !== WebSocket.OPEN) {
      socket.emit('interview-error', {
        message: 'Remote voice relay is not connected.',
      });
      return;
    }

    const chunk = toBuffer(payload.audio || payload.chunk || payload);
    if (!chunk || !chunk.length) return;

    state.remoteWs.send(chunk, { binary: true });
  });

  socket.on('end-interview', async () => {
    const state = relayState.get(socket.id);
    if (state?.remoteWs && state.remoteWs.readyState === WebSocket.OPEN) {
      state.remoteWs.send(JSON.stringify({ type: 'stop' }));
    }
    await closeRelay(socket.id, 'ended');
    socket.emit('interview-status', { status: 'ended' });
  });

  socket.on('disconnect', async () => {
    await closeRelay(socket.id, 'abandoned');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});