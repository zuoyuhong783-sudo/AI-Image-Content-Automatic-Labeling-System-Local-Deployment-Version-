\# AI 图像内容自动标签系统（本地部署版）



作者：左宇宏



---



\## 🌟 项目亮点



这是一个从零到一独立设计并开发的全栈AI应用，旨在解决数字媒体资产管理中手动打标签效率低下的问题。项目核心在于实现了在个人消费级硬件上对通义千问-VL (Qwen-VL) 和LLaVA视觉大模型的本地化部署，并构建了从前端上传到后端处理再到AI分析的完整端到端工作流。



在开发过程中，我独立解决了超过15个覆盖\*\*网络配置、环境依赖、硬件驱动、安全策略及前后端代码的系统级难题，并成功运用提示词工程 (Prompt Engineering) 技术以及更换容量更大的模型显著提升了应用的分析准确率。



\## 🎥 项目演示



\*\*强烈建议通过下面的演示视频快速了解项目全貌！\*\*



<img width="2473" height="1207" alt="image" src="https://github.com/user-attachments/assets/f6cf350f-66a9-4aac-9934-dd40f41cf9db" />




[➡️ 点击此链接观看项目演示视频]https://www.youtube.com/watch?v=EA3K6iduPG4







\## 🖼️ 项目截图

<img width="1376" height="955" alt="image" src="https://github.com/user-attachments/assets/bbc29f1d-d7c9-4185-8aad-84471e263f12" />



\#### 初始效果：模型的“幻觉”现象

项目初期，压缩后的本地模型在处理复杂图像时，会出现严重的“模型幻觉”。



<img width="1210" height="744" alt="image" src="https://github.com/user-attachments/assets/19dd16d2-6bde-4869-bab0-2a1b6ce4c1b1" />



\#### 最终效果：通过模型替换优化后

通过对后端代码进行优化，设定了更精确的指令，切换更大容量更聪明的模型，成功抑制了幻觉，实现了准确的标签生成。



<img width="1391" height="766" alt="image" src="https://github.com/user-attachments/assets/879709c9-58c3-4685-b0ec-3f31e52e15a5" />




\## 🚀 项目介绍



在数字媒体和内容创作领域，海量的图片素材管理是一个巨大的挑战。手动为每张图片添加准确的标签耗时耗力。本项目旨在利用前沿的AI视觉大模型技术，开发一个自动化的图像内容分析与标签生成工具，以提升媒体库的检索效率和管理自动化水平。



与调用云端API的方案不同，本项目探索了将AI模型\*\*完全本地化部署\*\*的可行性，确保了数据隐私、降低了长期使用成本，并实现了离线运行。



\## 🛠️ 技术栈 (Tech Stack)





前端： `HTML5`, `CSS3`, `JavaScript (ES6)`, `TailwindCSS` 

后端： `Node.js`, `Express.js` 

AI模型部署： `Ollama` 

核心模型： `通义千问-VL (Qwen2.5-VL-Instruct)`, `LLaVA` 等 

核心技术： `本地模型部署`, `全栈开发`, `提示词工程 (Prompt Engineering)` 



\## 🏗️ 项目架构



本系统采用前后端分离的架构，数据流清晰，各模块职责明确


\*\*数据流说明:\*\*

1\.  \*\*浏览器 (前端)\*\*: 用户通过网页界面选择并上传图片。

2\.  \*\*Node.js (后端服务器)\*\*: 接收到前端发送的图片文件，将其转换为Base64编码。

3\.  \*\*Ollama (本地AI服务)\*\*: Node.js服务器将图片数据和经过优化的提示词（Prompt）一同发送给在本地运行的Ollama服务。

4\.  \*\*AI模型\*\*: Ollama调用图像识别大模型对图片进行分析，并根据指令生成一个包含标签的JSON字符串。

5\.  \*\*Node.js (后端服务器)\*\*: 接收到AI返回的JSON字符串，进行格式健壮性检查和处理，再将其发送回前端。

6\.  \*\*浏览器 (前端)\*\*: 接收到后端传来的JSON数据，解析并在界面上动态渲染出分类标签。



\## ⚙️ 本地运行指南



本项目可在Windows或macOS环境下进行本地部署。请确保您的计算机拥有至少8GB内存和一块性能较好的NVIDIA或AMD显卡（推荐6GB以上显存）。



1\.  \*\*安装 Ollama:\*\*

&nbsp;   \* 从 \[ollama.com](https://ollama.com/) 下载并安装Ollama。

&nbsp;   \* (可选) 根据需要设置 `OLLAMA\_MODELS` 环境变量，将模型文件存储在非系统盘。



2\.  \*\*启动 Ollama 服务:\*\*

&nbsp;   \* 打开一个命令提示符/终端窗口，运行以下命令以启动后台服务：

&nbsp;       ```bash

&nbsp;       ollama serve

&nbsp;       ```

&nbsp;   \* \*\*保持此窗口持续运行。\*\*



3\.  \*\*下载并创建模型:\*\*

&nbsp;   \* (推荐) 本项目最终采用手动导入方式以绕过网络问题。请先下载模型文件（例如 `Qwen2.5-VL-7B-Instruct-q5\_k\_m.gguf`）。

&nbsp;   \* 创建一个 `Modelfile` 文件，内容为 `FROM \[您下载的模型文件路径]`。

&nbsp;   \* 打开\*\*第二个\*\*终端窗口，运行以下命令创建模型：

&nbsp;       ```bash

&nbsp;       ollama create \[您想取的模型名] -f \[您的Modelfile路径]

&nbsp;       ```



4\.  \*\*安装项目依赖:\*\*

&nbsp;   \* 克隆或下载本仓库代码。

&nbsp;   \* 在\*\*第三个\*\*终端窗口中，`cd` 进入项目根目录。

&nbsp;   \* 运行 `npm install` 来安装Node.js依赖 (包括 `express`, `multer` 等)。



5\.  \*\*运行项目:\*\*

&nbsp;   \* 在\*\*第三个\*\*终端窗口中，运行以下命令启动后端服务器：

&nbsp;       ```bash

&nbsp;       node server.js

&nbsp;       ```

&nbsp;   \* 服务器成功启动后，打开浏览器访问 `http://localhost:3000/AI图像标签生成器.html` 即可开始使用。



---



\*\*感谢您的阅读！\*\*

