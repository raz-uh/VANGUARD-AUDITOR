
import React, { useState } from 'react';
import { AuditResponse, ThreatVector, BugBountyReport } from '../types';
import CommandSnippet from './CommandSnippet';

interface AuditDashboardProps {
  data: AuditResponse;
}

const SeverityBadge: React.FC<{ severity: ThreatVector['severity'] }> = ({ severity }) => {
  const colors = {
    Critical: 'bg-red-900/40 text-red-400 border-red-800',
    High: 'bg-orange-900/40 text-orange-400 border-orange-800',
    Medium: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
    Low: 'bg-green-900/40 text-green-400 border-green-800',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tighter ${colors[severity] || colors.Low}`}>
      {severity}
    </span>
  );
};

const BugBountyCard: React.FC<{ report: BugBountyReport }> = ({ report }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'poc'>('report');

  const copyFullReport = () => {
    const text = `
# Title: ${report.title}
# Vulnerability Type: ${report.vulnerabilityType}

## Impact:
${report.impact}

## Steps to Reproduce:
${report.stepsToReproduce.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Proof of Concept Explainer:
${report.pocExplainer}

## Proof of Concept / Validation Payload:
${report.validationPayload}

## Expected Outcome (Verification):
${report.expectedOutcome}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden mb-8 group transition-all hover:border-blue-500/50 shadow-2xl">
      {/* Header */}
      <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.346a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-.272.272a2 2 0 00-.586 1.414V19a2 2 0 002 2h14a2 2 0 002-2v-3.303a2 2 0 00-.586-1.414l-.272-.272z" />
              </svg>
           </div>
           <div>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest block leading-none mb-1">Audit Finding // ID-{Math.random().toString(36).substr(2, 5).toUpperCase()}</span>
              <h3 className="text-white font-bold">{report.title}</h3>
           </div>
        </div>
        
        <div className="flex gap-2">
           <button 
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'report' ? 'bg-slate-700 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Report Data
           </button>
           <button 
            onClick={() => setActiveTab('poc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'poc' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300'}`}
           >
             PoC Laboratory
           </button>
           <div className="w-px h-8 bg-slate-700 mx-1 hidden sm:block"></div>
           <button 
              onClick={copyFullReport}
              className={`text-xs px-4 py-1.5 rounded-lg font-bold transition-all ${copied ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}
            >
              {copied ? 'Copied' : 'Export Full'}
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'report' ? (
          <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
            <div>
              <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Vulnerability Impact
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/20 p-4 rounded-lg border border-slate-800">
                {report.impact}
              </p>
            </div>
            
            <div>
              <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-2">Standard Reproduction Flow</h4>
              <ul className="space-y-2">
                {report.stepsToReproduce.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-400 items-start">
                    <span className="text-blue-500 font-mono font-bold shrink-0 mt-0.5">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
            <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-lg">
               <h4 className="text-[10px] uppercase text-blue-400 font-bold mb-2">Proof of Concept Explainer</h4>
               <p className="text-sm text-slate-300 italic leading-relaxed">{report.pocExplainer}</p>
            </div>

            <div>
              <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-2">Validation Laboratory (PoC Payload)</h4>
              <CommandSnippet command={report.validationPayload} label="Active Exploit Payload" />
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
               <h4 className="text-[10px] uppercase text-green-500 font-bold mb-2">Validation Logic / Expected Outcome</h4>
               <div className="flex gap-3 text-sm text-slate-400 items-start">
                  <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{report.expectedOutcome}</span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AuditDashboard: React.FC<AuditDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Overview Section */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Executive Summary
        </h2>
        <p className="text-slate-300 leading-relaxed text-sm lg:text-base relative z-10">
          {data.summary}
        </p>
      </section>

      {/* Tech Stack Inference */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(data.techStack).map(([key, value]) => (
          <div key={key} className="bg-slate-900/30 border border-slate-800 p-4 rounded-lg group hover:border-blue-500/30 transition-all">
            <span className="text-[10px] uppercase text-slate-600 group-hover:text-blue-500 font-bold block mb-1">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-slate-300 font-medium text-xs break-words">{value}</span>
          </div>
        ))}
      </div>

      {/* Bug Bounty Reports with Proof Features */}
      <section>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white border-l-4 border-green-500 pl-3">Vulnerability Evidence & Reports</h2>
            <span className="animate-pulse flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20 font-bold uppercase tracking-wider">
               Validation Sync Active
            </span>
          </div>
          <p className="text-xs text-slate-500 italic">Click "PoC Laboratory" to view verification steps.</p>
        </div>
        <div>
          {data.bugBountyReports.map((report, idx) => (
            <BugBountyCard key={idx} report={report} />
          ))}
        </div>
      </section>

      {/* Strategic Reconnaissance */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-blue-600 pl-3">Verification Reconnaissance</h2>
        <div className="space-y-4">
          {data.reconPlan.map((step, idx) => (
            <div key={idx} className="bg-slate-800/10 p-4 rounded-xl border border-slate-800 group hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-600/20 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold border border-blue-600/30 uppercase tracking-widest">{step.tool}</span>
                <span className="text-slate-500 text-xs italic">Aim: {step.objective}</span>
              </div>
              <CommandSnippet command={step.command} label="Validation Probe" />
            </div>
          ))}
        </div>
      </section>

      {/* Logic Deep Dive */}
      <section>
        <h2 className="text-lg font-bold text-white mb-6 border-l-4 border-yellow-600 pl-3">Logic Vulnerability Diagnostics</h2>
        <div className="grid grid-cols-1 gap-4">
          {data.vulnerabilityLogic.map((logic, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:bg-slate-900 transition-all">
              <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 {logic.feature}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-950/40 p-4 rounded-lg border border-slate-800/50">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-widest">Technique Logic</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{logic.weakness}</p>
                </div>
                <div className="bg-blue-600/5 p-4 rounded-lg border border-blue-600/20">
                  <h4 className="text-[10px] uppercase font-bold text-blue-500/60 mb-2 tracking-widest">Remediation Blueprint</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{logic.mitigation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AuditDashboard;
