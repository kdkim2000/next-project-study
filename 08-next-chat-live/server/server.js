// server/server.js
/**
 * 초보자를 위한 간단한 Socket.io 서버
 * 핵심 기능만 포함: 메시지 전송, 사용자 관리
 */
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 서버 상태 관리 (간단하게!)
let connectedUsers = new Map(); // userId -> 사용자 정보
let messages = []; // 메시지 히스토리

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: '채팅 서버가 실행 중입니다!',
    connectedUsers: connectedUsers.size,
    totalMessages: messages.length
  });
});

// Socket 연결 처리
io.on('connection', (socket) => {
  console.log('✅ 사용자 연결:', socket.id);

  // 사용자 입장
  socket.on('join', (user) => {
    console.log('👤 사용자 입장:', user.name);
    
    // 사용자 정보 저장
    connectedUsers.set(user.id, {
      ...user,
      socketId: socket.id,
      isOnline: true
    });
    
    socket.userId = user.id;
    
    // 다른 사용자들에게 알림
    socket.broadcast.emit('user_joined', user);
    
    // 현재 사용자에게 기존 메시지 전송 (최근 20개)
    const recentMessages = messages.slice(-20);
    socket.emit('message_history', recentMessages);
    
    // 전체 사용자 목록 전송
    const usersList = Array.from(connectedUsers.values()).map(u => ({
      id: u.id,
      name: u.name,
      isOnline: u.isOnline
    }));
    io.emit('users_list', usersList);
  });

  // 메시지 전송
  socket.on('send_message', (messageData) => {
    const message = {
      id: `msg_${Date.now()}`,
      ...messageData,
      timestamp: new Date()
    };

    // 메시지 저장 (최대 100개)
    messages.push(message);
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }

    // 모든 사용자에게 메시지 전송
    io.emit('new_message', message);
    
    console.log('💬 메시지:', `${messageData.userName}: ${messageData.content}`);
  });

  // 연결 해제
  socket.on('disconnect', () => {
    console.log('❌ 사용자 연결 해제:', socket.id);
    
    if (socket.userId) {
      const user = connectedUsers.get(socket.userId);
      if (user) {
        // 사용자를 오프라인으로 설정
        user.isOnline = false;
        
        // 다른 사용자들에게 알림
        socket.broadcast.emit('user_left', socket.userId);
        
        // 업데이트된 사용자 목록 전송
        const usersList = Array.from(connectedUsers.values()).map(u => ({
          id: u.id,
          name: u.name,
          isOnline: u.isOnline
        }));
        io.emit('users_list', usersList);
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`
🚀 채팅 서버가 시작되었습니다!
📍 포트: ${PORT}
🌐 URL: http://localhost:${PORT}
  `);
});