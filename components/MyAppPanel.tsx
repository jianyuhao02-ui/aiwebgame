import React from 'react'
import { Template } from '../data/templates'

type Props = {
  items: Template[];
  onRemove: (id: string) => void;
  onDrop: (id: string) => void;
}

export const MyAppPanel: React.FC<Props> = ({ items, onRemove, onDrop }) => {
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/templateId');
    if (id) onDrop(id);
  }

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop} className="mt-4 p-4 rounded-xl border-dashed border-2 border-gray-200 min-h-[120px]">
      <h4 className="font-medium mb-2">我的应用面板（把魔法卡拖到这里）</h4>
      {items.length === 0 ? (
        <div className="text-sm text-gray-400">暂无组件 — 拖一个卡片到这里开始</div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
              <div>
                <button onClick={() => onRemove(item.id)} className="text-sm text-red-500">移除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppPanel
