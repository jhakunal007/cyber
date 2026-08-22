import React, { useState } from 'react';
import { ATTACK_SPECTRUM_TAXONOMY } from '../data/attackSpectrum';
import { AttackSpectrumCategory, AttackSpectrumItem, FeatureVector } from '../types';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ExternalLink, 
  Zap, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface SpectrumMatrixProps {
  onSelectAttackForTesting: (features: FeatureVector, name: string) => void;
}

export const SpectrumMatrix: React.FC<SpectrumMatrixProps> = ({ onSelectAttackForTesting }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<AttackSpectrumItem | null>(null);

  const categories: { label: string; value: string; count: number; color: string }[] = [
    { label: 'All Spectrum Vectors', value: 'ALL', count: ATTACK_SPECTRUM_TAXONOMY.length, color: 'border-slate-700 text-slate-300' },
    { label: 'Reconnaissance', value: 'Reconnaissance', count: ATTACK_SPECTRUM_TAXONOMY.filter(i => i.category === 'Reconnaissance').length, color: 'border-blue-500/40 text-blue-400' },
    { label: 'DoS / DDoS', value: 'Denial of Service (DoS/DDoS)', count: ATTACK_SPECTRUM_TAXONOMY.filter(i => i.category === 'Denial of Service (DoS/DDoS)').length, color: 'border-amber-500/40 text-amber-400' },
    { label: 'Remote to Local (R2L)', value: 'Remote to Local (R2L)', count: ATTACK_SPECTRUM_TAXONOMY.filter(i => i.category === 'Remote to Local (R2L)').length, color: 'border-purple-500/40 text-purple-400' },
    { label: 'User to Root (U2R)', value: 'User to Root (U2R)', count: ATTACK_SPECTRUM_TAXONOMY.filter(i => i.category === 'User to Root (U2R)').length, color: 'border-rose-500/40 text-rose-400' },
    { label: 'Malware & Ransomware', value: 'Malware & Ransomware', count: ATTACK_SPECTRUM_TAXONOMY.filter(i => i.category === 'Malware & Ransomware').length, color: 'border-red-500/40 text-red-400' },
    { label: 'APT & Kill Chain', value: 'Advanced Persistent Threat (APT)', count: ATTACK_SPECTRUM_TAXONOMY.filter(i => i.category === 'Advanced Persistent Threat (APT)').length, color: 'border-cyan-500/40 text-cyan-400' },
  ];

  const filteredItems = ATTACK_SPECTRUM_TAXONOMY.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mitreTechniqueId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSeverityBadge = (level: string, score: number) => {
    switch (level) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-400 border border-rose-500/40">CRITICAL ({score}/10)</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-500/40">HIGH ({score}/10)</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/80 text-blue-400 border border-blue-500/40">MEDIUM ({score}/10)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">LOW ({score}/10)</span>;
    }
  };

  const getCategoryTheme = (category: AttackSpectrumCategory) => {
    switch (category) {
      case 'Denial of Service (DoS/DDoS)': return 'from-amber-500/20 to-transparent border-amber-500/30 text-amber-400';
      case 'Remote to Local (R2L)': return 'from-purple-500/20 to-transparent border-purple-500/30 text-purple-400';
      case 'User to Root (U2R)': return 'from-rose-500/20 to-transparent border-rose-500/30 text-rose-400';
      case 'Malware & Ransomware': return 'from-red-500/20 to-transparent border-red-500/30 text-red-400';
      case 'Advanced Persistent Threat (APT)': return 'from-cyan-500/20 to-transparent border-cyan-500/30 text-cyan-400';
      case 'Reconnaissance': return 'from-blue-500/20 to-transparent border-blue-500/30 text-blue-400';
      default: return 'from-emerald-500/20 to-transparent border-emerald-500/30 text-emerald-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1726] to-slate-900 border border-cyan-500/30 shadow-xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Layers className="w-80 h-80 text-cyan-400" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Taxonomy & Threat Spectrum Explorer
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cyber Attack Spectrum <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Taxonomy Matrix</span>
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Multi-dimensional threat landscape categorizing attack vectors from initial probing to multi-stage APT exfiltration, mapped against MITRE ATT&CK frameworks and classified via Soft Computing algorithms (Fuzzy Logic, Neural Networks, ANFIS & GA).
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">SPECTRUM CLASSES</span>
            <div className="text-xl font-bold text-cyan-400 font-mono">6 Threat + 1 Base</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">MITRE COVERAGE</span>
            <div className="text-xl font-bold text-emerald-400 font-mono">100% ATT&CK</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">OSI STACK REACH</span>
            <div className="text-xl font-bold text-purple-400 font-mono">L2 → L7 Deep</div>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono">SOFT CLASSIFIERS</span>
            <div className="text-xl font-bold text-amber-400 font-mono">4 Hybrid Engines</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by attack name, MITRE ID, description, or OSI layer..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{cat.label}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800/80 text-slate-300 font-mono">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Attack Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const theme = getCategoryTheme(item.category);
          return (
            <div
              key={item.id}
              className={`p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-950/20 flex flex-col justify-between group relative overflow-hidden`}
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-medium text-cyan-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                      {item.name}
                    </h3>
                  </div>
                  {getSeverityBadge(item.severityLabel, item.severity)}
                </div>

                {/* MITRE & OSI Tag */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.mitreTechniqueId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/40">
                    OSI: {item.osiLayer}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Fuzzy Rule Highlight */}
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] font-mono text-slate-300">
                  <span className="text-amber-400 font-semibold block mb-0.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Soft Computing Rule:
                  </span>
                  <p className="text-slate-400 line-clamp-2 text-[10px]">
                    {item.softComputingRule}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                >
                  Deep Inspection <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectAttackForTesting(item.sampleFeatures, item.name)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm group-hover:border-cyan-400"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Test in Sandbox</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c121e] border border-cyan-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20 p-6 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">{selectedItem.category}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-xs font-mono text-slate-400">{selectedItem.mitreTactic}</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">{selectedItem.name}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400">Threat Profile Overview</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                {selectedItem.description}
              </p>
            </div>

            {/* Packet Signature Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400">Network Packet Signature Profile</h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Protocol:</span>
                  <span className="text-cyan-400 font-semibold">{selectedItem.packetSignature.protocol}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Typical Flags:</span>
                  <span className="text-emerald-400 font-semibold">{selectedItem.packetSignature.typicalFlags}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Packet Rate Stress:</span>
                  <span className="text-amber-400 font-semibold">{selectedItem.packetSignature.packetRate}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block">Byte Asymmetry:</span>
                  <span className="text-purple-400 font-semibold">{selectedItem.packetSignature.srcDstByteRatio}</span>
                </div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-500 block">Payload Characteristics:</span>
                <span className="text-slate-300">{selectedItem.packetSignature.payloadCharacteristics}</span>
              </div>
            </div>

            {/* Soft Computing Classification Paradigm Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400">Soft Computing Detection Paradigms</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                  <div className="font-semibold text-amber-400 font-mono mb-1">Fuzzy Inference System (FIS):</div>
                  <div className="text-slate-300 text-xs">{selectedItem.detectionModelMatch.fuzzyInference}</div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                  <div className="font-semibold text-emerald-400 font-mono mb-1">Artificial Neural Network (MLP):</div>
                  <div className="text-slate-300 text-xs">{selectedItem.detectionModelMatch.neuralNetwork}</div>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30">
                  <div className="font-semibold text-cyan-400 font-mono mb-1">Hybrid ANFIS Architecture:</div>
                  <div className="text-slate-300 text-xs">{selectedItem.detectionModelMatch.anfis}</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30">
                  <div className="font-semibold text-purple-400 font-mono mb-1">Genetic Algorithm (Feature Selection):</div>
                  <div className="text-slate-300 text-xs">{selectedItem.detectionModelMatch.geneticAlgorithm}</div>
                </div>
              </div>
            </div>

            {/* Key Indicators */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase text-slate-400">Key Anomaly Indicators</h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem.keyIndicators.map((ind, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    {ind}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectAttackForTesting(selectedItem.sampleFeatures, selectedItem.name);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <Cpu className="w-4 h-4" />
                Load & Classify in Sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
