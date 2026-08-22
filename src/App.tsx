import React, { useState } from 'react';
import { FeatureVector } from './types';
import { PRESET_SCENARIOS } from './data/presetScenarios';
import { Navbar, NavTab } from './components/Navbar';
import { SpectrumMatrix } from './components/SpectrumMatrix';
import { ClassifierPlayground } from './components/ClassifierPlayground';
import { VisualFuzzyEngine } from './components/VisualFuzzyEngine';
import { VisualNeuralNetwork } from './components/VisualNeuralNetwork';
import { LiveThreatStream } from './components/LiveThreatStream';
import { BenchmarkComparison } from './components/BenchmarkComparison';
import { TheoryKnowledgeHub } from './components/TheoryKnowledgeHub';
import { BatchEvaluator } from './components/BatchEvaluator';
import { MitigationAdvisor } from './components/MitigationAdvisor';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Activity, 
  Github, 
  Sparkles,
  Layers,
  Heart
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('playground');
  
  // Active telemetry feature vector in application state (defaults to Slowloris DoS preset)
  const [currentFeatures, setCurrentFeatures] = useState<FeatureVector>(
    PRESET_SCENARIOS[0].features
  );
  const [selectedPresetTitle, setSelectedPresetTitle] = useState<string>(
    PRESET_SCENARIOS[0].title
  );

  // Cross-component handlers
  const handleSelectAttackForTesting = (features: FeatureVector, name: string) => {
    setCurrentFeatures({ ...features });
    setSelectedPresetTitle(name);
    setActiveTab('playground');
  };

  const handleInspectPacketFromStream = (features: FeatureVector, name: string) => {
    setCurrentFeatures({ ...features });
    setSelectedPresetTitle(name);
    setActiveTab('playground');
  };

  // Derive system threat level based on current telemetry
  const computeSystemStatus = () => {
    if (currentFeatures.packetRate > 2000 || currentFeatures.rootShellCount > 2 || currentFeatures.packetEntropy > 7.5) {
      return { threatLevel: 'Critical' as const, activePacketsCount: currentFeatures.packetRate };
    }
    if (currentFeatures.packetRate > 500 || currentFeatures.failedLogins > 3 || currentFeatures.dnsQueryLength > 40) {
      return { threatLevel: 'Elevated' as const, activePacketsCount: currentFeatures.packetRate };
    }
    return { threatLevel: 'Low' as const, activePacketsCount: currentFeatures.packetRate };
  };

  const systemStatus = computeSystemStatus();

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">
        {activeTab === 'playground' && (
          <ClassifierPlayground
            currentFeatures={currentFeatures}
            setCurrentFeatures={setCurrentFeatures}
            selectedPresetTitle={selectedPresetTitle}
          />
        )}

        {activeTab === 'spectrum' && (
          <SpectrumMatrix
            onSelectAttackForTesting={handleSelectAttackForTesting}
          />
        )}

        {activeTab === 'neural-net' && (
          <VisualNeuralNetwork
            currentFeatures={currentFeatures}
          />
        )}

        {activeTab === 'fuzzy-engine' && (
          <VisualFuzzyEngine
            currentFeatures={currentFeatures}
          />
        )}

        {activeTab === 'live-stream' && (
          <LiveThreatStream
            onInspectPacket={handleInspectPacketFromStream}
          />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarkComparison />
        )}

        {activeTab === 'batch' && (
          <BatchEvaluator />
        )}

        {activeTab === 'mitigation' && (
          <MitigationAdvisor />
        )}

        {activeTab === 'theory' && (
          <TheoryKnowledgeHub />
        )}
      </main>

      {/* Futuristic Cyber Footer */}
      <footer className="relative z-10 bg-[#05070d] border-t border-slate-800/80 py-8 px-4 sm:px-6 mt-12 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">
              CyberSpectrum-AI Research Platform
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Soft Computing Threat Taxonomy</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>React JS + TypeScript + Tailwind</span>
            <span>•</span>
            <span>Fuzzy FIS · ANN · ANFIS · GA</span>
            <span>•</span>
            <span className="text-cyan-400">v2.4 Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
