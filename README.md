# AI Web Game — Prompt Playground (MVP)

这是一个面向零基础用户的趣味化 AI 应用教学项目（MVP v0）。

目标：通过角色化引导与情绪化反馈，让用户在无代码环境中理解 prompt、看到模型输出，并能导出一个微型“AI 应用”。

由 @jianyuhao02-ui 与 Copilot 合作初始化。

本地运行

1. 克隆仓库并进入目录：

   git clone https://github.com/jianyuhao02-ui/aiwebgame.git
   cd aiwebgame

2. 安装依赖：

   npm install

3. 设置环境变量（可选）：

   - 在本地开发时，如果你有 OpenAI Key 可设置：
     OPENAI_API_KEY=sk-xxx

   - 如果未设置，API 会返回示例（mock）输出，前端仍可体验交互。

4. 运行开发服务器：

   npm run dev

5. 打开浏览器访问 http://localhost:3000

部署提示

- 推荐使用 Vercel：在项目设置里加入 OPENAI_API_KEY（如果需要调用真实模型）。

安全说明

- 不要在代码中写入 API Key；请通过环境变量或 Vercel/Fly/Netlify �� Secrets 功能管理。

下一步

- 我会继续分步迭代：添加模板卡拖拽、情绪动画、导出功能与关卡系统，每次完成会把改动推到仓库并在聊天中说明。
