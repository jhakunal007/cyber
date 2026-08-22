import { AttackSpectrumCategory, ClassificationResult, FeatureVector } from '../types';

// Helper membership functions
export function triangularMF(x: number, a: number, b: number, c: number): number {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

export function trapezoidalMF(x: number, a: number, b: number, c: number, d: number): number {
  if (x <= a || x >= d) return 0;
  if (x >= b && x <= c) return 1;
  if (x > a && x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

export function gaussianMF(x: number, mean: number, sigma: number): number {
  return Math.exp(-0.5 * Math.pow((x - mean) / sigma, 2));
}

export interface FuzzyRule {
  id: string;
  condition: string;
  consequent: AttackSpectrumCategory;
  weight: number;
  evaluate: (fv: FeatureVector) => number;
}

export class MamdaniFuzzyInferenceSystem {
  private rules: FuzzyRule[] = [];

  constructor() {
    this.initializeRuleBase();
  }

  private initializeRuleBase() {
    this.rules = [
      // Normal Traffic Rule
      {
        id: 'R1_NORMAL',
        condition: 'IF PacketRate is Normal AND SError is Low AND FailedLogins is Zero AND FlaggedSyscalls is Zero',
        consequent: 'Normal Traffic',
        weight: 1.0,
        evaluate: (fv) => {
          const muRate = gaussianMF(fv.packetRate, 200, 150);
          const muSerror = trapezoidalMF(fv.serrorRate, 0, 0, 0.05, 0.15);
          const muLogins = trapezoidalMF(fv.failedLogins, 0, 0, 0.5, 1.5);
          const muSyscalls = trapezoidalMF(fv.flaggedSyscalls, 0, 0, 0.5, 2);
          return Math.min(muRate, muSerror, muLogins, muSyscalls);
        },
      },
      // SYN Flood DoS
      {
        id: 'R2_SYN_FLOOD',
        condition: 'IF PacketRate is Extreme (>2000) AND SErrorRate is Very High (>0.8) AND SameSrvRate is High',
        consequent: 'Denial of Service (DoS/DDoS)',
        weight: 1.0,
        evaluate: (fv) => {
          const muRate = trapezoidalMF(fv.packetRate, 1000, 2500, 5000, 6000);
          const muSerror = trapezoidalMF(fv.serrorRate, 0.6, 0.85, 1.0, 1.0);
          const muSameSrv = trapezoidalMF(fv.sameSrvRate, 0.7, 0.9, 1.0, 1.0);
          return Math.min(muRate, muSerror, muSameSrv);
        },
      },
      // Slowloris DoS
      {
        id: 'R3_SLOWLORIS_DOS',
        condition: 'IF Duration is Long (>100s) AND PacketRate is Ultra-Low (<50) AND ByteRatio is Skewed',
        consequent: 'Denial of Service (DoS/DDoS)',
        weight: 0.95,
        evaluate: (fv) => {
          const muDuration = trapezoidalMF(fv.duration, 60, 120, 300, 400);
          const muRate = trapezoidalMF(fv.packetRate, 0, 0, 30, 80);
          const muByteRatio = trapezoidalMF(fv.byteRatio, 0.85, 0.94, 1.0, 1.0);
          return Math.min(muDuration, muRate, muByteRatio);
        },
      },
      // Reconnaissance Port Scan
      {
        id: 'R4_RECON_PORTSCAN',
        condition: 'IF RErrorRate is High (>0.6) AND SameSrvRate is Low (<0.2) AND PacketRate is Moderate/High',
        consequent: 'Reconnaissance',
        weight: 0.9,
        evaluate: (fv) => {
          const muRerror = trapezoidalMF(fv.rerrorRate, 0.5, 0.75, 1.0, 1.0);
          const muLowSameSrv = trapezoidalMF(fv.sameSrvRate, 0, 0, 0.15, 0.3);
          const muRate = trapezoidalMF(fv.packetRate, 200, 500, 3000, 4000);
          return Math.min(muRerror, muLowSameSrv, muRate);
        },
      },
      // SQL Injection / R2L
      {
        id: 'R5_R2L_SQLI',
        condition: 'IF PacketEntropy is High (>6.0) AND NumCompromised is Moderate (>1) AND Syscalls is Moderate',
        consequent: 'Remote to Local (R2L)',
        weight: 0.9,
        evaluate: (fv) => {
          const muEntropy = trapezoidalMF(fv.packetEntropy, 5.5, 6.5, 8.0, 8.0);
          const muComp = trapezoidalMF(fv.numCompromised, 1, 2, 8, 15);
          const muSyscalls = trapezoidalMF(fv.flaggedSyscalls, 2, 5, 20, 40);
          return Math.min(muEntropy, Math.max(muComp, muSyscalls));
        },
      },
      // Credential Stuffing / R2L
      {
        id: 'R6_R2L_BRUTEFORCE',
        condition: 'IF FailedLogins is High (>5) AND Duration is Short (<10s)',
        consequent: 'Remote to Local (R2L)',
        weight: 0.95,
        evaluate: (fv) => {
          const muLogins = trapezoidalMF(fv.failedLogins, 3, 8, 20, 25);
          const muDuration = trapezoidalMF(fv.duration, 0, 0, 5, 15);
          return Math.min(muLogins, muDuration);
        },
      },
      // User to Root (U2R) Privilege Escalation
      {
        id: 'R7_U2R_PRIV_ESC',
        condition: 'IF RootShellCount is High (>1) AND FlaggedSyscalls is Critical (>20)',
        consequent: 'User to Root (U2R)',
        weight: 1.0,
        evaluate: (fv) => {
          const muRootShell = trapezoidalMF(fv.rootShellCount, 0.5, 1.5, 10, 10);
          const muSyscalls = trapezoidalMF(fv.flaggedSyscalls, 15, 25, 50, 60);
          return Math.min(muRootShell, muSyscalls);
        },
      },
      // Ransomware & Malware
      {
        id: 'R8_RANSOMWARE',
        condition: 'IF PacketEntropy is Extreme (>7.5) AND NumCompromised is High (>8) AND FlaggedSyscalls is High',
        consequent: 'Malware & Ransomware',
        weight: 1.0,
        evaluate: (fv) => {
          const muEntropy = trapezoidalMF(fv.packetEntropy, 7.0, 7.6, 8.0, 8.0);
          const muComp = trapezoidalMF(fv.numCompromised, 5, 10, 15, 20);
          const muSyscalls = trapezoidalMF(fv.flaggedSyscalls, 18, 30, 50, 60);
          return Math.min(muEntropy, muComp, muSyscalls);
        },
      },
      // APT DNS Exfiltration
      {
        id: 'R9_APT_DNS_EXFIL',
        condition: 'IF DNSQueryLength is Extreme (>60) AND PacketEntropy is High (>6.5)',
        consequent: 'Advanced Persistent Threat (APT)',
        weight: 0.95,
        evaluate: (fv) => {
          const muDnsLen = trapezoidalMF(fv.dnsQueryLength, 40, 70, 150, 150);
          const muEntropy = trapezoidalMF(fv.packetEntropy, 6.0, 7.0, 8.0, 8.0);
          return Math.min(muDnsLen, muEntropy);
        },
      },
      // APT Lateral Kill Chain
      {
        id: 'R10_APT_KILLCHAIN',
        condition: 'IF NumCompromised is High (>6) AND Duration is Prolonged (>30s) AND RootShellCount is Moderate',
        consequent: 'Advanced Persistent Threat (APT)',
        weight: 0.85,
        evaluate: (fv) => {
          const muComp = trapezoidalMF(fv.numCompromised, 4, 8, 15, 20);
          const muDuration = trapezoidalMF(fv.duration, 20, 45, 200, 300);
          const muRootShell = trapezoidalMF(fv.rootShellCount, 0.5, 2, 6, 10);
          return Math.min(muComp, muDuration, muRootShell);
        },
      },
    ];
  }

  public classify(features: FeatureVector): ClassificationResult {
    const startTime = performance.now();

    // 1. Evaluate Rule Firings
    const firedRules: { ruleId: string; description: string; firingStrength: number }[] = [];
    const classScores: Record<AttackSpectrumCategory, number> = {
      'Normal Traffic': 0.05,
      'Reconnaissance': 0.02,
      'Denial of Service (DoS/DDoS)': 0.02,
      'Remote to Local (R2L)': 0.02,
      'User to Root (U2R)': 0.01,
      'Malware & Ransomware': 0.01,
      'Advanced Persistent Threat (APT)': 0.01,
    };

    for (const rule of this.rules) {
      const strength = rule.evaluate(features) * rule.weight;
      if (strength > 0.001) {
        firedRules.push({
          ruleId: rule.id,
          description: rule.condition,
          firingStrength: Math.round(strength * 1000) / 1000,
        });
        // Mamdani aggregation: Max union
        classScores[rule.consequent] = Math.max(classScores[rule.consequent], strength);
      }
    }

    // 2. Compute Probabilities (Softmax normalized from scores)
    const sumScores = Object.values(classScores).reduce((a, b) => a + b, 0);
    const probabilities: Record<AttackSpectrumCategory, number> = {
      'Normal Traffic': 0,
      'Reconnaissance': 0,
      'Denial of Service (DoS/DDoS)': 0,
      'Remote to Local (R2L)': 0,
      'User to Root (U2R)': 0,
      'Malware & Ransomware': 0,
      'Advanced Persistent Threat (APT)': 0,
    };

    let maxProb = -1;
    let primaryClass: AttackSpectrumCategory = 'Normal Traffic';

    for (const key of Object.keys(classScores) as AttackSpectrumCategory[]) {
      const p = Math.round((classScores[key] / sumScores) * 1000) / 10;
      probabilities[key] = p;
      if (p > maxProb) {
        maxProb = p;
        primaryClass = key;
      }
    }

    // 3. Compute Defuzzified Severity Score (Centroid method simulation)
    const categorySeverityWeight: Record<AttackSpectrumCategory, number> = {
      'Normal Traffic': 5,
      'Reconnaissance': 35,
      'Remote to Local (R2L)': 70,
      'Denial of Service (DoS/DDoS)': 82,
      'User to Root (U2R)': 95,
      'Malware & Ransomware': 96,
      'Advanced Persistent Threat (APT)': 92,
    };

    let defuzzifiedCentroid = 0;
    for (const cat of Object.keys(probabilities) as AttackSpectrumCategory[]) {
      defuzzifiedCentroid += (probabilities[cat] / 100) * categorySeverityWeight[cat];
    }
    defuzzifiedCentroid = Math.min(100, Math.max(0, Math.round(defuzzifiedCentroid)));

    // 4. Radar Metrics Calculation
    const radarMetrics = {
      anomalyScore: Math.min(100, Math.round((features.packetEntropy / 8.0) * 60 + (features.serrorRate + features.rerrorRate) * 20 + (features.flaggedSyscalls / 50) * 20)),
      volumeIntensity: Math.min(100, Math.round((features.packetRate / 4500) * 100)),
      payloadRisk: Math.min(100, Math.round((features.packetEntropy / 8.0) * 70 + (features.failedLogins / 20) * 30)),
      stealthLevel: Math.min(100, Math.round((1 - features.packetRate / 4500) * 50 + (features.duration / 300) * 30 + (features.dnsQueryLength / 150) * 20)),
      privilegeEscalationRisk: Math.min(100, Math.round((features.rootShellCount / 10) * 60 + (features.flaggedSyscalls / 50) * 40)),
      killChainProgress: Math.min(100, Math.round((features.numCompromised / 15) * 60 + (features.rootShellCount / 10) * 40)),
    };

    // 5. Feature Importance
    const featureImportance = [
      { feature: 'Packet Rate', impact: Math.min(100, Math.round((features.packetRate / 4000) * 100)), description: `${features.packetRate} pkts/s (Throughput stress)` },
      { feature: 'SYN/REJ Error Rate', impact: Math.min(100, Math.round((features.serrorRate + features.rerrorRate) * 50)), description: `SYN: ${(features.serrorRate * 100).toFixed(0)}%, REJ: ${(features.rerrorRate * 100).toFixed(0)}%` },
      { feature: 'Payload Shannon Entropy', impact: Math.min(100, Math.round((features.packetEntropy / 8.0) * 100)), description: `${features.packetEntropy.toFixed(2)} / 8.0 (Obfuscation measure)` },
      { feature: 'Root Shell / Privileged Calls', impact: Math.min(100, Math.round((features.rootShellCount / 6) * 100)), description: `${features.rootShellCount} root attempts, ${features.flaggedSyscalls} syscalls` },
      { feature: 'DNS Query Subdomain Length', impact: Math.min(100, Math.round((features.dnsQueryLength / 120) * 100)), description: `${features.dnsQueryLength} chars average length` },
    ].sort((a, b) => b.impact - a.impact);

    // 6. Recommended Mitigation
    const mitigations: string[] = [];
    if (primaryClass === 'Denial of Service (DoS/DDoS)') {
      mitigations.push('Activate SYN Cookies & Rate-Limiting on edge ingress router.');
      mitigations.push('Configure Web Application Firewall (WAF) to drop incomplete slow HTTP headers.');
      mitigations.push('Enforce upstream BGP Anycast scrubbing protection.');
    } else if (primaryClass === 'Reconnaissance') {
      mitigations.push('Apply dynamic port knock firewall rules to drop unsolicited SYN packets.');
      mitigations.push('Mask OS fingerprint response headers and disable ICMP timestamp replies.');
    } else if (primaryClass === 'Remote to Local (R2L)') {
      mitigations.push('Sanitize input parameters and enforce parameterized SQL queries via WAF.');
      mitigations.push('Implement IP-reputation blocking and exponential backoff for failed logins.');
    } else if (primaryClass === 'User to Root (U2R)') {
      mitigations.push('Trigger immediate host isolation and kill unauthorized root processes.');
      mitigations.push('Apply kernel security patches (AppArmor/SELinux mandatory access enforcement).');
      mitigations.push('Revoke active session tokens and freeze local socket IPC.');
    } else if (primaryClass === 'Malware & Ransomware') {
      mitigations.push('Quarantine infected endpoint from LAN and block SMB port 445 cross-subnet routing.');
      mitigations.push('Preserve immutable Volume Shadow Copies and trigger EDR memory dump.');
      mitigations.push('Blacklist C2 rendezvous domain hashes across corporate DNS resolvers.');
    } else if (primaryClass === 'Advanced Persistent Threat (APT)') {
      mitigations.push('Inspect and sinkhole high-entropy recursive DNS tunneling queries.');
      mitigations.push('Enforce micro-segmentation and invalidate compromised Kerberos TGT tickets.');
      mitigations.push('Initiate forensic Threat Hunting workflow across lateral endpoint logs.');
    } else {
      mitigations.push('Traffic conforms to normal operational parameters. Continue standard telemetry logging.');
    }

    const inferenceTime = Math.max(0.4, Math.round((performance.now() - startTime) * 10) / 10);

    return {
      primaryClass,
      confidence: maxProb,
      severityScore: defuzzifiedCentroid,
      probabilities,
      radarMetrics,
      featureImportance,
      modelDiagnostics: {
        modelType: 'fuzzy',
        inferenceTimeMs: inferenceTime,
        fuzzyDetails: {
          firedRules,
          membershipBreakdown: {
            packetRate: {
              low: gaussianMF(features.packetRate, 50, 100),
              medium: gaussianMF(features.packetRate, 400, 250),
              high: trapezoidalMF(features.packetRate, 1000, 2500, 5000, 6000),
            },
            entropy: {
              low: triangularMF(features.packetEntropy, 0, 2.5, 4.5),
              medium: triangularMF(features.packetEntropy, 3.5, 5.5, 7.0),
              high: trapezoidalMF(features.packetEntropy, 6.0, 7.2, 8.0, 8.0),
            },
            serror: {
              low: triangularMF(features.serrorRate, 0, 0.05, 0.2),
              medium: triangularMF(features.serrorRate, 0.15, 0.45, 0.75),
              high: trapezoidalMF(features.serrorRate, 0.6, 0.85, 1.0, 1.0),
            },
          },
          defuzzifiedCentroid,
        },
      },
      recommendedMitigation: mitigations,
    };
  }
}

export const fuzzyEngine = new MamdaniFuzzyInferenceSystem();
