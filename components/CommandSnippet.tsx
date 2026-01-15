
import React, { useState } from 'react';

interface CommandSnippetProps {
  command: string;
  label: string;
}

const CommandSnippet: React.FC<CommandSnippetProps> = ({ command, label }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 my-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{label}</span>
        <button 
          onClick={copyToClipboard}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap break-all">
        <code>$ {command}</code>
      </pre>
    </div>
  );
};

export default CommandSnippet;
