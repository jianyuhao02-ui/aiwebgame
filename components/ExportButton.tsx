import React from 'react'

type Props = {
  prompt: string;
  myItems: { id: string; title: string; description: string; content: string }[];
  mascot: 'cat' | 'dog';
  audioOn: boolean;
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const ExportButton: React.FC<Props> = ({ prompt, myItems, mascot }) => {
  function buildHTML() {
    const itemsHtml = myItems.map(it => `<li><strong>${escapeHtml(it.title)}</strong>: ${escapeHtml(it.content)}</li>`).join('\n');

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>My AI Micro-App</title>
  <style>
    body{font-family:Inter, Arial, sans-serif;background:#f7f7fb;color:#111;padding:24px}
    .card{background:white;border-radius:16px;padding:16px;box-shadow:0 6px 18px rgba(15,23,42,0.06);max-width:760px;margin:12px auto}
    .emoji{font-size:64px}
    button{background:#7c3aed;color:white;border:none;padding:8px 12px;border-radius:10px;cursor:pointer}
    pre{white-space:pre-wrap}
  </style>
</head>
<body>
  <div class="card">
    <h1>My AI Micro-App</h1>
    <p>吉祥物：${mascot}</p>
    <div>
      <h3>Prompt</h3>
      <pre id="prompt">${escapeHtml(prompt || '')}</pre>
    </div>
    <div>
      <h3>Components</h3>
      <ul>
        ${itemsHtml || '<li><em>无组件</em></li>'}
      </ul>
    </div>
    <div>
      <h3>Run (Demo)</h3>
      <p>此演示在浏览器中以 <em>示例模式</em> 运行；若要调用真实模型，请在下面填入你的 OpenAI API key（安全注意：不要在公共场合发布包含 key 的导出文件）。</p>
      <div style="display:flex;gap:8px;align-items:center">
        <input id="key" placeholder="OPENAI_API_KEY (可选)" style="flex:1;padding:8px;border-radius:8px;border:1px solid #e5e7eb" />
        <button id="run">运行</button>
      </div>
      <div style="margin-top:12px" id="result"></div>
    </div>
  </div>

  <script>
    const runBtn = document.getElementById('run');
    const resultEl = document.getElementById('result');
    runBtn.addEventListener('click', async () => {
      resultEl.innerText = '运行中…';
      const key = document.getElementById('key').value.trim();
      const prompt = document.getElementById('prompt').innerText;

      if (!key) {
        setTimeout(() => {
          resultEl.innerText = '（示例输出）这是一个本地导出的微应用示例。\nPrompt: ' + prompt;
        }, 600);
        return;
      }

      try {
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{role:'user', content: prompt }], max_tokens:300 })
        });
        const j = await resp.json();
        const text = j.choices?.[0]?.message?.content || JSON.stringify(j);
        resultEl.innerText = text;
      } catch (e) {
        resultEl.innerText = '调用失败：' + String(e);
      }
    });
  </script>
</body>
</html>
`;
  }

  function handleExport() {
    const html = buildHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-ai-microapp.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function handleExportNode() {
    const nodeCode = `// my-ai-microapp.js\n// Usage: node my-ai-microapp.js\n// Set OPENAI_API_KEY in env to enable real calls.\nconst fetch = require('node-fetch');\n(async function(){\n  const prompt = ${JSON.stringify(prompt || '')};\n  const key = process.env.OPENAI_API_KEY;\n  if (!key) {\n    console.log('示例模式：', prompt);\n    return;\n  }\n  const resp = await fetch('https://api.openai.com/v1/chat/completions',{\n    method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},\n    body: JSON.stringify({ model:'gpt-3.5-turbo', messages:[{role:'user', content: prompt}], max_tokens:400 })\n  });\n  const j = await resp.json();\n  console.log(j.choices?.[0]?.message?.content || JSON.stringify(j));\n})();`;
    const blob = new Blob([nodeCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-ai-microapp.js';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-2">
      <button onClick={handleExport} className="px-3 py-2 rounded-full bg-primary text-white">导出微应用</button>
      <button onClick={handleExportNode} className="px-3 py-2 rounded-full border">导出 Node 示例</button>
    </div>
  )
}

export default ExportButton
