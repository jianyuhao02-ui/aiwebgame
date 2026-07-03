import React from 'react'
import { Template } from '../data/templates'

type Props = {
  t: Template;
  onUse: (content: string) => void;
}

export const TemplateCard: React.FC<Props> = ({ t, onUse }) => {
  return (
    <div className="w-64 p-4 bg-white rounded-xl shadow-md flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t.title}</h3>
        <button onClick={() => onUse(t.content)} className="text-sm text-primary px-2 py-1 rounded-md border">使用</button>
      </div>
      <p className="text-xs text-gray-500">{t.description}</p>
      <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
        <pre className="whitespace-pre-wrap">{t.content}</pre>
      </div>
    </div>
  )
}

export default TemplateCard
