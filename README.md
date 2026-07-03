# AI Web Game — Prompt Playground (MVP)

这是一个面向零基础用户的趣味化 AI 应用教学项目（MVP v0）。本 README 为逐步跑通指南，包含从本地开发、Supabase 配置、到部署 Vercel 的逐步操作与常见故障排查，帮助你快速把“保存宠物”功能启用并验证。

---

目录
- 本地快速跑通（最短路径）
- Supabase（启用保存功能）
- 环境变量（本地与部署）
- 部署到 Vercel
- 功能验证（交互检验清单）
- 常见问题与排查
- 安全注意事项
- 后续建议

---

一、本地快速跑通（最短路径，适合先体验 UI）
1. 克隆仓库并进入：

   git clone https://github.com/jianyuhao02-ui/aiwebgame.git
   cd aiwebgame

2. 安装依赖：

   npm install

3. 启动开发服务器：

   npm run dev

4. 打开浏览器：

   http://localhost:3000

说明：若你没有 Supabase 配置或没有设置 OPENAI_API_KEY，应用会以“示例模式（mock）”提供交互体验（不会调用外部 API 或保存到云）。这是最快的体验方式。

---

二、启用 Supabase（持久化“保存宠物”）
说明：启用后用户可以登录并保存/载入他们的宠物配置。下面为逐步操作：

1) 创建 Supabase 项目
- 前往 https://app.supabase.com 并创建一个新项目（选择免费层即可）。

2) 在 Supabase 控制台创建数据库表
- 打开项目 → SQL Editor → 输入并执行 `db/init.sql` 中的内容（仓库已包含该文件）。SQL 如下：

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

- 执行成功后，表 pets 会被创建，用于存储用户保存的数据。

3) 获取 Supabase Key 和 URL（用于环境变量）
- 在 Supabase 项目 → Settings → API 中找到：
  - Project URL → 复制到 NEXT_PUBLIC_SUPABASE_URL
  - anon (public) key → 复制到 NEXT_PUBLIC_SUPABASE_ANON_KEY
  - service_role key → 复制到 SUPABASE_SERVICE_KEY（**仅用于后端**）

4) 在项目中配置环境变量（本地或部署）
- 本地开发：在项目根目录创建 `.env.local`（不要 commit）并填入：

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key    # 可选：用于后端调用 OpenAI
```

- 部署（Vercel / Netlify / Fly）：在平台的项目设置中添加相同的环境变量

5) 验证 Supabase 是否生效（本地）
- 重新启动开发服务器（若已在运行，重启）：
  npm run dev

- 在浏览器打开 http://localhost:3000
- 右上角使用登录（magic link）功能输入邮箱并完成登录（会向 Supabase 发送登录邮件）
- 登录后，创建或拖拽模板并设置 prompt，然后点击“保存宠物”
- 在页面下方“已保存的宠物（最近）”应显示新保存的条目

注意（本地调试）：若 /api/save 返回 501 或提示 Supabase 未配置，请确认 SUPABASE_SERVICE_KEY 已在环境变量中设置，并且你重启了 dev 服务以加载 .env.local。

---

三、环境变量一览（要点）
- NEXT_PUBLIC_SUPABASE_URL — Supabase 项目 URL（公开 key，可放在前端）
- NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase 公共 anon key（前端使用）
- SUPABASE_SERVICE_KEY — Supabase service_role（仅后端使用，极其敏感）
- OPENAI_API_KEY — OpenAI Key（可选，后端用于调用模型）

安全指引：
- 绝对不要在公共仓库或导出文件中包含 SUPABASE_SERVICE_KEY 或 OPENAI_API_KEY。
- 在本地开发时，使用 `.env.local` 并把该文件加入 `.gitignore`（仓库已包含 .gitignore）。

---

四、部署到 Vercel（快速步骤）
1) 在 https://vercel.com 登录并选择 "New Project"
2) 选择你的 GitHub 仓库 `jianyuhao02-ui/aiwebgame`
3) 在部署设置中添加 Environment Variables（与本地 `.env.local` 相同）
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_KEY (只在 Server-side 可见)
   - OPENAI_API_KEY (可选)
4) 部署完成后，打开 Vercel 提供的域名访问，使用登录并测试保存/载入功能

提示：使用 Vercel 部署时，确保 `SUPABASE_SERVICE_KEY` 被设置为 Environment Variable 的 "Secret"（仅服务器可见）

---

五、功能验证（交互检验清单）
- UI 验证（无需 Supabase）
  - 页面能打开并渲染模板面板、我的应用面板与吉祥物动画
  - 点击模板卡会把内容填入 Prompt 编辑区
  - 点击生成按钮会在下方输出示例（若未配置 OPENAI_API_KEY）

- Supabase 与 Auth 验证（需 Supabase 配置）
  - 登录（magic link）能收到邮件并成功登录
  - 登录后点击“保存宠物”会把条目插入数据库（在 UI 列表中看到）
  - 点击“载入”能把宠物配置填回编辑区

- 导出验证
  - 点击“导出微应用”会下载 my-ai-microapp.html
  - 在本地打开导出 HTML，点击运行，若不填 key 会显示示例输出
  - 填入有效 OPENAI API key（仅用于本地测试）会调用 OpenAI 并显示真实返回（注意安全）

---

六、常见问题与排查
1) 登录邮件未收到
  - 检查 Supabase 项目是否在 free tier 且邮件服务未受限
  - 检查邮箱垃圾箱
  - 在本地开发，可选择直接测试 save API（使用 SUPABASE_SERVICE_KEY 在本地调用 /api/save）

2) /api/save 返回 501 或 500
  - 501：表示服务器端未配置 SUPABASE_* 环境变量，检查 .env.local 或部署平台 env
  - 500：通常表示 Supabase 插入错误（检查数据库表 schema 是否按 db/init.sql 创建）

3) Lottie 动画不显示
  - 确认 public/animations 目录下的 JSON 文件存在且可被静态服务器访问（在浏览器地址栏直接访问例如 /animations/idle.json）

4) 音效无法播放
  - 浏览器有自动播放策略，需要用户与页面交互才能解锁 AudioContext（点击任意按钮后再试）

5) 导出后页面调用 OpenAI 报 401
  - 确认你在导出页面手动填入的是有效 OpenAI Key（且没有被泄露）

---

七、安全与合规性提醒（务必遵守）
- 不要把任何 secret（SUPABASE_SERVICE_KEY / OPENAI_API_KEY）提交到 GitHub 或分享到公开渠道
- 对于生产环境，建议使用最小权限 key 并对 API 调用增加速率限制与记录（避免滥用）
- 若你计划公开导出功能，考虑在导出页面增加更明显的安全提醒，或改为提供“分享链接”由后端生成（更安全）

---

八、后续建议（短期与中期）
- 短期（1–3 天）：完成 Supabase 正式启用、增加导出页面样式与内嵌 Lottie、增加服务器端情绪判定缓存
- 中期（3–7 天）：完善用户账户页面、管理已保存的宠物（删除/分享权限）、增加导出为托管短链功能
- 长期：加入 RAG 关卡（文件上传 + embeddings）、多媒体关卡、课程化 Onboarding

---

如果你希望我把这份逐步跑通指南直接写入 README（我已经提交）、并且把一些自动化脚本（例如：一键在 Supabase 中创建表的脚本）加入仓库，我可以继续操作并提交更改。回复“请创建 supabase 自动化脚本”或“现在帮我写 Vercel 部署步骤截图指南”，我就继续处理并把变更推到仓库。