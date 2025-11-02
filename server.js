

const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;


const upload = multer({ dest: 'uploads/' });


app.use(express.static('.'));


app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '没有上传图片文件' });
    }

    try {

        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Data = imageBuffer.toString('base64');
        

        const payload = {
            model: "llava:13b", 
            messages: [{
                role: "user",
                content: "你是一个专业的、严肃的图像分析引擎。请对这张图片进行严格的事实描述，识别出图片中的关键视觉元素。禁止任何联想、想象、或虚构不存在的物体。尤其禁止提及任何与机器人、科幻、科技、实验室相关的内容。请生成主体、场景、属性**三类标签，并以严格的JSON格式返回，不要包含任何 markdown 标记或额外的解释。例如，对于一张教堂图片，你应该返回：{\"subject\": [\"大教堂\", \"广场\", \"人群\"], \"scene\": [\"建筑立面\", \"天空\", \"城市景观\"], \"attribute\": [\"哥特式建筑\", \"历史遗迹\", \"旅游景点\"]}",
                images: [base64Data] 
            }],
            format: "json",   
            stream: false     
        };
        

        console.log('正在向本地Ollama API发送请求...');
        const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!ollamaResponse.ok) {
            const errorText = await ollamaResponse.text();
            console.error('Ollama API 返回错误:', errorText);
            throw new Error(`Ollama API 返回错误`);
        }
        
        const result = await ollamaResponse.json();
        console.log('成功从本地Ollama API获取到结果！');


        const content = JSON.parse(result.message.content);
        res.json(content);

    } catch (error) {
        console.error('处理请求时出错:', error);
       
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ message: '连接本地Ollama服务失败，请确认那个运行`ollama serve`的黑框窗口依然在后台运行。' });
        }
        res.status(500).json({ message: error.message });
    } finally {
        
        fs.unlinkSync(req.file.path);
    }
});


app.listen(port, () => {
    console.log(`服务器已成功启动！`);
    console.log(`请在浏览器中打开 http://localhost:${port}/AI图像标签生成器.html`);
});
