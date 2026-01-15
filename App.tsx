
import React, { useState } from 'react';
import { analyzeWebsite } from './services/gemini';
import { AuditResponse } from './types';
import AuditDashboard from './components/AuditDashboard';

function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const auditResult = await analyzeWebsite(input);
      setResult(auditResult);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during the audit.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">VANGUARD <span className="text-blue-500">AUDITOR</span></h1>
              <p className="text-[10px] text-slate-500 font-mono">v1.2.4-stable // AI Security Analyst</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <span className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                System Operational
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Input Section */}
        <section className={`transition-all duration-500 ${result ? 'mb-12' : 'mt-12 mb-24'}`}>
          <div className="max-w-3xl mx-auto text-center">
            {!result && (
              <>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Autonomous Threat Modeling</h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Provide a technical description, tech stack, or URL structure of your target system for a clinical security assessment.
                </p>
              </>
            )}
            
            <form onSubmit={handleAudit} className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Example: E-commerce app with Node.js backend, MongoDB, and AWS S3 storage. Users can upload profile pictures via /api/upload..."
                className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-600 resize-none"
              />
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 text-left">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Analysis Mode</p>
                  <p className="text-xs text-slate-400 italic">Deep Logic & OWASP Top 10 Focus</p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Scanning...
                    </>
                  ) : (
                    <>
                      Analyze Targets
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 text-red-400 rounded-lg text-sm text-left flex items-start gap-3">
                 <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
                 <span>{error}</span>
              </div>
            )}
          </div>
        </section>

        {/* Results Area */}
        {result && (
          <div className="max-w-5xl mx-auto">
            <AuditDashboard data={result} />
            <div className="mt-12 text-center pb-12">
               <button 
                 onClick={() => { setInput(''); setResult(null); }}
                 className="text-slate-500 hover:text-slate-300 transition-colors text-sm uppercase tracking-widest font-bold"
               >
                 Initiate New Session
               </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Disclaimer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.2em] mb-2">Legal Protocol Notice</p>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            DISCLAIMER: This tool is for authorized cybersecurity auditing and educational purposes only. Unauthorized testing of systems is illegal. Always obtain explicit written permission before performing any reconnaissance or exploitation tests.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
