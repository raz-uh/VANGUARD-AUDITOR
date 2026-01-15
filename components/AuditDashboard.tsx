
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

  const copyFullReport = () => {
    const text = `
# Title: ${report.title}
# Vulnerability Type: ${report.vulnerabilityType}

## Impact:
${report.impact}

## Steps to Reproduce:
${report.stepsToReproduce.map((s, i) => `${i + 1}. ${s}`).join('\n')}

## Proof of Concept / Validation:
${report.validationPayload}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden mb-6 group transition-all hover:border-blue-500/50">
      <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-1">Report Package</span>
          <h3 className="text-white font-bold">{report.title}</h3>
        </div>
        <button 
          onClick={copyFullReport}
          className={`text-xs px-4 py-2 rounded-lg font-bold transition-all ${copied ? 'bg-green-600 text-white' : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white'}`}
        >
          {copied ? 'Copied Full Report' : 'Copy for Submission'}
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-2">Technical Impact</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{report.impact}</p>
        </div>
        
        <div>
          <h4 className="text-[10px] uppercase text-slate-500 font-bold mb-2">Reproduction Steps</h4>
          <ul className="space-y-2">
            {report.stepsToReproduce.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-400">
                <span className="text-blue-500 font-mono font-bold">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800">
          <CommandSnippet command={report.validationPayload} label="Validation PoC / Payload" />
        </div>
      </div>
    </div>
  );
};

const AuditDashboard: React.FC<AuditDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Overview Section */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Executive Summary
        </h2>
        <p className="text-slate-300 leading-relaxed text-sm lg:text-base">
          {data.summary}
        </p>
      </section>

      {/* Tech Stack Inference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(data.techStack).map(([key, value]) => (
          <div key={key} className="bg-slate-900/30 border border-slate-800 p-4 rounded-lg">
            <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className="text-blue-400 font-medium text-sm lg:text-base break-words">{value}</span>
          </div>
        ))}
      </div>

      {/* Bug Bounty Reports - THE NEW HERO SECTION */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-lg font-bold text-white border-l-4 border-green-500 pl-3">Submission-Ready Reports</h2>
          <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20 font-bold uppercase tracking-wider">Bug Bounty Sync Enabled</span>
        </div>
        <div>
          {data.bugBountyReports.map((report, idx) => (
            <BugBountyCard key={idx} report={report} />
          ))}
        </div>
      </section>

      {/* Threat Model */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-red-600 pl-3">Predicted Threat Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.threatModel.map((threat, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-700 p-4 rounded-xl hover:border-slate-500 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-100">{threat.vector}</h3>
                <SeverityBadge severity={threat.severity} />
              </div>
              <p className="text-xs text-slate-400 leading-normal">{threat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reconnaissance Plan */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-blue-600 pl-3">Strategic Reconnaissance</h2>
        <div className="space-y-4">
          {data.reconPlan.map((step, idx) => (
            <div key={idx} className="bg-slate-800/20 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">{step.tool}</span>
                <span className="text-slate-400 text-xs italic">— {step.objective}</span>
              </div>
              <CommandSnippet command={step.command} label="Target Command" />
            </div>
          ))}
        </div>
      </section>

      {/* Vulnerability Logic */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-yellow-600 pl-3">Technical Deep Dive & Logic</h2>
        <div className="space-y-4">
          {data.vulnerabilityLogic.map((logic, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <h3 className="text-blue-400 font-bold mb-2">Feature: {logic.feature}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-1">Vulnerability Logic</h4>
                  <p className="text-xs text-slate-300">{logic.weakness}</p>
                </div>
                <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-1">Recommended Mitigation</h4>
                  <p className="text-xs text-slate-300">{logic.mitigation}</p>
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
