import React, { useState } from 'react';
import { FeatureVector } from '../types';
import { fuzzyEngine, triangularMF, trapezoidalMF, gaussianMF } from '../algorithms/fuzzyInferenceEngine';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { 
  Layers, 
  Sparkles, 
  Activity, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  Info
} from 'lucide-react';

interface VisualFuzzyEngineProps {
  currentFeatures: FeatureVector;
}

export const VisualFuzzyEngine: React.FC<VisualFuzzyEngineProps> = ({ currentFeatures }) => {
  const [selectedVariable, setSelectedVariable] = useState<'packetRate' | 'entropy' | 'serrorRate'>('packetRate');

  // Compute fuzzy classification
  const fuzzyResult = fuzzyEngine.classify(currentFeatures);

  // Generate curves for Packet Rate (0 - 5000 pkts/s)
  const packetRateCurveData = Array.from({ length: 51 }, (_, i) => {
    const x = i * 100;
    const low = gaussianMF(x, 150, 180);
    const med = gaussianMF(x, 700, 350);
    const high = trapezoidalMF(x, 1200, 2500, 5000, 5000);
    return {
      x,
      'Low Rate (Baseline)': Math.round(low * 100) / 100,
      'Medium Rate (Suspicious)': Math.round(med * 100) / 100,
      'High Rate (Flood / DDoS)': Math.round(high * 100) / 100,
    };
  });

  // Generate curves for Payload Entropy (0 - 8.0)
  const entropyCurveData = Array.from({ length: 41 }, (_, i) => {
    const x = Math.round((i * 0.2) * 10) / 10;
    const low = triangularMF(x, 0, 1.5, 3.5);
    const med = triangularMF(x, 2.5, 4.5, 6.5);
    const high = trapezoidalMF(x, 5.5, 7.0, 8.0, 8.0);
    return {
      x,
      'Low (Uniform Text)': Math.round(low * 100) / 100,
      'Medium (Standard TLS)': Math.round(med * 100) / 100,
      'High (Encrypted / Ransomware)': Math.round(high * 100) / 100,
    };
  });

  // Generate curves for SYN Error Rate (0.0 - 1.0)
  const serrorCurveData = Array.from({ length: 21 }, (_, i) => {
    const x = Math.round((i * 0.05) * 100) / 100;
    const low = triangularMF(x, 0, 0, 0.2);
    const med = triangularMF(x, 0.15, 0.45, 0.75);
    const high = trapezoidalMF(x, 0.6, 0.85, 1.0, 1.0);
    return {
      x: `${(x * 100).toFixed(0)}%`,
      numericX: x,
      'Low (Healthy Handshakes)': Math.round(low * 100) / 100,
      'Medium (Network Congestion)': Math.round(med * 100) / 100,
      'High (SYN Flood Storm)': Math.round(high * 100) / 100,
    };
  });

  const activeCurveData = 
    selectedVariable === 'packetRate' ? packetRateCurveData :
    selectedVariable === 'entropy' ? entropyCurveData : serrorCurveData;

  const currentVal = 
    selectedVariable === 'packetRate' ? currentFeatures.packetRate :
    selectedVariable === 'entropy' ? currentFeatures.packetEntropy :
    currentFeatures.serrorRate;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#131b2e] to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
            <Layers className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Mamdani Fuzzy Inference System <span className="text-amber-400">(FIS) Engine</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Soft computing excels in handling uncertainty, vagueness, and noisy telemetry where crisp threshold rules produce false positives. Fuzzy sets transform continuous metrics into linguistic variables ($\mu(x) \in [0, 1]$), evaluate rule firings using Min-Max T-norm operators, and defuzzify via Center-of-Gravity (Centroid).
        </p>
      </div>

      {/* Main Grid: Membership Function Curves on Left, Fired Rules on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Membership Function Plotter */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  Linguistic Membership Curves $\mu(x)$
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Current Telemetry Marker: <span className="text-cyan-400 font-bold">{currentVal}</span>
                </p>
              </div>

              {/* Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setSelectedVariable('packetRate')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedVariable === 'packetRate' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Packet Rate
                </button>
                <button
                  onClick={() => setSelectedVariable('entropy')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedVariable === 'entropy' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Entropy
                </button>
                <button
                  onClick={() => setSelectedVariable('serrorRate')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedVariable === 'serrorRate' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  SYN Error
                </button>
              </div>
            </div>

            {/* Area Chart of Membership Functions */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 1]} stroke="#64748b" tickFormatter={(v) => `${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#f59e0b', borderRadius: '8px', fontSize: '11px' }} />
                  
                  <Area type="monotone" dataKey={Object.keys(activeCurveData[0])[1]} stroke="#10b981" fillOpacity={1} fill="url(#colorLow)" />
                  <Area type="monotone" dataKey={Object.keys(activeCurveData[0])[2]} stroke="#f59e0b" fillOpacity={1} fill="url(#colorMed)" />
                  <Area type="monotone" dataKey={Object.keys(activeCurveData[0])[3]} stroke="#f43f5e" fillOpacity={1} fill="url(#colorHigh)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Membership Degrees Summary */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-semibold block">μ_Low(x):</span>
                <span className="text-slate-200 text-sm font-bold">
                  {selectedVariable === 'packetRate' ? gaussianMF(currentFeatures.packetRate, 150, 180).toFixed(3) :
                   selectedVariable === 'entropy' ? triangularMF(currentFeatures.packetEntropy, 0, 1.5, 3.5).toFixed(3) :
                   triangularMF(currentFeatures.serrorRate, 0, 0, 0.2).toFixed(3)}
                </span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-amber-500/30">
                <span className="text-amber-400 font-semibold block">μ_Medium(x):</span>
                <span className="text-slate-200 text-sm font-bold">
                  {selectedVariable === 'packetRate' ? gaussianMF(currentFeatures.packetRate, 700, 350).toFixed(3) :
                   selectedVariable === 'entropy' ? triangularMF(currentFeatures.packetEntropy, 2.5, 4.5, 6.5).toFixed(3) :
                   triangularMF(currentFeatures.serrorRate, 0.15, 0.45, 0.75).toFixed(3)}
                </span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-rose-500/30">
                <span className="text-rose-400 font-semibold block">μ_High(x):</span>
                <span className="text-slate-200 text-sm font-bold">
                  {selectedVariable === 'packetRate' ? trapezoidalMF(currentFeatures.packetRate, 1200, 2500, 5000, 5000).toFixed(3) :
                   selectedVariable === 'entropy' ? trapezoidalMF(currentFeatures.packetEntropy, 5.5, 7.0, 8.0, 8.0).toFixed(3) :
                   trapezoidalMF(currentFeatures.serrorRate, 0.6, 0.85, 1.0, 1.0).toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Mamdani Rule Execution Matrix */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Mamdani Fuzzy Rule Base
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  {fuzzyResult.modelDiagnostics.fuzzyDetails?.firedRules.length || 0} active rules fired
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">DEFUZZIFIED CENTROID</span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {fuzzyResult.modelDiagnostics.fuzzyDetails?.defuzzifiedCentroid || 0} / 100
                </span>
              </div>
            </div>

            {/* List of Fired Rules */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {fuzzyResult.modelDiagnostics.fuzzyDetails?.firedRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-1.5 text-xs font-mono"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {rule.ruleId}
                    </span>
                    <span className="text-cyan-400 font-bold">
                      $\alpha = {rule.firingStrength}$
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug">
                    {rule.description}
                  </p>

                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                      style={{ width: `${Math.min(100, rule.firingStrength * 100)}%` }}
                    />
                  </div>
                </div>
              ))}

              {(!fuzzyResult.modelDiagnostics.fuzzyDetails?.firedRules.length) && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 font-mono">
                  No fuzzy rules fired with current parameter thresholds.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
