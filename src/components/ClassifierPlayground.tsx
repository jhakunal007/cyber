import React, { useState, useMemo } from 'react';
import { 
  AttackSpectrumCategory, 
  FeatureVector, 
  SoftComputingModelType, 
  ClassificationResult 
} from '../types';
import { PRESET_SCENARIOS } from '../data/presetScenarios';
import { fuzzyEngine } from '../algorithms/fuzzyInferenceEngine';
import { neuralClassifier } from '../algorithms/neuralNetworkClassifier';
import { anfisClassifier } from '../algorithms/anfisClassifier';
import { gaOptimizer } from '../algorithms/geneticAlgorithmOptimizer';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { 
  Cpu, 
  Sliders, 
  Sparkles, 
  Activity, 
  ShieldAlert, 
  Zap, 
  RotateCcw, 
  HelpCircle, 
  Layers, 
  Dna, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ClassifierPlaygroundProps {
  currentFeatures: FeatureVector;
  setCurrentFeatures: React.Dispatch<React.SetStateAction<FeatureVector>>;
  selectedPresetTitle?: string;
}

export const ClassifierPlayground: React.FC<ClassifierPlaygroundProps> = ({
  currentFeatures,
  setCurrentFeatures,
  selectedPresetTitle,
}) => {
  const [selectedModel, setSelectedModel] = useState<SoftComputingModelType>('anfis');
  const [activeTab, setActiveTab] = useState<'radar' | 'probabilities' | 'xai'>('probabilities');

  // Real-time classification execution
  const classificationResult: ClassificationResult = useMemo(() => {
    switch (selectedModel) {
      case 'fuzzy':
        return fuzzyEngine.classify(currentFeatures);
      case 'neural':
        return neuralClassifier.classify(currentFeatures);
      case 'ga_pso':
        return gaOptimizer.runOptimization(currentFeatures);
      case 'anfis':
      default:
        return anfisClassifier.classify(currentFeatures);
    }
  }, [currentFeatures, selectedModel]);

  const handleSliderChange = (key: keyof FeatureVector, value: number) => {
    setCurrentFeatures((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (preset) {
      setCurrentFeatures({ ...preset.features });
    }
  };

  // Chart data formatting
  const probabilityChartData = Object.entries(classificationResult.probabilities).map(([name, value]) => ({
    name: name.replace('Denial of Service (DoS/DDoS)', 'DoS/DDoS').replace('Advanced Persistent Threat (APT)', 'APT'),
    fullName: name,
    probability: value,
  }));

  const radarChartData = [
    { subject: 'Anomaly Score', score: classificationResult.radarMetrics.anomalyScore, fullMark: 100 },
    { subject: 'Volume Intensity', score: classificationResult.radarMetrics.volumeIntensity, fullMark: 100 },
    { subject: 'Payload Risk', score: classificationResult.radarMetrics.payloadRisk, fullMark: 100 },
    { subject: 'Stealth Level', score: classificationResult.radarMetrics.stealthLevel, fullMark: 100 },
    { subject: 'Privilege Risk', score: classificationResult.radarMetrics.privilegeEscalationRisk, fullMark: 100 },
    { subject: 'Kill Chain Phase', score: classificationResult.radarMetrics.killChainProgress, fullMark: 100 },
  ];

  const getBarColor = (category: string) => {
    if (category.includes('Normal')) return '#10b981';
    if (category.includes('Recon')) return '#3b82f6';
    if (category.includes('DoS')) return '#f59e0b';
    if (category.includes('R2L')) return '#a855f7';
    if (category.includes('U2R')) return '#f43f5e';
    if (category.includes('Malware')) return '#ef4444';
    return '#00f0ff';
  };

  const getSeverityBadgeColor = (score: number) => {
    if (score > 80) return 'text-rose-400 bg-rose-950/80 border-rose-500/40';
    if (score > 50) return 'text-amber-400 bg-amber-950/80 border-amber-500/40';
    if (score > 25) return 'text-blue-400 bg-blue-950/80 border-blue-500/40';
    return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Soft Computing Classifier Sandbox
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Select or tune telemetry feature vectors to evaluate real-time multi-spectrum cyber attack classification.
            </p>
          </div>

          {/* Model Selector Tabs */}
          <div className="w-full lg:w-auto bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 px-1 pb-1 sm:hidden">SELECT SOFT COMPUTING ALGORITHM:</div>
            <div className="grid grid-cols-2 sm:flex items-center gap-1.5">
              <button
                onClick={() => setSelectedModel('anfis')}
                className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 transition-all ${
                  selectedModel === 'anfis'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 sm:bg-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ANFIS Hybrid</span>
              </button>

              <button
                onClick={() => setSelectedModel('neural')}
                className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 transition-all ${
                  selectedModel === 'neural'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 sm:bg-transparent'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Neural (MLP)</span>
              </button>

              <button
                onClick={() => setSelectedModel('fuzzy')}
                className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 transition-all ${
                  selectedModel === 'fuzzy'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 sm:bg-transparent'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Fuzzy FIS</span>
              </button>

              <button
                onClick={() => setSelectedModel('ga_pso')}
                className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center sm:justify-start gap-1.5 transition-all ${
                  selectedModel === 'ga_pso'
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 sm:bg-transparent'
                }`}
              >
                <Dna className="w-3.5 h-3.5" />
                <span>GA-PSO</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Attack Scenario Presets */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              LOAD PRESET SCENARIOS:
            </span>
            <button
              onClick={() => handlePresetSelect('preset-normal')}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset to Clean Baseline
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset.id)}
                className="px-3 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 font-medium whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0"
              >
                <span className={`w-2 h-2 rounded-full ${
                  preset.badgeColor === 'rose' ? 'bg-rose-400' :
                  preset.badgeColor === 'amber' ? 'bg-amber-400' :
                  preset.badgeColor === 'purple' ? 'bg-purple-400' :
                  preset.badgeColor === 'cyan' ? 'bg-cyan-400' :
                  preset.badgeColor === 'blue' ? 'bg-blue-400' : 'bg-emerald-400'
                }`} />
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Telemetry Sliders on Left, Live Classification Result on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Feature Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Network Telemetry Features
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                12 Live Vectors
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-3 text-xs font-mono">
              {/* Packet Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Packet Ingress Rate:</span>
                  <span className="text-cyan-400 font-bold">{currentFeatures.packetRate} pkts/s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="50"
                  value={currentFeatures.packetRate}
                  onChange={(e) => handleSliderChange('packetRate', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0 (Quiet)</span>
                  <span>2500 (Moderate)</span>
                  <span>5000 (DDoS Flood)</span>
                </div>
              </div>

              {/* Payload Shannon Entropy */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Payload Shannon Entropy:</span>
                  <span className="text-purple-400 font-bold">{currentFeatures.packetEntropy.toFixed(2)} / 8.0</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8.0"
                  step="0.05"
                  value={currentFeatures.packetEntropy}
                  onChange={(e) => handleSliderChange('packetEntropy', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.0 (Uniform/Empty)</span>
                  <span>4.5 (Plaintext)</span>
                  <span>8.0 (Encrypted/Ransomware)</span>
                </div>
              </div>

              {/* SYN Error Rate */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">SYN Error Rate (SError):</span>
                  <span className="text-rose-400 font-bold">{(currentFeatures.serrorRate * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.02"
                  value={currentFeatures.serrorRate}
                  onChange={(e) => handleSliderChange('serrorRate', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              {/* REJ Error Rate */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Reject Error Rate (RError):</span>
                  <span className="text-blue-400 font-bold">{(currentFeatures.rerrorRate * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.02"
                  value={currentFeatures.rerrorRate}
                  onChange={(e) => handleSliderChange('rerrorRate', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
              </div>

              {/* Root Shell / Privileged Attempts */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Root Shell Spawns:</span>
                  <span className="text-red-400 font-bold">{currentFeatures.rootShellCount} shells</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={currentFeatures.rootShellCount}
                  onChange={(e) => handleSliderChange('rootShellCount', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-400"
                />
              </div>

              {/* Flagged Abnormal Syscalls */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Abnormal Syscalls:</span>
                  <span className="text-amber-400 font-bold">{currentFeatures.flaggedSyscalls} calls</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={currentFeatures.flaggedSyscalls}
                  onChange={(e) => handleSliderChange('flaggedSyscalls', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Failed Logins */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Failed Authentication Logins:</span>
                  <span className="text-purple-400 font-bold">{currentFeatures.failedLogins} attempts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={currentFeatures.failedLogins}
                  onChange={(e) => handleSliderChange('failedLogins', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

              {/* DNS Query Subdomain Length */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Avg DNS Query Length:</span>
                  <span className="text-cyan-400 font-bold">{currentFeatures.dnsQueryLength} chars</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="2"
                  value={currentFeatures.dnsQueryLength}
                  onChange={(e) => handleSliderChange('dnsQueryLength', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Connection Duration */}
              <div className="space-y-1 pt-2 border-t border-slate-800/60">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Connection Dwell Duration:</span>
                  <span className="text-emerald-400 font-bold">{currentFeatures.duration.toFixed(1)} s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="2"
                  value={currentFeatures.duration}
                  onChange={(e) => handleSliderChange('duration', Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Soft Computing Inference Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Primary Classification Result Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0e1628] to-slate-900 border border-cyan-500/40 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  CLASSIFIED ATTACK SPECTRUM:
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-0.5 tracking-tight">
                  {classificationResult.primaryClass}
                </h3>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">MODEL CONFIDENCE</span>
                  <span className="text-xl font-extrabold text-cyan-400 font-mono">
                    {classificationResult.confidence.toFixed(1)}%
                  </span>
                </div>

                <div className={`px-3 py-2 rounded-xl border text-center font-mono ${getSeverityBadgeColor(classificationResult.severityScore)}`}>
                  <span className="text-[10px] block opacity-80">THREAT SEVERITY</span>
                  <span className="text-base font-extrabold">{classificationResult.severityScore} / 100</span>
                </div>
              </div>
            </div>

            {/* Model Diagnostics Footprint */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-[11px] font-mono">
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">INFERENCE TIME:</span>
                <span className="text-emerald-400 font-semibold">{classificationResult.modelDiagnostics.inferenceTimeMs} ms</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">PARADIGM:</span>
                <span className="text-cyan-400 font-semibold uppercase">{classificationResult.modelDiagnostics.modelType}</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">UNCERTAINTY:</span>
                <span className="text-amber-400 font-semibold">{(100 - classificationResult.confidence).toFixed(1)}% Vagueness</span>
              </div>
              <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                <span className="text-slate-500 block">STATUS:</span>
                <span className="text-purple-400 font-semibold">Real-time Stream</span>
              </div>
            </div>
          </div>

          {/* Interactive Visual Views Tabs */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('probabilities')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'probabilities'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Spectrum Probability Dist
                </button>
                <button
                  onClick={() => setActiveTab('radar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'radar'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Threat Vector Radar
                </button>
                <button
                  onClick={() => setActiveTab('xai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'xai'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Explainable AI (XAI)
                </button>
              </div>

              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                Zero-Latency Feedback
              </span>
            </div>

            {/* TAB 1: Probabilities Bar Chart */}
            {activeTab === 'probabilities' && (
              <div className="space-y-4">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={probabilityChartData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                      <XAxis type="number" domain={[0, 100]} stroke="#64748b" tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090d16', borderColor: '#00f0ff', borderRadius: '8px', fontSize: '12px' }}
                        formatter={(value: any) => [`${value}% Probability`, 'Soft Computing Confidence']}
                      />
                      <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                        {probabilityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.fullName)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                  {probabilityChartData.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 truncate mr-1">{item.name}:</span>
                      <span className="font-bold" style={{ color: getBarColor(item.fullName) }}>{item.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Threat Vector Radar */}
            {activeTab === 'radar' && (
              <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarChartData}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                    <Radar name="Threat Dimension" dataKey="score" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#00f0ff', borderRadius: '8px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* TAB 3: Explainable AI (XAI) Attribution */}
            {activeTab === 'xai' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-300">
                  <span className="text-cyan-400 font-mono font-bold">SHAP-Like Feature Importance: </span>
                  Key telemetry variables that influenced the soft computing model's classification decision.
                </div>

                <div className="space-y-2.5">
                  {classificationResult.featureImportance.map((feat, idx) => (
                    <div key={idx} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-white font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          {feat.feature}
                        </span>
                        <span className="text-cyan-400 font-bold">{feat.impact}% Weight</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${feat.impact}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Automated Defense Playbook Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Recommended Autonomous Mitigation:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
              {classificationResult.recommendedMitigation.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
