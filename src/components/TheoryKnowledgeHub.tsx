import React, { useState } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  Activity, 
  Dna, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TheoryKnowledgeHub: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('fuzzy');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101b30] to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Soft Computing in Cybersecurity <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Theoretical Blueprint</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Soft Computing is an umbrella of computational intelligence methodologies (Fuzzy Sets, Neural Networks, Evolutionary Algorithms, and Rough Sets) designed to exploit the tolerance for imprecision, uncertainty, and partial truth to achieve tractability, robustness, and low solution cost in high-dimensional cyber threat classification.
        </p>
      </div>

      {/* Comparative Paradigm Card */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Hard Computing vs Soft Computing in Intrusion Detection
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-2">DIMENSION</th>
                <th className="p-2 text-rose-400">HARD / CRISP COMPUTING (Snort/IPTables)</th>
                <th className="p-2 text-cyan-400">SOFT COMPUTING (Fuzzy, ANN, ANFIS, GA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-2.5 font-bold text-white">Premise / Logic</td>
                <td className="p-2.5">Binary Boolean Logic (x ∈ &#123;0, 1&#125;). Exact crisp thresholds.</td>
                <td className="p-2.5 text-cyan-300">Continuous Membership (μ(x) ∈ [0, 1]). Multi-valued logic.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Noise & Obfuscation</td>
                <td className="p-2.5">Extremely brittle. Fails on slight packet padding or timing jitter.</td>
                <td className="p-2.5 text-cyan-300">High fault tolerance. Non-linear mapping absorbs noise and evasion.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Zero-Day Detection</td>
                <td className="p-2.5">Zero capability without explicit pre-compiled signature update.</td>
                <td className="p-2.5 text-cyan-300">Generalizes behavioral anomaly patterns to flag unseen variants.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-white">Mathematical Model</td>
                <td className="p-2.5">Deterministic state machines, regex parsing, exact byte matching.</td>
                <td className="p-2.5 text-cyan-300">Neural weight tensors, Takagi-Sugeno inference, genetic fitness.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Accordion Deep Dive Sections */}
      <div className="space-y-3">
        
        {/* 1. Fuzzy Logic */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('fuzzy')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">1. Fuzzy Inference Systems (Mamdani & Sugeno)</h4>
                <p className="text-[11px] text-slate-400 font-mono">Linguistic variables, fuzzification, IF-THEN rules, defuzzification</p>
              </div>
            </div>
            {openSection === 'fuzzy' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'fuzzy' && (
            <div className="p-4 pt-0 border-t border-slate-800/60 space-y-3 text-xs text-slate-300 font-mono">
              <p>
                In network intrusion detection, crisp boundaries (e.g., <code className="text-amber-400">packet_rate &gt; 1000</code>) generate false alarms during benign traffic surges. A Fuzzy Set A on universe X is defined by a membership function:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-cyan-300 space-y-1">
                <div>μ_A(x) : X → [0, 1]</div>
                <div>Gaussian Membership: μ(x; σ, c) = exp(-0.5 * ((x - c) / σ)²)</div>
                <div>Defuzzified Centroid: z* = ∫ (z · μ_C(z)) dz / ∫ μ_C(z) dz</div>
              </div>
              <p>
                Mamdani inference aggregates firing strengths across all rules via Max-Min composition, producing a smooth severity score that gracefully handles uncertain network state boundaries.
              </p>
            </div>
          )}
        </div>

        {/* 2. Artificial Neural Networks */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('neural')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                <Activity className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">2. Artificial Neural Networks (Deep Multi-Layer Perceptrons)</h4>
                <p className="text-[11px] text-slate-400 font-mono">Non-linear feature projection, ReLU activations, Softmax cross-entropy</p>
              </div>
            </div>
            {openSection === 'neural' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'neural' && (
            <div className="p-4 pt-0 border-t border-slate-800/60 space-y-3 text-xs text-slate-300 font-mono">
              <p>
                Neural networks learn high-dimensional latent representations of attack signatures by updating synaptic weights W through error backpropagation:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-300 space-y-1">
                <div>z^[l] = W^[l] · a^[l-1] + b^[l]</div>
                <div>a^[l] = ReLU(z^[l]) = max(0, z^[l])</div>
                <div>Softmax Output: P(Y = c | x) = exp(z_c) / Σ exp(z_k)</div>
              </div>
              <p>
                This allows the classifier to detect subtle combinations of features (e.g. low byte ratio + elevated entropy + specific syscalls) that single-rule firewalls cannot correlate.
              </p>
            </div>
          )}
        </div>

        {/* 3. ANFIS Hybrid Architecture */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('anfis')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">3. Adaptive Neuro-Fuzzy Inference System (ANFIS)</h4>
                <p className="text-[11px] text-slate-400 font-mono">First-order Takagi-Sugeno 5-layer hybrid learning architecture</p>
              </div>
            </div>
            {openSection === 'anfis' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'anfis' && (
            <div className="p-4 pt-0 border-t border-slate-800/60 space-y-3 text-xs text-slate-300 font-mono">
              <p>
                ANFIS marries the human-interpretable rule semantics of Fuzzy Logic with the self-tuning gradient optimization of Neural Networks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Layer 1: Fuzzification</span>
                  Computes premise parameter memberships: O_i^1 = μ_A_i(x).
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Layer 2: Rule Firing Product</span>
                  Calculates T-norm rule strength: w_i = μ_A_i(x) × μ_B_i(y).
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Layer 3: Normalization</span>
                  Normalized firing ratio: w_bar_i = w_i / Σ w_k.
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-cyan-400 font-bold block mb-1">Layer 4 & 5: Consequent Sum</span>
                  Linear combination: O_i^4 = w_bar_i · (p_i x + q_i y + r_i).
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Genetic Algorithms & PSO */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('ga')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-purple-950 text-purple-400 border border-purple-500/30">
                <Dna className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">4. Evolutionary Genetic Algorithms (GA) & Swarm Optimization (PSO)</h4>
                <p className="text-[11px] text-slate-400 font-mono">Dimensionality reduction, Pareto-optimal feature selection, hyperparameter search</p>
              </div>
            </div>
            {openSection === 'ga' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'ga' && (
            <div className="p-4 pt-0 border-t border-slate-800/60 space-y-3 text-xs text-slate-300 font-mono">
              <p>
                High-dimensional raw network flow logs contain noisy or collinear features. Genetic Algorithms evolve binary chromosome masks C ∈ &#123;0, 1&#125;^D to maximize detection accuracy while minimizing computational footprint:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-purple-300 space-y-1">
                <div>Fitness: f(C) = α · Accuracy(C) + (1 - α) · (1 - |C| / D)</div>
                <div>Particle Swarm Velocity: v_i^(t+1) = w · v_i^t + c_1 r_1 (p_i - x_i^t) + c_2 r_2 (g - x_i^t)</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
