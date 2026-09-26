const MODEL = 'gemini-3.5-flash';

function makePrompt(industry) {
  return `Bạn là chuyên gia phân tích thị trường và cố vấn khởi nghiệp tại Việt Nam. Người dùng đang cân nhắc ngành nghề/lĩnh vực: "${industry}".

Hãy phân tích ngắn gọn, thực tế, dễ hiểu cho người mới bắt đầu, dựa trên bối cảnh thị trường Việt Nam hiện nay. Chỉ trả về JSON theo schema sau (giá trị bằng tiếng Việt):
{"nganh":"tên ngành nghề","tong_quan":"2-4 câu tổng quan","xu_huong":"2-3 câu xu hướng","kha_thi_diem":1,"kha_thi_ly_do":"1-2 câu giải thích","von_can_thiet":"mô tả vốn khởi điểm","ky_nang":["3-5 kỹ năng"],"rui_ro":["2-4 rủi ro"]}`;
}

function parseModelJson(text) {
  const result = JSON.parse(text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
  if (!result || typeof result !== 'object' || !result.nganh) throw new Error('Gemini trả về dữ liệu không hợp lệ.');
  result.kha_thi_diem = Math.max(1, Math.min(10, Math.round(Number(result.kha_thi_diem) || 5)));
  result.ky_nang = Array.isArray(result.ky_nang) ? result.ky_nang.slice(0, 5) : [];
  result.rui_ro = Array.isArray(result.rui_ro) ? result.rui_ro.slice(0, 4) : [];
  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ hỗ trợ yêu cầu POST.' });
  const industry = typeof req.body?.industry === 'string' ? req.body.industry.trim() : '';
  if (!industry || industry.length > 80) return res.status(400).json({ error: 'Vui lòng nhập ngành nghề từ 1 đến 80 ký tự.' });
  if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Dịch vụ AI chưa được cấu hình. Hãy thêm GEMINI_API_KEY vào Vercel.' });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: makePrompt(industry) }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 1200 }
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', payload);
      return res.status(502).json({ error: 'Dịch vụ Gemini hiện chưa phản hồi. Vui lòng thử lại sau.' });
    }
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('');
    return res.status(200).json({ data: parseModelJson(text || '') });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(502).json({ error: 'Không thể tạo phân tích lúc này. Vui lòng thử lại.' });
  }
}
