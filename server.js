const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح الـ API يقرأ من متغيرات البيئة السرية
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// تعليمات حضانة Roots المخصصة
const SYSTEM_INSTRUCTION = `
أنت المساعد الذكي الرسمي لـ "حضانة Roots" (Roots Nursery).
مهمتك: الرد على استفسارات أولياء الأمور بلباقة واحترافية وبلهجة ودودة باللغة العربية.

معلومات الحضانة:
- الرؤية: دمج التربية الحديثة مع تقنيات الذكاء الاصطناعي (AI) لتنمية مهارات الأطفال.
- مواعيد العمل: الأحد إلى الخميس من 7:30 صباحاً حتى 4:00 عصراً (الجمعة والسبت عطلة).
- البرامج:
  1. الحضانات الصغرى (Toddlers) من 1 - 2 سنة (رعاية فردية وتعديل سلوك وألعاب حسية).
  2. ما قبل التمهيدي (Pre-School) من 2 - 3 سنوات (تأسيس لغات، تخاطب، وفنون تفاعلية).
  3. الروضة وتأهيل المدرسة (Kindergarten) من 3 - 5 سنوات (تأهيل مقابلات المدارس، وتفكير منطقي وبرمجة).
- التواصل: هاتف/واتساب +20 100 000 0000، إيميل info@rootsnursery.com، العنوان: شارع الرئيسية بجوار النادي.

قواعد هامة:
- لا تذكر أسعاراً محددة للمصروفات، اطلب منهم بلطف التواصل عبر الواتساب للأمور المالية أو حجز موعد للزيارة.
`;

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body; // نستقبل سجل المحادثة من الموقع

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: SYSTEM_INSTRUCTION }]
                    },
                    contents: messages,
                    generationConfig: {
                        temperature: 0.3
                    }
                })
            }
        );

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أستطع فهم الرسالة جيداً.";
        res.json({ reply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ في الخادم" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));