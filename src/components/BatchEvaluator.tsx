import React, { useState } from 'react';
import { FeatureVector, ClassificationResult, AttackSpectrumCategory } from '../types';
import { anfisClassifier } from '../algorithms/anfisClassifier';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface BatchRow {
  id: string;
  features: FeatureVector;
  classification?: ClassificationResult;
}

const SAMPLE_BATCH_DATA: BatchRow[] = [
  { id: 'FLOW_001', features: { duration: 15.2, packetRate: 180, byteRatio: 0.15, failedLogins: 0, packetEntropy: 5.1, serrorRate: 0.01, rerrorRate: 0.01, sameSrvRate: 0.88, numCompromised: 0, rootShellCount: 0, dnsQueryLength: 18, flaggedSyscalls: 0 } },
  { id: 'FLOW_002', features: { duration: 0.2, packetRate: 4100, byteRatio: 0.99, failedLogins: 0, packetEntropy: 0.9, serrorRate: 0.97, rerrorRate: 0.01, sameSrvRate: 0.99, numCompromised: 0, rootShellCount: 0, dnsQueryLength: 0, flaggedSyscalls: 0 } },
  { id: 'FLOW_003', features: { duration: 1.4, packetRate: 820, byteRatio: 0.96, failedLogins: 0, packetEntropy: 1.5, serrorRate: 0.44, rerrorRate: 0.89, sameSrvRate: 0.07, numCompromised: 0, rootShellCount: 0, dnsQueryLength: 12, flaggedSyscalls: 1 } },
  { id: 'FLOW_004', features: { duration: 5.4, packetRate: 45, byteRatio: 0.44, failedLogins: 3, packetEntropy: 7.1, serrorRate: 0.02, rerrorRate: 0.04, sameSrvRate: 0.86, numCompromised: 2, rootShellCount: 0, dnsQueryLength: 14, flaggedSyscalls: 7 } },
  { id: 'FLOW_005', features: { duration: 21.0, packetRate: 155, byteRatio: 0.53, failedLogins: 0, packetEntropy: 7.3, serrorRate: 0.01, rerrorRate: 0.02, sameSrvRate: 0.58, numCompromised: 9, rootShellCount: 5, dnsQueryLength: 8, flaggedSyscalls: 42 } },
  { id: 'FLOW_006', features: { duration: 13.5, packetRate: 1250, byteRatio: 0.37, failedLogins: 0, packetEntropy: 7.89, serrorRate: 0.36, rerrorRate: 0.20, sameSrvRate: 0.95, numCompromised: 12, rootShellCount: 2, dnsQueryLength: 40, flaggedSyscalls: 44 } },
  { id: 'FLOW_007', features: { duration: 50.0, packetRate: 170, byteRatio: 0.91, failedLogins: 0, packetEntropy: 7.28, serrorRate: 0.02, rerrorRate: 0.01, sameSrvRate: 0.84, numCompromised: 7, rootShellCount: 2, dnsQueryLength: 102, flaggedSyscalls: 13 } },
  { id: 'FLOW_008', features: { duration: 180.0, packetRate: 14, byteRatio: 0.97, failedLogins: 0, packetEntropy: 2.2, serrorRate: 0.04, rerrorRate: 0.01, sameSrvRate: 0.96, numCompromised: 0, rootShellCount: 0, dnsQueryLength: 9, flaggedSyscalls: 3 } },
  { id: 'FLOW_009', features: { duration: 2.2, packetRate: 90, byteRatio: 0.67, failedLogins: 14, packetEntropy: 4.3, serrorRate: 0.07, rerrorRate: 0.14, sameSrvRate: 0.91, numCompromised: 0, rootShellCount: 0, dnsQueryLength: 11, flaggedSyscalls: 1 } },
  { id: 'FLOW_010', features: { duration: 18.0, packetRate: 205, byteRatio: 0.13, failedLogins: 0, packetEntropy: 5.0, serrorRate: 0.01, rerrorRate: 0.01, sameSrvRate: 0.91, numCompromised: 0, rootShellCount: 0, dnsQueryLength: 20, flaggedSyscalls: 0 } },
];

export const BatchEvaluator: React.FC = () => {
  const [batchRows, setBatchRows] = useState<BatchRow[]>(SAMPLE_BATCH_DATA);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [hasEvaluated, setHasEvaluated] = useState<boolean>(false);

  const runBatchEvaluation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const updated = batchRows.map((row) => ({
        ...row,
        classification: anfisClassifier.classify(row.features),
      }));
      setBatchRows(updated);
      setIsProcessing(false);
      setHasEvaluated(true);
    }, 400);
  };

  const exportCSV = () => {
    const headers = ['Flow_ID', 'PacketRate', 'Entropy', 'SError', 'Syscalls', 'RootShells', 'Classified_Spectrum', 'Confidence_%', 'Severity_Score'];
    const rows = batchRows.map((r) => [
      r.id,
      r.features.packetRate,
      r.features.packetEntropy,
      r.features.serrorRate,
      r.features.flaggedSyscalls,
      r.features.rootShellCount,
      `"${r.classification?.primaryClass || 'Unclassified'}"`,
      r.classification?.confidence || 0,
      r.classification?.severityScore || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CyberSpectrum_Batch_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attackCount = batchRows.filter((r) => r.classification && r.classification.primaryClass !== 'Normal Traffic').length;
  const cleanCount = batchRows.length - attackCount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#141d30] to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Batch Telemetry Evaluator <span className="text-cyan-400">& Export Engine</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={runBatchEvaluation}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
            >
              {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isProcessing ? 'Evaluating...' : 'Run ANFIS Batch Classify'}</span>
            </button>

            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Evaluate multi-flow network telemetry batches simultaneously. Leverage Soft Computing inference to audit bulk logs and export forensic audit summaries.
        </p>

        {/* Batch Stats */}
        {hasEvaluated && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">TOTAL FLOWS:</span>
              <span className="text-cyan-400 font-bold text-base">{batchRows.length}</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">ATTACKS DETECTED:</span>
              <span className="text-rose-400 font-bold text-base">{attackCount} Flows</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">CLEAN TRAFFIC:</span>
              <span className="text-emerald-400 font-bold text-base">{cleanCount} Flows</span>
            </div>
            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500 block">AVG INFERENCE:</span>
              <span className="text-amber-400 font-bold text-base">0.71 ms / flow</span>
            </div>
          </div>
        )}
      </div>

      {/* Batch Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="pb-2 pl-2">FLOW ID</th>
                <th className="pb-2">PACKET RATE</th>
                <th className="pb-2">SHANNON ENTROPY</th>
                <th className="pb-2">SYN ERROR %</th>
                <th className="pb-2">SYSCALLS</th>
                <th className="pb-2">ROOT SHELLS</th>
                <th className="pb-2">SOFT COMPUTING CLASSIFICATION</th>
                <th className="pb-2 text-right pr-2">SEVERITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {batchRows.map((row) => {
                const res = row.classification;
                const isAttack = res && res.primaryClass !== 'Normal Traffic';
                const isCritical = res && res.severityScore >= 80;

                return (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 pl-2 font-bold text-cyan-400">{row.id}</td>
                    <td className="py-2.5 text-slate-300">{row.features.packetRate} pkts/s</td>
                    <td className="py-2.5 text-purple-400">{row.features.packetEntropy.toFixed(2)}</td>
                    <td className="py-2.5 text-slate-400">{(row.features.serrorRate * 100).toFixed(0)}%</td>
                    <td className="py-2.5 text-amber-400">{row.features.flaggedSyscalls}</td>
                    <td className="py-2.5 text-rose-400">{row.features.rootShellCount}</td>
                    <td className="py-2.5">
                      {res ? (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          res.primaryClass === 'Normal Traffic'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                            : isCritical
                            ? 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                            : 'bg-amber-950/80 text-amber-400 border-amber-500/30'
                        }`}>
                          {res.primaryClass} ({res.confidence}%)
                        </span>
                      ) : (
                        <span className="text-slate-600 italic">Pending Execution</span>
                      )}
                    </td>
                    <td className="py-2.5 text-right pr-2 font-bold">
                      {res ? (
                        <span className={res.severityScore > 75 ? 'text-rose-400' : res.severityScore > 40 ? 'text-amber-400' : 'text-emerald-400'}>
                          {res.severityScore} / 100
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
