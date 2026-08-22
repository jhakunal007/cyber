import React, { useState, useEffect, useRef } from 'react';
import { LivePacketTelemetry, FeatureVector } from '../types';
import { anfisClassifier } from '../algorithms/anfisClassifier';
import { 
  Radio, 
  Play, 
  Pause, 
  Trash2, 
  Filter, 
  Sliders, 
  ShieldAlert, 
  Activity, 
  ExternalLink, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface LiveThreatStreamProps {
  onInspectPacket: (features: FeatureVector, name: string) => void;
}

export const LiveThreatStream: React.FC<LiveThreatStreamProps> = ({ onInspectPacket }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [packets, setPackets] = useState<LivePacketTelemetry[]>([]);
  const [streamSpeedMs, setStreamSpeedMs] = useState<number>(1200);
  const [filterMode, setFilterMode] = useState<'ALL' | 'ATTACKS_ONLY' | 'CRITICAL_ONLY'>('ALL');
  const [selectedPacket, setSelectedPacket] = useState<LivePacketTelemetry | null>(null);

  const packetIdCounter = useRef<number>(1001);

  // Packet Generator Function
  const generateRandomPacket = (): LivePacketTelemetry => {
    packetIdCounter.current += 1;
    const rand = Math.random();

    let scenarioType = 'Normal Traffic';
    let features: FeatureVector;
    let proto: 'TCP' | 'UDP' | 'HTTP' | 'HTTPS' | 'DNS' | 'SSH' = 'HTTPS';
    let port = 443;
    let flags = 'ACK, PSH';
    let size = 1240;

    if (rand < 0.25) {
      // Normal Traffic
      scenarioType = 'Normal Traffic';
      proto = 'HTTPS';
      port = 443;
      flags = 'ACK, PSH';
      size = Math.floor(600 + Math.random() * 800);
      features = {
        duration: 12 + Math.random() * 8,
        packetRate: Math.floor(150 + Math.random() * 100),
        byteRatio: 0.15,
        failedLogins: 0,
        packetEntropy: 4.8 + Math.random() * 0.8,
        serrorRate: 0.01,
        rerrorRate: 0.01,
        sameSrvRate: 0.88,
        numCompromised: 0,
        rootShellCount: 0,
        dnsQueryLength: 18,
        flaggedSyscalls: 0,
      };
    } else if (rand < 0.45) {
      // SYN Flood DoS
      scenarioType = 'Denial of Service (DoS/DDoS)';
      proto = 'TCP';
      port = 80;
      flags = 'SYN';
      size = 64;
      features = {
        duration: 0.2,
        packetRate: Math.floor(3800 + Math.random() * 800),
        byteRatio: 0.99,
        failedLogins: 0,
        packetEntropy: 0.8,
        serrorRate: 0.98,
        rerrorRate: 0.02,
        sameSrvRate: 0.99,
        numCompromised: 0,
        rootShellCount: 0,
        dnsQueryLength: 0,
        flaggedSyscalls: 0,
      };
    } else if (rand < 0.60) {
      // Reconnaissance Port Scan
      scenarioType = 'Reconnaissance';
      proto = 'TCP';
      port = Math.floor(1024 + Math.random() * 8000);
      flags = 'SYN, RST';
      size = 60;
      features = {
        duration: 1.2,
        packetRate: Math.floor(750 + Math.random() * 300),
        byteRatio: 0.95,
        failedLogins: 0,
        packetEntropy: 1.4,
        serrorRate: 0.45,
        rerrorRate: 0.88,
        sameSrvRate: 0.05,
        numCompromised: 0,
        rootShellCount: 0,
        dnsQueryLength: 12,
        flaggedSyscalls: 1,
      };
    } else if (rand < 0.75) {
      // SQL Injection R2L
      scenarioType = 'Remote to Local (R2L)';
      proto = 'HTTP';
      port = 8080;
      flags = 'ACK, PSH';
      size = 450;
      features = {
        duration: 4.5,
        packetRate: 40,
        byteRatio: 0.45,
        failedLogins: Math.floor(Math.random() * 5),
        packetEntropy: 6.9,
        serrorRate: 0.02,
        rerrorRate: 0.04,
        sameSrvRate: 0.85,
        numCompromised: 2,
        rootShellCount: 0,
        dnsQueryLength: 14,
        flaggedSyscalls: 6,
      };
    } else if (rand < 0.88) {
      // Ransomware C2 Beaconing
      scenarioType = 'Malware & Ransomware';
      proto = 'TCP';
      port = 445;
      flags = 'SYN, ACK';
      size = 890;
      features = {
        duration: 14.0,
        packetRate: 1200,
        byteRatio: 0.38,
        failedLogins: 0,
        packetEntropy: 7.88,
        serrorRate: 0.35,
        rerrorRate: 0.18,
        sameSrvRate: 0.95,
        numCompromised: 11,
        rootShellCount: 2,
        dnsQueryLength: 38,
        flaggedSyscalls: 41,
      };
    } else {
      // APT DNS Tunneling
      scenarioType = 'Advanced Persistent Threat (APT)';
      proto = 'DNS';
      port = 53;
      flags = 'UDP';
      size = 320;
      features = {
        duration: 48.0,
        packetRate: 165,
        byteRatio: 0.90,
        failedLogins: 0,
        packetEntropy: 7.3,
        serrorRate: 0.01,
        rerrorRate: 0.01,
        sameSrvRate: 0.82,
        numCompromised: 6,
        rootShellCount: 1,
        dnsQueryLength: 98,
        flaggedSyscalls: 11,
      };
    }

    const classification = anfisClassifier.classify(features);

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 100)}`;

    const srcIps = ['192.168.1.104', '10.0.4.52', '185.220.101.5', '45.154.255.89', '198.51.100.44', '172.16.8.201'];
    const dstIps = ['10.0.0.1', '10.0.0.5', '192.168.1.1', '172.16.0.24'];

    return {
      id: `PKT-${packetIdCounter.current}`,
      timestamp: timeStr,
      sourceIp: srcIps[Math.floor(Math.random() * srcIps.length)],
      destIp: dstIps[Math.floor(Math.random() * dstIps.length)],
      port,
      protocol: proto,
      packetSize: size,
      flags,
      features,
      classification,
    };
  };

  // Live Stream Interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newPacket = generateRandomPacket();
      setPackets((prev) => [newPacket, ...prev.slice(0, 49)]); // Keep last 50 packets
    }, streamSpeedMs);

    return () => clearInterval(interval);
  }, [isPlaying, streamSpeedMs]);

  // Initial populate
  useEffect(() => {
    if (packets.length === 0) {
      const initialBatch = Array.from({ length: 6 }, () => generateRandomPacket());
      setPackets(initialBatch);
    }
  }, []);

  const filteredPackets = packets.filter((p) => {
    if (filterMode === 'ALL') return true;
    if (filterMode === 'ATTACKS_ONLY') return p.classification?.primaryClass !== 'Normal Traffic';
    if (filterMode === 'CRITICAL_ONLY') return (p.classification?.severityScore || 0) >= 80;
    return true;
  });

  const getThreatBadge = (classification?: any) => {
    if (!classification) return null;
    const cat = classification.primaryClass;
    const conf = classification.confidence;

    if (cat === 'Normal Traffic') {
      return (
        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
          CLEAN ({conf}%)
        </span>
      );
    }
    if (cat.includes('DoS')) {
      return (
        <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
          DOS/DDOS ({conf}%)
        </span>
      );
    }
    if (cat.includes('Malware') || cat.includes('U2R')) {
      return (
        <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
          CRITICAL: {cat.split(' ')[0]} ({conf}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold">
        {cat.split(' ')[0]} ({conf}%)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0e172a] to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Real-Time Threat Stream <span className="text-cyan-400">& Network Radar</span>
            </h2>
          </div>

          {/* Stream Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              {isPlaying ? <><Pause className="w-3.5 h-3.5" /> Pause Feed</> : <><Play className="w-3.5 h-3.5" /> Resume Stream</>}
            </button>

            <button
              onClick={() => setPackets([])}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear Packet Buffer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Synthetic network ingress capture simulator streaming network packets through ANFIS / Fuzzy-Neural classifiers in real time. Inspect packet metadata and trigger instant sandbox audits.
        </p>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">FILTER:</span>
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Ingress ({packets.length})
            </button>
            <button
              onClick={() => setFilterMode('ATTACKS_ONLY')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'ATTACKS_ONLY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Attacks Only ({packets.filter(p => p.classification?.primaryClass !== 'Normal Traffic').length})
            </button>
            <button
              onClick={() => setFilterMode('CRITICAL_ONLY')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterMode === 'CRITICAL_ONLY' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critical ({packets.filter(p => (p.classification?.severityScore || 0) >= 80).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">STREAM SPEED:</span>
            <input
              type="range"
              min="300"
              max="3000"
              step="200"
              value={streamSpeedMs}
              onChange={(e) => setStreamSpeedMs(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-cyan-400 font-bold">{(1000 / streamSpeedMs).toFixed(1)}/s</span>
          </div>
        </div>
      </div>

      {/* Stream Table List */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 pb-2">
                <th className="pb-2 pl-2">TIMESTAMP</th>
                <th className="pb-2">PACKET ID</th>
                <th className="pb-2">SOURCE IP</th>
                <th className="pb-2">TARGET</th>
                <th className="pb-2">PROTO / FLAGS</th>
                <th className="pb-2">LENGTH</th>
                <th className="pb-2">AI SOFT CLASSIFICATION</th>
                <th className="pb-2 text-right pr-2">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPackets.map((pkt) => {
                const isAttack = pkt.classification?.primaryClass !== 'Normal Traffic';
                const isCritical = (pkt.classification?.severityScore || 0) >= 80;

                return (
                  <tr
                    key={pkt.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isCritical ? 'bg-rose-950/10' : isAttack ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="py-2.5 pl-2 text-slate-400">{pkt.timestamp}</td>
                    <td className="py-2.5 font-bold text-cyan-400">{pkt.id}</td>
                    <td className="py-2.5 text-slate-200">{pkt.sourceIp}</td>
                    <td className="py-2.5 text-slate-300">{pkt.destIp}:{pkt.port}</td>
                    <td className="py-2.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 mr-1.5">
                        {pkt.protocol}
                      </span>
                      <span className="text-slate-500">{pkt.flags}</span>
                    </td>
                    <td className="py-2.5 text-slate-400">{pkt.packetSize} B</td>
                    <td className="py-2.5">
                      {getThreatBadge(pkt.classification)}
                    </td>
                    <td className="py-2.5 text-right pr-2">
                      <button
                        onClick={() => onInspectPacket(pkt.features, `${pkt.id} (${pkt.classification?.primaryClass})`)}
                        className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
