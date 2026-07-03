# AI Web Game — Prompt Playground (MVP)

这是一个面向零基础用户的趣味化 AI 应用教学项目（MVP v0）。

目标：通过角色化引导与情绪化反馈，让用户在无代码环境中理解 prompt、看到模型输出，并能导出一个微型“AI 应用”。

本仓库由 @jianyuhao02-ui 与 Copilot 合作初始化。

## 本地运行

1. 克隆仓库并进入目录：

   git clone https://github.com/jianyuhao02-ui/aiwebgame.git
   cd aiwebgame

2. 安装依赖：

   npm install

3. 设置环境变量（开发/部署）：

   在本地把以下变量写入 `.env.local`（或在 Vercel/部署平台的 Project Settings -> Environment Variables 中设置）：

   - NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   - SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>  # 仅 Server-side，极其敏感
   - OPENAI_API_KEY=<your-openai-key>  # 可选，用于在服务器端调用模型

   注意：*不要*把任何密钥提交到仓库或在公共场合泄露 `SUPABASE_SERVICE_KEY` / `OPENAI_API_KEY`。

4. 运行开发服务器：

   npm run dev

5. 打开浏览器访问 http://localhost:3000


## 部署建议（Vercel）

- 将仓库连接到 Vercel，设置上面的环境变量（在 Vercel 的项目设置里加入）。
- Vercel 会自动构建并部署 Next.js 应用。


## Supabase：启用“保存宠物”功能（逐步指南）

我已在仓库里加入 Supabase 客户端和后端 API（pages/api/save.ts、pages/api/load.ts），但要启用保存/载入需要你在 Supabase 控制台完成以下步骤：

1. 创建 Supabase 项目（免费层足够用于测试）。
2. 在 SQL Editor 中执行初始化 SQL（仓库内 `db/init.sql`）：

```sql
-- Init SQL for AIWebGame
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  prompt text,
  my_items jsonb,
  mascot text,
  created_at timestamptz DEFAULT now()
);
```

3. 在 Supabase 项目设置中找到：
   - Project URL → 复制到 `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → 复制到 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → 复制到 `SUPABASE_SERVICE_KEY`（**务必只放到后端环境变量**，不要泄露）

4. 将这些变量添加到 Vercel 项目（或在本地创建 `.env.local` 用于开发）：

   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_KEY=...
   OPENAI_API_KEY=...

5. 部署完成后，访问首页并使用右上角的登录（magic link）即可通过 Supabase Auth 登录并使用“保存宠物”功能。


## 导出与分享

- 页面提供“导出微应用（HTML）”与“导出 Node 示例（.js）”按钮：导出文件为单文件示例，默认以"示例模式"运行（不包含 Key）。若要调用真实模型，请在导出示例中手动填入 OPENAI API Key（**不要**把包含 Key 的导出文件公开）。


## 安全提示

- 永远不要在公有仓库或分享给他人的文件中包含 `SUPABASE_SERVICE_KEY` 或 `OPENAI_API_KEY`。
- `SUPABASE_SERVICE_KEY` 为高权限 key，必须仅在服务器端使用（已在 pages/api/save.ts 中按此设计）。


## 下一步建议

- 若你希望我替你完成 Supabase 表与 Vercel 环境变量的配置说明文档或帮助你把 SQL 运行的截图/执行步骤写入 README，我可以继续操作并推提交。只需回复“请继续完成 Supabase 配置说明”。


---

