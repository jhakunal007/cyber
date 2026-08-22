import React, { useState } from 'react';
import { FeatureVector } from '../types';
import { neuralClassifier } from '../algorithms/neuralNetworkClassifier';
import { Activity, Sparkles, Zap, Cpu, Info, Layers } from 'lucide-react';

interface VisualNeuralNetworkProps {
  currentFeatures: FeatureVector;
}

export const VisualNeuralNetwork: React.FC<VisualNeuralNetworkProps> = ({ currentFeatures }) => {
  const [selectedNeuron, setSelectedNeuron] = useState<{ layer: string; index: number; value: number } | null>(null);

  // Compute neural forward pass
  const neuralResult = neuralClassifier.classify(currentFeatures);
  const activations = neuralResult.modelDiagnostics.neuralDetails?.layerActivations || {
    input: [0.1, 0.8, 0.4, 0.0, 0.9, 0.1, 0.2, 0.5],
    hidden1: [0.4, 0.9, 0.2, 0.7, 0.1, 0.8, 0.3, 0.6, 0.5, 0.2, 0.9, 0.4],
    hidden2: [0.8, 0.2, 0.7, 0.1, 0.9, 0.3, 0.6, 0.4],
    output: [0.05, 0.1, 0.05, 0.02, 0.75, 0.02, 0.01],
  };

  const inputLabels = ['Duration', 'PktRate', 'ByteRatio', 'Logins', 'Entropy', 'SError', 'RError', 'Syscalls'];
  const outputLabels = ['Normal', 'Recon', 'DoS', 'R2L', 'U2R', 'Malware', 'APT'];

  const width = 850;
  const height = 480;

  // Layer X Coordinates
  const layerX = {
    input: 90,
    hidden1: 320,
    hidden2: 560,
    output: 760,
  };

  // Node Positions Generator
  const getNodeY = (count: number, index: number) => {
    const spacing = (height - 80) / (count + 1);
    return 40 + spacing * (index + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101e33] to-slate-900 border border-emerald-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <Activity className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Artificial Neural Network <span className="text-emerald-400">(MLP) Architecture</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Deep Multi-Layer Perceptron (MLP) forward pass. Telemetry input vectors are non-linearly projected across two dense hidden layers with Rectified Linear Unit (ReLU) activations and a 7-class Softmax probability distribution layer.
        </p>
      </div>

      {/* Interactive SVG Neural Network Diagram */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              Live Forward Pass Activation Topology
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Active Synapses: <span className="text-cyan-400 font-bold">292 Connections</span></span>
            <span className="text-slate-400">Top Softmax: <span className="text-emerald-400 font-bold">{neuralResult.primaryClass} ({neuralResult.confidence}%)</span></span>
          </div>
        </div>

        {/* SVG Canvas Container */}
        <div className="w-full overflow-x-auto bg-[#070c17] rounded-xl border border-slate-800 p-2">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[700px]">
            <defs>
              {/* Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Synaptic Connections (Input -> Hidden 1) */}
            {activations.input.map((inAct, i) => {
              const y1 = getNodeY(8, i);
              return activations.hidden1.map((h1Act, j) => {
                const y2 = getNodeY(12, j);
                const intensity = Math.min(1, Math.max(0.05, inAct * h1Act * 1.4));
                return (
                  <line
                    key={`in-h1-${i}-${j}`}
                    x1={layerX.input}
                    y1={y1}
                    x2={layerX.hidden1}
                    y2={y2}
                    stroke={intensity > 0.4 ? '#00f0ff' : '#1e293b'}
                    strokeWidth={intensity > 0.4 ? 1.5 : 0.6}
                    strokeOpacity={intensity > 0.4 ? intensity : 0.25}
                  />
                );
              });
            })}

            {/* Synaptic Connections (Hidden 1 -> Hidden 2) */}
            {activations.hidden1.map((h1Act, j) => {
              const y1 = getNodeY(12, j);
              return activations.hidden2.map((h2Act, k) => {
                const y2 = getNodeY(8, k);
                const intensity = Math.min(1, Math.max(0.05, h1Act * h2Act * 1.5));
                return (
                  <line
                    key={`h1-h2-${j}-${k}`}
                    x1={layerX.hidden1}
                    y1={y1}
                    x2={layerX.hidden2}
                    y2={y2}
                    stroke={intensity > 0.4 ? '#10b981' : '#1e293b'}
                    strokeWidth={intensity > 0.4 ? 1.5 : 0.6}
                    strokeOpacity={intensity > 0.4 ? intensity : 0.2}
                  />
                );
              });
            })}

            {/* Synaptic Connections (Hidden 2 -> Output) */}
            {activations.hidden2.map((h2Act, k) => {
              const y1 = getNodeY(8, k);
              return activations.output.map((outAct, o) => {
                const y2 = getNodeY(7, o);
                const intensity = Math.min(1, Math.max(0.05, h2Act * outAct * 2.0));
                return (
                  <line
                    key={`h2-out-${k}-${o}`}
                    x1={layerX.hidden2}
                    y1={y1}
                    x2={layerX.output}
                    y2={y2}
                    stroke={intensity > 0.3 ? '#f43f5e' : '#1e293b'}
                    strokeWidth={intensity > 0.3 ? 2 : 0.6}
                    strokeOpacity={intensity > 0.3 ? intensity : 0.2}
                  />
                );
              });
            })}

            {/* Layer Labels */}
            <text x={layerX.input} y={22} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              INPUT (8)
            </text>
            <text x={layerX.hidden1} y={22} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              HIDDEN 1 (12 ReLU)
            </text>
            <text x={layerX.hidden2} y={22} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              HIDDEN 2 (8 ReLU)
            </text>
            <text x={layerX.output} y={22} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="monospace">
              OUTPUT (7 Softmax)
            </text>

            {/* INPUT NODES */}
            {activations.input.map((val, idx) => {
              const y = getNodeY(8, idx);
              const label = inputLabels[idx];
              return (
                <g 
                  key={`node-in-${idx}`}
                  className="cursor-pointer"
                  onClick={() => setSelectedNeuron({ layer: 'Input Layer', index: idx, value: val })}
                >
                  <circle
                    cx={layerX.input}
                    cy={y}
                    r={val > 0.5 ? 12 : 9}
                    fill={val > 0.5 ? '#00f0ff' : '#0f172a'}
                    stroke="#00f0ff"
                    strokeWidth="2"
                    filter={val > 0.5 ? 'url(#glow)' : undefined}
                  />
                  <text
                    x={layerX.input - 18}
                    y={y + 4}
                    textAnchor="end"
                    fill="#cbd5e1"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {label} ({val.toFixed(2)})
                  </text>
                </g>
              );
            })}

            {/* HIDDEN LAYER 1 NODES */}
            {activations.hidden1.map((val, idx) => {
              const y = getNodeY(12, idx);
              return (
                <g 
                  key={`node-h1-${idx}`}
                  className="cursor-pointer"
                  onClick={() => setSelectedNeuron({ layer: 'Hidden Layer 1 (ReLU)', index: idx, value: val })}
                >
                  <circle
                    cx={layerX.hidden1}
                    cy={y}
                    r={val > 0.4 ? 10 : 7}
                    fill={val > 0.4 ? '#10b981' : '#0f172a'}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    filter={val > 0.6 ? 'url(#glow)' : undefined}
                  />
                </g>
              );
            })}

            {/* HIDDEN LAYER 2 NODES */}
            {activations.hidden2.map((val, idx) => {
              const y = getNodeY(8, idx);
              return (
                <g 
                  key={`node-h2-${idx}`}
                  className="cursor-pointer"
                  onClick={() => setSelectedNeuron({ layer: 'Hidden Layer 2 (ReLU)', index: idx, value: val })}
                >
                  <circle
                    cx={layerX.hidden2}
                    cy={y}
                    r={val > 0.4 ? 11 : 8}
                    fill={val > 0.4 ? '#a855f7' : '#0f172a'}
                    stroke="#a855f7"
                    strokeWidth="1.5"
                    filter={val > 0.6 ? 'url(#glow)' : undefined}
                  />
                </g>
              );
            })}

            {/* OUTPUT NODES */}
            {activations.output.map((val, idx) => {
              const y = getNodeY(7, idx);
              const label = outputLabels[idx];
              const isMax = val >= Math.max(...activations.output);
              return (
                <g 
                  key={`node-out-${idx}`}
                  className="cursor-pointer"
                  onClick={() => setSelectedNeuron({ layer: 'Output Softmax', index: idx, value: val })}
                >
                  <circle
                    cx={layerX.output}
                    cy={y}
                    r={isMax ? 14 : 9}
                    fill={isMax ? '#f43f5e' : '#0f172a'}
                    stroke={isMax ? '#f43f5e' : '#64748b'}
                    strokeWidth="2"
                    filter={isMax ? 'url(#glow)' : undefined}
                  />
                  <text
                    x={layerX.output + 20}
                    y={y + 4}
                    textAnchor="start"
                    fill={isMax ? '#f43f5e' : '#94a3b8'}
                    fontSize="11"
                    fontWeight={isMax ? 'bold' : 'normal'}
                    fontFamily="monospace"
                  >
                    {label}: {(val * 100).toFixed(1)}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Neuron Inspector Footer */}
        {selectedNeuron && (
          <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-slate-400">INSPECTED NEURON:</span>
              <span className="text-white font-bold">{selectedNeuron.layer} - Node #{selectedNeuron.index}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Activation: <span className="text-cyan-400 font-bold">{selectedNeuron.value}</span></span>
              <button onClick={() => setSelectedNeuron(null)} className="text-slate-500 hover:text-white">✕</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
