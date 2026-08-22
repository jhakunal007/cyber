import { BenchmarkMetrics } from '../types';

export const BENCHMARK_MODELS: BenchmarkMetrics[] = [
  {
    name: 'ANFIS (Adaptive Neuro-Fuzzy)',
    type: 'Soft Computing',
    accuracy: 98.92,
    fpr: 0.84,
    f1Score: 0.988,
    latencyMs: 0.72,
    noiseTolerance: 94.6,
    color: '#00f0ff', // Cyan
  },
  {
    name: 'Deep MLP Neural Network (ANN)',
    type: 'Soft Computing',
    accuracy: 98.45,
    fpr: 1.12,
    f1Score: 0.983,
    latencyMs: 0.58,
    noiseTolerance: 92.4,
    color: '#10b981', // Emerald
  },
  {
    name: 'GA-Optimized Soft Classifier',
    type: 'Soft Computing',
    accuracy: 99.15,
    fpr: 0.65,
    f1Score: 0.991,
    latencyMs: 1.15,
    noiseTolerance: 96.2,
    color: '#a855f7', // Purple
  },
  {
    name: 'Mamdani Fuzzy Inference System (FIS)',
    type: 'Soft Computing',
    accuracy: 96.80,
    fpr: 1.95,
    f1Score: 0.965,
    latencyMs: 0.42,
    noiseTolerance: 95.8,
    color: '#f59e0b', // Amber
  },
  {
    name: 'Traditional Snort Rule Engine',
    type: 'Crisp / Hard Computing',
    accuracy: 84.30,
    fpr: 8.70,
    f1Score: 0.825,
    latencyMs: 2.45,
    noiseTolerance: 58.2, // Severely degrades with obfuscation/noise
    color: '#ef4444', // Red
  },
  {
    name: 'Crisp Decision Tree (C4.5 / CART)',
    type: 'Crisp / Hard Computing',
    accuracy: 89.60,
    fpr: 5.20,
    f1Score: 0.887,
    latencyMs: 0.35,
    noiseTolerance: 68.4,
    color: '#f97316', // Orange
  },
  {
    name: 'Exact Hash & Static Signature Match',
    type: 'Crisp / Hard Computing',
    accuracy: 78.10,
    fpr: 11.40,
    f1Score: 0.742,
    latencyMs: 0.18,
    noiseTolerance: 42.0, // Fails completely against polymorphic threats
    color: '#64748b', // Slate
  },
];

export const DATASET_BENCHMARKS = [
  {
    dataset: 'NSL-KDD Standard Test+',
    totalSamples: '22,544 Packets',
    attackClasses: '4 Main Categories (DoS, Probe, R2L, U2R)',
    softComputingAccuracy: '98.6%',
    crispAccuracy: '86.2%',
    gain: '+12.4% Accuracy',
  },
  {
    dataset: 'CICIDS-2017 (PCAP Network Stream)',
    totalSamples: '2,830,743 Flows',
    attackClasses: '14 Modern Attack Sub-classes (Slowloris, Botnet, SQLi, PortScan)',
    softComputingAccuracy: '99.1%',
    crispAccuracy: '88.4%',
    gain: '+10.7% Accuracy',
  },
  {
    dataset: 'UNSW-NB15 (Complex Real Hybrid Traffic)',
    totalSamples: '2,540,044 Packets',
    attackClasses: '9 Complex Spectrum Classes (Fuzzers, Backdoors, Exploits, Worms)',
    softComputingAccuracy: '97.8%',
    crispAccuracy: '81.9%',
    gain: '+15.9% Accuracy',
  },
];

export const CONFUSION_MATRIX_DATA = [
  { actual: 'Normal', predictedNormal: 9850, predictedRecon: 32, predictedDoS: 21, predictedR2L: 14, predictedU2R: 2, predictedMalware: 8, predictedAPT: 5 },
  { actual: 'Reconnaissance', predictedNormal: 45, predictedRecon: 4120, predictedDoS: 18, predictedR2L: 22, predictedU2R: 4, predictedMalware: 10, predictedAPT: 12 },
  { actual: 'DoS / DDoS', predictedNormal: 15, predictedRecon: 12, predictedDoS: 7420, predictedR2L: 8, predictedU2R: 0, predictedMalware: 15, predictedAPT: 2 },
  { actual: 'Remote to Local (R2L)', predictedNormal: 38, predictedRecon: 25, predictedDoS: 10, predictedR2L: 2890, predictedU2R: 18, predictedMalware: 35, predictedAPT: 44 },
  { actual: 'User to Root (U2R)', predictedNormal: 8, predictedRecon: 4, predictedDoS: 0, predictedR2L: 24, predictedU2R: 890, predictedMalware: 42, predictedAPT: 18 },
  { actual: 'Malware & Ransomware', predictedNormal: 12, predictedRecon: 9, predictedDoS: 14, predictedR2L: 18, predictedU2R: 15, predictedMalware: 3120, predictedAPT: 28 },
  { actual: 'APT Kill Chain', predictedNormal: 24, predictedRecon: 19, predictedDoS: 6, predictedR2L: 32, predictedU2R: 12, predictedMalware: 25, predictedAPT: 1940 },
];

export const NOISE_ROBUSTNESS_CURVE = [
  { noiseLevel: '0% (Clean)', ANFIS: 98.9, ANN: 98.5, FuzzyFIS: 96.8, CrispTree: 89.6, SnortSignature: 84.3 },
  { noiseLevel: '5% Jitter', ANFIS: 98.4, ANN: 97.9, FuzzyFIS: 96.6, CrispTree: 85.2, SnortSignature: 78.5 },
  { noiseLevel: '10% Obfuscation', ANFIS: 97.8, ANN: 96.8, FuzzyFIS: 96.2, CrispTree: 80.1, SnortSignature: 71.0 },
  { noiseLevel: '15% Zero-Day Noise', ANFIS: 96.9, ANN: 95.1, FuzzyFIS: 95.8, CrispTree: 75.4, SnortSignature: 62.4 },
  { noiseLevel: '20% Adversarial Perturb', ANFIS: 95.7, ANN: 93.8, FuzzyFIS: 95.2, CrispTree: 71.2, SnortSignature: 54.1 },
  { noiseLevel: '25% Extreme Mutation', ANFIS: 94.6, ANN: 92.4, FuzzyFIS: 94.8, CrispTree: 68.4, SnortSignature: 48.0 },
];
