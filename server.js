// server.js (Ollama 本地部署最终版)

const express = require('express');
const fetch = require('node-fetch');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

// 设置 multer 用于临时存放上传的图片
const upload = multer({ dest: 'uploads/' });

// 托管前端HTML文件
app.use(express.static('.'));

// 创建API接口，专门用于接收图片并调用本地Ollama服务
app.post('/api/analyze-image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: '没有上传图片文件' });
    }

    try {
        // 1. 读取图片文件并转换为Base64编码
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Data = imageBuffer.toString('base64');
        
        // 2. 准备发送给本地Ollama API的数据包 (Payload)
        const payload = {
            model: "llava:13b", // 这是我们手动创建的新模型名称
            messages: [{
                role: "user",
                content: "你是一个专业的、严肃的图像分析引擎。请对这张图片进行严格的事实描述，识别出图片中的关键视觉元素。禁止任何联想、想象、或虚构不存在的物体。尤其禁止提及任何与机器人、科幻、科技、实验室相关的内容。请生成主体、场景、属性**三类标签，并以严格的JSON格式返回，不要包含任何 markdown 标记或额外的解释。例如，对于一张教堂图片，你应该返回：{\"subject\": [\"大教堂\", \"广场\", \"人群\"], \"scene\": [\"建筑立面\", \"天空\", \"城市景观\"], \"attribute\": [\"哥特式建筑\", \"历史遗迹\", \"旅游景点\"]}",
                images: [base64Data] // Ollama通过这个字段传递图片数据
            }],
            format: "json",   // 要求Ollama必须返回严格的JSON格式
            stream: false     // 关闭流式输出，一次性返回完整结果
        };
        
        // 3. 调用本地Ollama API (地址是 http://localhost:11434)
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

        // 4. 将Ollama返回的JSON内容再发送回给前端页面
        const content = JSON.parse(result.message.content);
        res.json(content);

    } catch (error) {
        console.error('处理请求时出错:', error);
        // 检查Ollama服务是否正在运行
        if (error.code === 'ECONNREFUSED') {
            return res.status(500).json({ message: '连接本地Ollama服务失败，请确认那个运行`ollama serve`的黑框窗口依然在后台运行。' });
        }
        res.status(500).json({ message: error.message });
    } finally {
        // 5. 请求处理完毕后，删除临时上传的图片文件
        fs.unlinkSync(req.file.path);
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器已成功启动！`);
    console.log(`请在浏览器中打开 http://localhost:${port}/AI图像标签生成器.html`);
});