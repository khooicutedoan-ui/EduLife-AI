/* =============================================
   EduLife AI – server.js
   Backend Node.js + Express + Google Gemini API (Miễn phí)
   STEMPETITION 2027 – Challenge 5: Future Technology
   ============================================= */

'use strict';

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

// ============================================================
// KHỞI TẠO GEMINI CLIENT
// ============================================================
let geminiClient = null;

function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.includes('XXXX') || apiKey.trim() === '') {
      return null;
    }
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

// ============================================================
// SYSTEM PROMPT – Định hướng nhân cách EduLife AI
// ============================================================
const SYSTEM_PROMPT = `Bạn là EduLife AI – trợ lý học tập và đời sống thông minh, được xây dựng bởi đội AI Cybertech trong dự án STEMPETITION 2027.

NHIỆM VỤ CHÍNH:
- Hỗ trợ học sinh THCS và THPT Việt Nam học tập hiệu quả hơn.
- Giải thích kiến thức các môn học (Toán, Lý, Hóa, Văn, Anh, Sinh, Sử, Địa...) một cách dễ hiểu.
- Tư vấn phương pháp học tập, quản lý thời gian và xây dựng thói quen khoa học.

QUY TẮC TRẢ LỜI:
1. Luôn trả lời bằng tiếng Việt, ngôn ngữ gần gũi, dễ hiểu với học sinh.
2. Khi giải bài tập: trình bày từng bước rõ ràng, giải thích lý do từng bước, KHÔNG chỉ đưa đáp án.
3. Khuyến khích học sinh tự hiểu và tự làm, KHÔNG cổ vũ gian lận học tập.
4. Nếu không chắc chắn về một thông tin, phải nói rõ và khuyên học sinh kiểm tra lại từ sách giáo khoa.
5. KHÔNG bịa đặt thông tin, KHÔNG khẳng định chắc chắn khi thiếu dữ kiện.
6. KHÔNG đưa ra lời khuyên nguy hiểm, có hại cho sức khỏe hoặc an toàn.
7. Cấu trúc câu trả lời rõ ràng: dùng danh sách, ví dụ cụ thể khi thích hợp.
8. Cuối mỗi giải thích bài tập, hỏi lại: "Bạn có muốn tôi giải thích thêm bước nào không?"`;

// ============================================================
// ENDPOINT: POST /api/chat
// ============================================================
app.post('/api/chat', async (req, res) => {
  // Kiểm tra API key
  const client = getGeminiClient();
  if (!client) {
    return res.status(503).json({
      error: 'no_api_key',
      message: 'Chưa cấu hình Gemini API key. Vui lòng thêm GEMINI_API_KEY vào file .env.'
    });
  }

  // Kiểm tra dữ liệu đầu vào
  const { messages, message } = req.body;

  let conversationHistory = [];

  if (Array.isArray(messages) && messages.length > 0) {
    conversationHistory = messages
      .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.trim())
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content.trim() }));
  } else if (typeof message === 'string' && message.trim()) {
    conversationHistory = [{ role: 'user', content: message.trim() }];
  } else {
    return res.status(400).json({
      error: 'empty_message',
      message: 'Tin nhắn không được để trống.'
    });
  }

  const lastMsg = conversationHistory[conversationHistory.length - 1];
  if (!lastMsg || lastMsg.role !== 'user') {
    return res.status(400).json({
      error: 'invalid_message',
      message: 'Tin nhắn cuối phải là câu hỏi của người dùng.'
    });
  }

  if (lastMsg.content.length > 2000) {
    return res.status(400).json({
      error: 'message_too_long',
      message: 'Câu hỏi quá dài. Vui lòng giới hạn dưới 2000 ký tự.'
    });
  }

  // Gọi Gemini API
  try {
    const model = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Chuyển đổi lịch sử hội thoại sang định dạng Gemini
    // Gemini dùng 'user' và 'model' (không phải 'assistant')
    const geminiHistory = conversationHistory.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const result = await chat.sendMessage(lastMsg.content);
    const reply  = result.response.text();

    if (!reply) throw new Error('Gemini trả về phản hồi trống.');

    return res.json({ reply: reply.trim() });

  } catch (err) {
    console.error('[EduLife AI] Lỗi Gemini:', err.message);

    if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('invalid')) {
      return res.status(401).json({
        error: 'invalid_api_key',
        message: 'Gemini API key không hợp lệ. Kiểm tra lại GEMINI_API_KEY trong file .env.'
      });
    }
    if (err.message?.includes('RATE_LIMIT') || err.status === 429) {
      return res.status(429).json({
        error: 'rate_limit',
        message: 'Gửi quá nhiều yêu cầu. Vui lòng chờ vài giây rồi thử lại.'
      });
    }
    if (err.message?.includes('SAFETY')) {
      return res.status(400).json({
        error: 'safety_block',
        message: 'Câu hỏi bị chặn bởi bộ lọc an toàn. Vui lòng đặt câu hỏi khác.'
      });
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'network_error',
        message: 'Không thể kết nối đến Gemini. Kiểm tra kết nối internet.'
      });
    }

    return res.status(500).json({
      error: 'server_error',
      message: 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
    });
  }
});

// ============================================================
// ENDPOINT: GET /api/status
// ============================================================
app.get('/api/status', (req, res) => {
  const client = getGeminiClient();
  res.json({
    status: 'running',
    apiKeyConfigured: client !== null,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    provider: 'Google Gemini (Miễn phí)',
    version: '2.0.0'
  });
});

// ============================================================
// ROUTE MẶC ĐỊNH
// ============================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================================
// KHỞI ĐỘNG SERVER
// ============================================================
app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║       EduLife AI – Backend Server         ║');
  console.log('║       Powered by Google Gemini (Free)     ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`\n🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔍 Kiểm tra trạng thái: http://localhost:${PORT}/api/status`);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('AIzaSyXXX') || apiKey.trim() === '') {
    console.log('\n⚠️  CẢNH BÁO: Chưa cấu hình GEMINI_API_KEY!');
    console.log('   → Lấy key miễn phí tại: https://aistudio.google.com/app/apikey');
    console.log('   → Thêm vào file .env: GEMINI_API_KEY=AIzaSy...\n');
  } else {
    const maskedKey = apiKey.slice(0, 8) + '...' + apiKey.slice(-4);
    console.log(`\n✅ Gemini API Key đã cấu hình: ${maskedKey}`);
    console.log(`🤖 Model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
    console.log(`💰 Chi phí: MIỄN PHÍ\n`);
  }
});
