// server/socket-server.js
/**
 * Socket.io 서버 설정
 * 실시간 채팅 기능을 제공하는 WebSocket 서버입니다
 * 
 * 실행 방법: node server/socket-server.js
 * 
 * 주요 기능:
 * - 실시간 메시지 브로드캐스팅
 * - 사용자 온라인 상태 관리
 * - 타이핑 인디케이터
 * - 파일 업로드 지원
 * - 자동 정리 시스템
 */
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

// Express 애플리케이션 초기화
const app = express();
const server = createServer(app);

// CORS 설정 - Next.js 개발 서버와 프로덕션 환경 모두 허용
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://your-production-domain.com',
  // 필요에 따라 추가 도메인 허용
];

// Socket.io 서버 설정
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'], // WebSocket 우선, 폴백으로 polling
  pingTimeout: 60000, // 60초 ping 타임아웃
  pingInterval: 25000, // 25초마다 ping 전송
  maxHttpBufferSize: 1e7, // 10MB 최대 버퍼 크기 (파일 업로드용)
  allowEIO3: true // Engine.IO v3 호환성
});

// Express 미들웨어 설정
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 서빙 (업로드된 파일들)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API 라우트
app.get('/', (req, res) => {
  const serverInfo = {
    message: 'Next Chat Live Socket.io 서버가 실행 중입니다! 🚀',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size,
    totalMessages: messages.length,
    activeTypingUsers: typingUsers.size,
    features: [
      'Real-time messaging',
      'User presence tracking',
      'Typing indicators',
      'File upload support',
      'Message encryption',
      'Auto cleanup system'
    ]
  };
  res.json(serverInfo);
});

// 서버 상태 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// 서버 통계 엔드포인트
app.get('/stats', (req, res) => {
  res.json({
    connectedUsers: connectedUsers.size,
    onlineUsers: Array.from(connectedUsers.values()).filter(u => u.isOnline).length,
    totalMessages: messages.length,
    activeTypingUsers: typingUsers.size,
    serverUptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 서버 상태 관리 변수들
let connectedUsers = new Map(); // userId -> { id, name, avatar, socketId, isOnline, lastSeen, joinedAt }
let messages = []; // 메시지 히스토리 (실제 환경에서는 데이터베이스 사용 권장)
let typingUsers = new Map(); // userId -> { userId, userName, socketId, startTime }
let roomStats = {
  totalConnections: 0,
  messagesExchanged: 0,
  filesUploaded: 0,
  startTime: new Date()
};

// 유틸리티 함수들
const getCurrentUsers = () => {
  return Array.from(connectedUsers.values()).map(user => ({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    isOnline: user.isOnline,
    lastSeen: user.lastSeen
  }));
};

const broadcastUsersList = () => {
  const usersList = getCurrentUsers();
  io.emit('users_list', usersList);
  console.log(`📋 사용자 목록 업데이트: ${usersList.length}명`);
};

const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const logActivity = (activity, details = '') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${activity} ${details}`);
};

const cleanupExpiredData = () => {
  const now = Date.now();
  let cleanupCount = 0;

  // 30초 이상 지난 타이핑 사용자 정리
  typingUsers.forEach((typingUser, userId) => {
    if (now - typingUser.startTime > 30000) {
      typingUsers.delete(userId);
      io.emit('user_stop_typing', userId);
      cleanupCount++;
    }
  });

  if (cleanupCount > 0) {
    console.log(`🧹 ${cleanupCount}개의 만료된 타이핑 상태를 정리했습니다.`);
  }
};

// Socket.io 연결 이벤트 처리
io.on('connection', (socket) => {
  roomStats.totalConnections++;
  logActivity('✅ 새 연결', `Socket ID: ${socket.id}`);

  // 연결된 클라이언트에게 서버 정보 전송
  socket.emit('notification', '서버에 연결되었습니다! 🎉', 'success');

  // 사용자 입장 처리
  socket.on('join', (user) => {
    try {
      if (!user || !user.id || !user.name) {
        socket.emit('notification', '사용자 정보가 올바르지 않습니다.', 'error');
        return;
      }

      logActivity('👤 사용자 입장', `${user.name} (${user.id})`);
      
      // 기존 사용자인 경우 소켓 ID 업데이트
      const existingUser = connectedUsers.get(user.id);
      if (existingUser) {
        existingUser.socketId = socket.id;
        existingUser.isOnline = true;
        existingUser.lastSeen = new Date();
        console.log(`🔄 기존 사용자 재연결: ${user.name}`);
      } else {
        // 새 사용자 추가
        connectedUsers.set(user.id, {
          ...user,
          socketId: socket.id,
          isOnline: true,
          lastSeen: new Date(),
          joinedAt: new Date()
        });
        console.log(`🆕 새 사용자 추가: ${user.name}`);
      }

      // 소켓에 사용자 정보 저장 (나중에 disconnect 시 사용)
      socket.userId = user.id;
      socket.userName = user.name;

      // 다른 사용자들에게 새 사용자 입장 알림
      socket.broadcast.emit('user_joined', {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        isOnline: true,
        lastSeen: new Date()
      });

      // 현재 사용자에게 기존 메시지 히스토리 전송 (최근 50개)
      const recentMessages = messages.slice(-50);
      if (recentMessages.length > 0) {
        socket.emit('notification', `${recentMessages.length}개의 이전 메시지를 불러왔습니다.`, 'info');
        
        // 메시지를 하나씩 순차적으로 전송 (UI에서 자연스럽게 표시되도록)
        recentMessages.forEach((message, index) => {
          setTimeout(() => {
            socket.emit('message', message);
          }, index * 50); // 50ms 간격으로 전송
        });
      }

      // 전체 사용자 목록 브로드캐스트
      setTimeout(() => {
        broadcastUsersList();
      }, 100);

      // 개인화된 환영 메시지
      socket.emit('notification', `${user.name}님, Next Chat Live에 오신 것을 환영합니다! 💬`, 'success');

      // 사용자에게 채팅 팁 제공
      setTimeout(() => {
        socket.emit('notification', '💡 팁: 메시지를 암호화하려면 🔒 버튼을 활성화하세요!', 'info');
      }, 3000);

    } catch (error) {
      console.error('❌ 사용자 입장 처리 오류:', error);
      socket.emit('notification', '입장 처리 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
  });

  // 메시지 전송 처리
  socket.on('send_message', (messageData) => {
    try {
      // 사용자 인증 확인
      const user = connectedUsers.get(socket.userId);
      if (!user) {
        socket.emit('notification', '사용자 인증이 필요합니다. 다시 접속해주세요.', 'error');
        return;
      }

      // 메시지 데이터 검증
      if (!messageData.content && !messageData.fileUrl) {
        socket.emit('notification', '메시지 내용이 없습니다.', 'error');
        return;
      }

      // 메시지 객체 생성
      const message = {
        id: generateMessageId(),
        userId: messageData.userId,
        userName: messageData.userName,
        content: messageData.content || '',
        timestamp: new Date(),
        type: messageData.type || 'text',
        fileUrl: messageData.fileUrl,
        fileName: messageData.fileName,
        isEncrypted: messageData.isEncrypted || false
      };

      // 메시지 히스토리에 저장 (메모리 관리를 위해 최대 1000개까지만 보관)
      messages.push(message);
      if (messages.length > 1000) {
        messages = messages.slice(-1000);
        console.log('📝 오래된 메시지 정리 완료 (최근 1000개 유지)');
      }

      // 통계 업데이트
      roomStats.messagesExchanged++;
      if (messageData.type === 'file' || messageData.type === 'image') {
        roomStats.filesUploaded++;
      }

      // 모든 클라이언트에게 메시지 브로드캐스트
      io.emit('message', message);

      // 메시지 로깅 (내용에 따라 다르게 표시)
      let logMessage;
      switch (message.type) {
        case 'text':
          const preview = message.content.length > 50 
            ? message.content.substring(0, 50) + '...' 
            : message.content;
          logMessage = `💬 ${messageData.userName}: "${preview}"`;
          if (message.isEncrypted) logMessage += ' 🔒';
          break;
        case 'image':
          logMessage = `🖼️  ${messageData.userName}: 이미지 업로드 - ${messageData.fileName}`;
          break;
        case 'file':
          logMessage = `📎 ${messageData.userName}: 파일 업로드 - ${messageData.fileName}`;
          break;
        default:
          logMessage = `📄 ${messageData.userName}: ${message.type} 메시지`;
      }
      
      console.log(logMessage);

    } catch (error) {
      console.error('❌ 메시지 전송 오류:', error);
      socket.emit('notification', '메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    }
  });

  // 타이핑 시작 처리
  socket.on('start_typing', (typingUser) => {
    try {
      if (!typingUser || !typingUser.userId || !typingUser.userName) {
        return;
      }

      // 타이핑 사용자 정보 저장
      typingUsers.set(typingUser.userId, {
        ...typingUser,
        socketId: socket.id,
        startTime: Date.now()
      });

      // 자신을 제외한 다른 사용자들에게 타이핑 상태 브로드캐스트
      socket.broadcast.emit('user_typing', typingUser);

      logActivity('⌨️  타이핑 시작', `${typingUser.userName}`);

    } catch (error) {
      console.error('❌ 타이핑 시작 처리 오류:', error);
    }
  });

  // 타이핑 중지 처리
  socket.on('stop_typing', (userId) => {
    try {
      if (!userId) return;

      const typingUser = typingUsers.get(userId);
      if (typingUser) {
        typingUsers.delete(userId);
        socket.broadcast.emit('user_stop_typing', userId);
        
        if (typingUser.userName) {
          logActivity('⌨️  타이핑 중지', `${typingUser.userName}`);
        }
      }

    } catch (error) {
      console.error('❌ 타이핑 중지 처리 오류:', error);
    }
  });

  // 사용자 명시적 퇴장 처리
  socket.on('leave', (userId) => {
    logActivity('👋 사용자 퇴장 요청', `User ID: ${userId}`);
    handleUserDisconnect(userId, socket.id);
  });

  // 사용자 상태 업데이트 요청 처리
  socket.on('get_users_list', () => {
    socket.emit('users_list', getCurrentUsers());
  });

  // 서버 정보 요청 처리
  socket.on('get_server_info', () => {
    socket.emit('server_info', {
      connectedUsers: connectedUsers.size,
      totalMessages: messages.length,
      serverUptime: process.uptime(),
      roomStats: roomStats
    });
  });

  // Socket 연결 해제 처리
  socket.on('disconnect', (reason) => {
    logActivity('❌ 연결 해제', `${socket.id} - 이유: ${reason}`);
    
    if (socket.userId) {
      handleUserDisconnect(socket.userId, socket.id);
    }
  });

  // Socket 오류 처리
  socket.on('error', (error) => {
    console.error('🔥 Socket 오류:', error);
    socket.emit('notification', '연결 오류가 발생했습니다. 페이지를 새로고침해주세요.', 'error');
  });

  // 연결 문제 발생 시 처리
  socket.on('connect_error', (error) => {
    console.error('🔥 연결 오류:', error);
  });
});

// 사용자 연결 해제 처리 함수
function handleUserDisconnect(userId, socketId) {
  try {
    const user = connectedUsers.get(userId);
    if (user && user.socketId === socketId) {
      // 사용자를 오프라인 상태로 변경 (완전 삭제하지 않음)
      user.isOnline = false;
      user.lastSeen = new Date();
      
      // 해당 사용자의 타이핑 상태 제거
      if (typingUsers.has(userId)) {
        typingUsers.delete(userId);
        io.emit('user_stop_typing', userId);
      }

      // 다른 사용자들에게 퇴장 알림
      io.emit('user_left', userId);
      
      // 업데이트된 사용자 목록 브로드캐스트
      broadcastUsersList();

      logActivity('👋 사용자 오프라인', `${user.name} (마지막 접속: ${user.lastSeen.toLocaleString()})`);
    }
  } catch (error) {
    console.error('❌ 사용자 연결 해제 처리 오류:', error);
  }
}

// 정기적인 정리 작업들

// 1. 타이핑 상태 정리 (30초 후 자동 제거)
const typingCleanupInterval = setInterval(() => {
  cleanupExpiredData();
}, 10000); // 10초마다 체크

// 2. 오프라인 사용자 정리 (1시간 후 완전 제거)
const userCleanupInterval = setInterval(() => {
  const now = Date.now();
  const expiredUsers = [];

  connectedUsers.forEach((user, userId) => {
    // 1시간(3600초) 이상 오프라인인 사용자들을 찾음
    if (!user.isOnline && now - new Date(user.lastSeen).getTime() > 3600000) {
      expiredUsers.push({ userId, userName: user.name });
    }
  });

  // 만료된 사용자들 제거
  expiredUsers.forEach(({ userId, userName }) => {
    connectedUsers.delete(userId);
    console.log(`🧹 오래된 오프라인 사용자 제거: ${userName} (${userId})`);
  });

  // 사용자 목록이 변경된 경우 브로드캐스트
  if (expiredUsers.length > 0) {
    broadcastUsersList();
    console.log(`📊 현재 등록된 사용자: ${connectedUsers.size}명`);
  }
}, 600000); // 10분마다 체크

// 3. 서버 상태 로깅 (5분마다)
const statusLogInterval = setInterval(() => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  console.log(`
📊 === 서버 상태 리포트 ===
⏰ 서버 가동 시간: ${Math.floor(uptime / 3600)}시간 ${Math.floor((uptime % 3600) / 60)}분
👥 연결된 사용자: ${connectedUsers.size}명
💬 총 메시지: ${messages.length}개
📁 업로드된 파일: ${roomStats.filesUploaded}개
🔄 총 연결 횟수: ${roomStats.totalConnections}회
💾 메모리 사용량: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB
⌨️  현재 타이핑 중: ${typingUsers.size}명
================================
  `);
}, 300000); // 5분마다

// 서버 시작
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  const startupMessage = `
🚀 ========================================
   Next Chat Live Socket.io 서버 시작!
========================================
📍 포트: ${PORT}
🌐 로컬 URL: http://localhost:${PORT}
🌍 네트워크 URL: http://0.0.0.0:${PORT}
📊 상태: 온라인 및 준비 완료
⏰ 시작 시간: ${new Date().toLocaleString()}

📋 지원 기능:
- ✅ 실시간 메시징 (WebSocket + Polling)
- ✅ 사용자 온라인 상태 추적
- ✅ 타이핑 인디케이터
- ✅ 파일 업로드 및 공유 지원
- ✅ 선택적 메시지 암호화
- ✅ 자동 데이터 정리 시스템
- ✅ 연결 상태 모니터링

🛠️  개발 정보:
- WebSocket 엔드포인트: ws://localhost:${PORT}
- HTTP API 엔드포인트: http://localhost:${PORT}
- 업로드 파일 경로: /uploads
- 허용된 Origin: ${allowedOrigins.join(', ')}
- 최대 버퍼 크기: 10MB

💡 사용법:
- 서버 상태: GET /
- 헬스 체크: GET /health  
- 통계 정보: GET /stats
- 파일 접근: GET /uploads/{filename}

⚠️  주의사항:
- 메시지는 메모리에 저장됩니다 (재시작 시 초기화)
- 프로덕션에서는 Redis/DB 사용을 권장합니다
- 파일은 public/uploads 폴더에 저장됩니다

🔧 서버 종료: Ctrl+C
========================================
  `;
  
  console.log(startupMessage);
  roomStats.startTime = new Date();
});

// Graceful 서버 종료 처리
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 ${signal} 신호를 받았습니다. 서버를 정리하고 종료합니다...`);
  
  // 정리 작업 타이머들 클리어
  clearInterval(typingCleanupInterval);
  clearInterval(userCleanupInterval);
  clearInterval(statusLogInterval);
  
  // 모든 클라이언트에게 서버 종료 알림
  io.emit('notification', '서버가 종료됩니다. 잠시 후 다시 연결해주세요. 🔄', 'error');
  
  // 잠시 대기 후 연결 정리
  setTimeout(() => {
    // 모든 Socket 연결 종료
    io.close(() => {
      console.log('✅ 모든 Socket 연결이 정리되었습니다.');
      
      // HTTP 서버 종료
      server.close(() => {
        console.log('✅ HTTP 서버가 종료되었습니다.');
        
        // 최종 통계 출력
        const finalStats = {
          totalConnections: roomStats.totalConnections,
          messagesExchanged: roomStats.messagesExchanged,
          filesUploaded: roomStats.filesUploaded,
          uptime: Math.floor(process.uptime()),
          endTime: new Date().toLocaleString()
        };
        
        console.log('\n📊 최종 서버 통계:');
        console.log(JSON.stringify(finalStats, null, 2));
        console.log('\n👋 Next Chat Live 서버가 정상적으로 종료되었습니다. 안녕히 계세요!');
        
        process.exit(0);
      });
    });
  }, 1000); // 1초 대기
};

// 다양한 종료 신호 처리
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGQUIT', () => gracefulShutdown('SIGQUIT'));

// 처리되지 않은 에러 처리
process.on('uncaughtException', (error) => {
  console.error('🔥 처리되지 않은 예외 발생:', error);
  console.error('스택 트레이스:', error.stack);
  
  // 에러 로그를 파일에 저장할 수도 있음
  // fs.appendFileSync('error.log', `${new Date().toISOString()} - ${error.message}\n${error.stack}\n\n`);
  
  // 심각한 오류이므로 서버 종료
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 처리되지 않은 Promise 거부:', reason);
  console.error('Promise:', promise);
  
  // 로그 기록
  // fs.appendFileSync('error.log', `${new Date().toISOString()} - Unhandled Rejection: ${reason}\n\n`);
});

// 메모리 경고 처리
process.on('warning', (warning) => {
  console.warn('⚠️  프로세스 경고:', warning.name);
  console.warn('메시지:', warning.message);
  console.warn('스택:', warning.stack);
});

// 서버 객체 내보내기 (테스트나 다른 모듈에서 사용할 수 있도록)
module.exports = { 
  server, 
  io, 
  app,
  // 유틸리티 함수들도 내보내기
  getCurrentUsers,
  broadcastUsersList,
  generateMessageId,
  handleUserDisconnect,
  // 상태 변수들 (읽기 전용으로 접근)
  getConnectedUsers: () => connectedUsers,
  getMessages: () => messages,
  getTypingUsers: () => typingUsers,
  getRoomStats: () => roomStats
};