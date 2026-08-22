export type AttackSpectrumCategory = 
  | 'Reconnaissance'
  | 'Denial of Service (DoS/DDoS)'
  | 'Remote to Local (R2L)'
  | 'User to Root (U2R)'
  | 'Malware & Ransomware'
  | 'Advanced Persistent Threat (APT)'
  | 'Normal Traffic';

export interface AttackSpectrumItem {
  id: string;
  name: string;
  category: AttackSpectrumCategory;
  severity: number; // 1 to 10
  severityLabel: 'Low' | 'Medium' | 'High' | 'Critical';
  mitreTactic: string;
  mitreTechniqueId: string;
  osiLayer: 'Application' | 'Transport' | 'Network' | 'Data Link' | 'Multi-layer';
  description: string;
  packetSignature: {
    protocol: string;
    typicalFlags: string;
    srcDstByteRatio: string;
    packetRate: string;
    payloadCharacteristics: string;
  };
  softComputingRule: string;
  detectionModelMatch: {
    fuzzyInference: string;
    neuralNetwork: string;
    anfis: string;
    geneticAlgorithm: string;
  };
  keyIndicators: string[];
  sampleFeatures: FeatureVector;
}

export interface FeatureVector {
  duration: number;           // Connection duration in seconds (0 - 300)
  packetRate: number;         // Packets per second (0 - 5000)
  byteRatio: number;          // Src bytes / (Src + Dst bytes) (0.0 - 1.0)
  failedLogins: number;       // Number of failed login attempts (0 - 20)
  packetEntropy: number;      // Shannon entropy of payload (0.0 - 8.0)
  serrorRate: number;         // SYN error rate (0.0 - 1.0)
  rerrorRate: number;         // REJ error rate (0.0 - 1.0)
  sameSrvRate: number;        // Rate of connections to same service (0.0 - 1.0)
  numCompromised: number;     // Number of compromised system states (0 - 15)
  rootShellCount: number;     // Root shell or privileged call attempts (0 - 10)
  dnsQueryLength: number;     // Avg length of DNS query strings (0 - 150)
  flaggedSyscalls: number;    // Abnormal syscall frequency (0 - 50)
}

export type SoftComputingModelType = 'fuzzy' | 'neural' | 'anfis' | 'ga_pso';

export interface ClassificationResult {
  primaryClass: AttackSpectrumCategory;
  confidence: number;          // 0 - 100%
  severityScore: number;       // 0 - 100
  probabilities: Record<AttackSpectrumCategory, number>;
  radarMetrics: {
    anomalyScore: number;
    volumeIntensity: number;
    payloadRisk: number;
    stealthLevel: number;
    privilegeEscalationRisk: number;
    killChainProgress: number;
  };
  featureImportance: { feature: string; impact: number; description: string }[];
  modelDiagnostics: {
    modelType: SoftComputingModelType;
    inferenceTimeMs: number;
    fuzzyDetails?: {
      firedRules: { ruleId: string; description: string; firingStrength: number }[];
      membershipBreakdown: Record<string, { low: number; medium: number; high: number }>;
      defuzzifiedCentroid: number;
    };
    neuralDetails?: {
      layerActivations: {
        input: number[];
        hidden1: number[];
        hidden2: number[];
        output: number[];
      };
      activeSynapses: number;
    };
    anfisDetails?: {
      premiseParameters: number[];
      consequentWeights: number[];
      ruleStrengths: number[];
    };
    gaDetails?: {
      selectedFeatures: string[];
      fitnessScore: number;
      generationsToConverge: number;
      featureReductionPercentage: number;
    };
  };
  recommendedMitigation: string[];
}

export interface LivePacketTelemetry {
  id: string;
  timestamp: string;
  sourceIp: string;
  destIp: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH';
  packetSize: number;
  flags: string;
  features: FeatureVector;
  classification?: ClassificationResult;
}

export interface PresetScenario {
  id: string;
  title: string;
  category: AttackSpectrumCategory;
  badgeColor: string;
  description: string;
  features: FeatureVector;
  expectedOutcome: string;
}

export interface BenchmarkMetrics {
  name: string;
  type: 'Soft Computing' | 'Crisp / Hard Computing';
  accuracy: number;
  fpr: number;
  f1Score: number;
  latencyMs: number;
  noiseTolerance: number; // % accuracy maintained under 25% noise
  color: string;
}
