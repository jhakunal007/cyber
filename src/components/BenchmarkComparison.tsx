import React, { useState } from 'react';
import { 
  BENCHMARK_MODELS, 
  DATASET_BENCHMARKS, 
  CONFUSION_MATRIX_DATA, 
  NOISE_ROBUSTNESS_CURVE 
} from '../data/benchmarkData';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  Database
} from 'lucide-react';

export const BenchmarkComparison: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'accuracy' | 'fpr' | 'f1Score' | 'noiseTolerance'>('accuracy');

  const metricConfig = {
    accuracy: { label: 'Overall Classification Accuracy (%)', unit: '%', higherBetter: true },
    fpr: { label: 'False Positive Rate (FPR %)', unit: '%', higherBetter: false },
    f1Score: { label: 'Macro F1-Score (Harmonic Mean)', unit: '', higherBetter: true },
    noiseTolerance: { label: 'Noise & Obfuscation Resilience (%)', unit: '%', higherBetter: true },
  };

  const sortedModels = [...BENCHMARK_MODELS].sort((a, b) => {
    if (metricConfig[activeMetric].higherBetter) {
      return (b[activeMetric] as number) - (a[activeMetric] as number);
    }
    return (a[activeMetric] as number) - (b[activeMetric] as number);
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#121c2e] to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Empirical Benchmark Analytics: <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Soft vs Crisp Computing</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Comprehensive empirical evaluation across NSL-KDD, CICIDS-2017, and UNSW-NB15 benchmarks. Demonstrates how Soft Computing paradigms overcome the brittleness of traditional crisp IDS rule engines under adversarial noise and payload obfuscation.
        </p>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DATASET_BENCHMARKS.map((ds, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-cyan-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                {ds.dataset}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                {ds.gain}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Samples: <span className="text-slate-200">{ds.totalSamples}</span>
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Coverage: <span className="text-slate-300">{ds.attackClasses}</span>
            </p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">Soft: {ds.softComputingAccuracy}</span>
              <span className="text-rose-400">Crisp: {ds.crispAccuracy}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Comparative Bar Chart & Metric Selector */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Comparative Performance Leaderboard
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Evaluating 4 Soft Computing Classifiers vs 3 Traditional Crisp Signatures
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="w-full sm:w-auto bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="grid grid-cols-2 sm:flex items-center gap-1">
              <button
                onClick={() => setActiveMetric('accuracy')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeMetric === 'accuracy' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Accuracy
              </button>
              <button
                onClick={() => setActiveMetric('fpr')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeMetric === 'fpr' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                False Positives
              </button>
              <button
                onClick={() => setActiveMetric('f1Score')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeMetric === 'f1Score' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                F1-Score
              </button>
              <button
                onClick={() => setActiveMetric('noiseTolerance')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeMetric === 'noiseTolerance' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Noise Resilience
              </button>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-80 w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedModels} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" domain={[0, activeMetric === 'f1Score' ? 1.0 : activeMetric === 'fpr' ? 15 : 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 10 }} width={120} tickFormatter={(name) => name.length > 18 ? `${name.substring(0, 16)}...` : name} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#00f0ff', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}${metricConfig[activeMetric].unit}`, metricConfig[activeMetric].label]}
              />
              <Bar dataKey={activeMetric} radius={[0, 4, 4, 0]}>
                {sortedModels.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Noise Robustness Curve & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Noise & Obfuscation Resilience Curve (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Robustness Under Adversarial Noise & Jitter
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                0% → 25% Jitter
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={NOISE_ROBUSTNESS_CURVE} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="noiseLevel" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis domain={[40, 100]} stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#10b981', borderRadius: '8px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                  <Line type="monotone" dataKey="ANFIS" stroke="#00f0ff" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ANN" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="FuzzyFIS" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="CrispTree" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                  <Line type="monotone" dataKey="SnortSignature" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Observation: Soft computing maintains &gt;94% accuracy even with 25% adversarial payload mutation, whereas rigid crisp signatures plummet to 48%.
            </p>
          </div>
        </div>

        {/* Right Column: Confusion Matrix (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                ANFIS Multi-Class Confusion Matrix
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">98.92% Avg</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-[10px] font-mono border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="p-1 text-left">ACTUAL \ PRED</th>
                    <th className="p-1 text-emerald-400">NORM</th>
                    <th className="p-1 text-blue-400">RECON</th>
                    <th className="p-1 text-amber-400">DOS</th>
                    <th className="p-1 text-purple-400">R2L</th>
                    <th className="p-1 text-rose-400">U2R</th>
                    <th className="p-1 text-red-400">MAL</th>
                    <th className="p-1 text-cyan-400">APT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {CONFUSION_MATRIX_DATA.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="p-1.5 text-left font-bold text-slate-300 truncate max-w-[80px]">
                        {row.actual}
                      </td>
                      <td className={`p-1.5 ${idx === 0 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-500'}`}>{row.predictedNormal}</td>
                      <td className={`p-1.5 ${idx === 1 ? 'bg-blue-500/20 text-blue-300 font-bold' : 'text-slate-500'}`}>{row.predictedRecon}</td>
                      <td className={`p-1.5 ${idx === 2 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-500'}`}>{row.predictedDoS}</td>
                      <td className={`p-1.5 ${idx === 3 ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-slate-500'}`}>{row.predictedR2L}</td>
                      <td className={`p-1.5 ${idx === 4 ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-500'}`}>{row.predictedU2R}</td>
                      <td className={`p-1.5 ${idx === 5 ? 'bg-red-500/20 text-red-300 font-bold' : 'text-slate-500'}`}>{row.predictedMalware}</td>
                      <td className={`p-1.5 ${idx === 6 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'}`}>{row.predictedAPT}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-slate-500 font-mono text-center">
              Green diagonals represent correctly classified attack instances (True Positives).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
