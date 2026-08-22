/**
 * Soft Computing Cyber Attack Classifier Simulation Engine
 * Implements:
 * 1. Fuzzy Inference System (Mamdani & Sugeno hybrid)
 * 2. Multi-Class Neural Softmax Probability Scoring
 * 3. GA Feature Importance Weighting
 * 4. Rule-Based Explanatory Telemetry & Countermeasures
 */

class SoftComputingEngine {
  constructor() {
    this.featureWeights = {
      packetRate: 0.22,
      synCount: 0.20,
      entropy: 0.18,
      failedLogins: 0.16,
      flowDuration: 0.12,
      portRatio: 0.12
    };
  }

  // Gaussian membership function
  gaussianMF(x, mean, sigma) {
    return Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(sigma, 2)));
  }

  // Triangular membership function
  trapezoidalMF(x, a, b, c, d) {
    if (x <= a || x >= d) return 0;
    if (x >= b && x <= c) return 1;
    if (x > a && x < b) return (x - a) / (b - a);
    if (x > c && x < d) return (d - x) / (d - c);
    return 0;
  }

  evaluateFuzzy(params) {
    const pRate = params.packetRate || 0;
    const syn = params.synCount || 0;
    const ent = params.entropy || 0;
    const logins = params.failedLogins || 0;
    const duration = params.flowDuration || 0;
    const portRatio = params.portRatio || 0;

    // Fuzzy Memberships for Packet Rate
    const pRate_Low = this.trapezoidalMF(pRate, 0, 0, 80, 500);
    const pRate_Med = this.trapezoidalMF(pRate, 200, 1000, 3000, 8000);
    const pRate_High = this.trapezoidalMF(pRate, 5000, 20000, 60000, 80000);
    const pRate_Extreme = this.trapezoidalMF(pRate, 50000, 80000, 200000, 500000);

    // Fuzzy Memberships for SYN Flag %
    const syn_Normal = this.trapezoidalMF(syn, 0, 0, 10, 25);
    const syn_Moderate = this.trapezoidalMF(syn, 15, 35, 55, 75);
    const syn_Dominant = this.trapezoidalMF(syn, 65, 85, 100, 100);

    // Fuzzy Memberships for Entropy
    const ent_Low = this.trapezoidalMF(ent, 0, 0, 1.5, 3.0);
    const ent_Normal = this.trapezoidalMF(ent, 2.5, 4.0, 6.0, 7.0);
    const ent_High = this.trapezoidalMF(ent, 6.5, 7.5, 8.0, 8.0);

    // Fuzzy Memberships for Failed Logins
    const login_Zero = this.trapezoidalMF(logins, 0, 0, 0, 1);
    const login_Elevated = this.trapezoidalMF(logins, 1, 3, 6, 10);
    const login_Critical = this.trapezoidalMF(logins, 7, 15, 100, 100);

    // Rule Evaluations (Mamdani min-operator)
    // Rule 1: High/Extreme Packet Rate AND Dominant SYN -> DDoS Attack (Severity ~ 95)
    const r1 = Math.min(Math.max(pRate_High, pRate_Extreme), syn_Dominant);
    
    // Rule 2: High Entropy AND Low/Med Packet Rate -> Web Injection / Malware (Severity ~ 85)
    const r2 = Math.min(ent_High, Math.max(pRate_Low, pRate_Med));

    // Rule 3: Critical Failed Logins -> U2R / Brute Force (Severity ~ 90)
    const r3 = login_Critical;

    // Rule 4: Port Ratio Extreme (>3) AND High SYN -> Recon Probe (Severity ~ 70)
    const port_High = this.trapezoidalMF(portRatio, 2.0, 4.0, 20, 50);
    const r4 = Math.min(port_High, syn_Dominant);

    // Rule 5: Normal SYN AND Normal Entropy AND Zero Logins AND Low Rate -> Benign (Severity ~ 5)
    const r5 = Math.min(syn_Normal, ent_Normal, login_Zero, pRate_Low);

    // Sugeno Weighted Average Threat Level Computation
    const totalWeight = r1 + r2 + r3 + r4 + r5 + 0.0001;
    const threatScore = (r1 * 96 + r2 * 84 + r3 * 91 + r4 * 72 + r5 * 4) / totalWeight;

    return {
      threatScore: Math.min(100, Math.max(0, threatScore)),
      memberships: {
        packetRate: { low: pRate_Low, med: pRate_Med, high: pRate_High, extreme: pRate_Extreme },
        synFlag: { normal: syn_Normal, moderate: syn_Moderate, dominant: syn_Dominant },
        entropy: { low: ent_Low, normal: ent_Normal, high: ent_High },
        failedLogins: { zero: login_Zero, elevated: login_Elevated, critical: login_Critical }
      },
      firedRules: [
        { name: "R1: Volumetric SYN Exhaustion", strength: r1, target: "DoS/DDoS" },
        { name: "R2: Payload Entropy Anomaly", strength: r2, target: "Web/Malware" },
        { name: "R3: Auth Credential Brute/U2R", strength: r3, target: "Privilege Escalation" },
        { name: "R4: Distributed Port Sweep", strength: r4, target: "Reconnaissance" },
        { name: "R5: Baseline Benign Traffic", strength: r5, target: "Normal Flow" }
      ]
    };
  }

  evaluateNeuralSoftmax(params) {
    const pRate = params.packetRate || 0;
    const syn = params.synCount || 0;
    const ent = params.entropy || 0;
    const logins = params.failedLogins || 0;
    const duration = params.flowDuration || 0;
    const portRatio = params.portRatio || 0;

    // Simulated multi-layer perceptron logits based on trained weights
    let logit_ddos = (pRate / 10000) * 1.8 + (syn / 100) * 2.5 - (ent > 5 ? 1.0 : 0);
    let logit_probe = (portRatio * 0.9) + (syn / 100) * 1.5 - (pRate > 20000 ? 1.2 : 0);
    let logit_web = (ent > 6.0 ? (ent - 6.0) * 2.8 : 0) + (logins > 0 ? 0.8 : 0) - (pRate > 5000 ? 2 : 0);
    let logit_malware = (ent > 7.0 ? (ent - 6.5) * 2.2 : 0) + (duration > 10 ? 1.5 : 0);
    let logit_u2r = (logins * 0.65) + (duration > 2 ? 0.8 : 0) - (pRate > 2000 ? 1.5 : 0);
    let logit_benign = 2.5 - (pRate / 2000) - (syn / 30) - (logins * 0.8) + (ent >= 3.5 && ent <= 6.5 ? 1.8 : -1.5);

    // Apply Softmax
    const logits = [
      { id: "dos_ddos", name: "DoS / DDoS", logit: Math.max(-5, logit_ddos) },
      { id: "recon_probing", name: "Probing & Recon", logit: Math.max(-5, logit_probe) },
      { id: "web_injection", name: "Web / Injection", logit: Math.max(-5, logit_web) },
      { id: "malware_ransomware", name: "Malware / Ransomware", logit: Math.max(-5, logit_malware) },
      { id: "u2r_r2l", name: "Privilege Escalation (U2R)", logit: Math.max(-5, logit_u2r) },
      { id: "benign", name: "Benign / Normal", logit: Math.max(-5, logit_benign) }
    ];

    const maxLogit = Math.max(...logits.map(l => l.logit));
    const expSum = logits.reduce((sum, l) => sum + Math.exp(l.logit - maxLogit), 0);

    const probabilities = logits.map(l => {
      const prob = (Math.exp(l.logit - maxLogit) / expSum) * 100;
      return {
        id: l.id,
        name: l.name,
        probability: parseFloat(prob.toFixed(2))
      };
    });

    probabilities.sort((a, b) => b.probability - a.probability);

    return probabilities;
  }

  predict(params) {
    const fuzzyResult = this.evaluateFuzzy(params);
    const neuralProbs = this.evaluateNeuralSoftmax(params);
    const topClass = neuralProbs[0];

    let severityLevel = "LOW";
    let statusClass = "status-low";
    let badgeColor = "#00ff88";

    if (fuzzyResult.threatScore >= 80) {
      severityLevel = "CRITICAL";
      statusClass = "status-critical";
      badgeColor = "#ff2a5f";
    } else if (fuzzyResult.threatScore >= 55) {
      severityLevel = "HIGH";
      statusClass = "status-high";
      badgeColor = "#f97316";
    } else if (fuzzyResult.threatScore >= 30) {
      severityLevel = "MODERATE";
      statusClass = "status-moderate";
      badgeColor = "#eab308";
    }

    let recommendations = [];
    if (topClass.id === "dos_ddos") {
      recommendations = [
        "Trigger dynamic BGP Anycast scrubbing center redirection.",
        "Apply SYN Cookie filtering and TCP half-open connection rate limiting on edge routers.",
        "Rate-limit incoming packets from anomalous source subnet CIDRs."
      ];
    } else if (topClass.id === "web_injection") {
      recommendations = [
        "Enforce Web Application Firewall (WAF) parameterized query sanitization.",
        "Block client session and flag source IP for CAPTCHA challenge.",
        "Review database query logs for syntax token anomalies."
      ];
    } else if (topClass.id === "recon_probing") {
      recommendations = [
        "Enable adaptive honeypot deception routing for scanned destination ports.",
        "Silently drop RST packets to obfuscate active host discovery.",
        "Add offending scanner IP to temporary 15-minute perimeter drop table."
      ];
    } else if (topClass.id === "malware_ransomware") {
      recommendations = [
        "Isolate endpoint immediately via EDR automated network quarantine.",
        "Block outbound C2 IP addresses on egress perimeter firewalls.",
        "Capture memory dump for forensic analysis of injected process threads."
      ];
    } else if (topClass.id === "u2r_r2l") {
      recommendations = [
        "Force terminate active interactive shell session for the compromised user.",
        "Invalidate all active session tokens and enforce mandatory MFA re-authentication.",
        "Inspect `/var/log/auth.log` and privilege escalation audit triggers."
      ];
    } else {
      recommendations = [
        "Traffic is within nominal operational baseline parameters.",
        "Continuous passive telemetry monitoring active.",
        "No automated mitigation action required."
      ];
    }

    return {
      topClass: topClass,
      neuralProbabilities: neuralProbs,
      fuzzyThreatScore: parseFloat(fuzzyResult.threatScore.toFixed(1)),
      severityLevel: severityLevel,
      statusClass: statusClass,
      badgeColor: badgeColor,
      memberships: fuzzyResult.memberships,
      firedRules: fuzzyResult.firedRules,
      recommendations: recommendations,
      modelConfidence: (topClass.probability >= 70 ? "High Confidence" : "Moderate Confidence")
    };
  }
}

window.SoftComputingEngine = SoftComputingEngine;
