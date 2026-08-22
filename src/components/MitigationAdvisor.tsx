import React, { useState } from 'react';
import { AttackSpectrumCategory } from '../types';
import { 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  AlertTriangle, 
  Lock, 
  Zap,
  Radio,
  Server
} from 'lucide-react';

export const MitigationAdvisor: React.FC = () => {
  const [selectedThreat, setSelectedThreat] = useState<AttackSpectrumCategory>('Denial of Service (DoS/DDoS)');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const threatPlaybooks: Record<AttackSpectrumCategory, {
    title: string;
    description: string;
    severity: string;
    firewallRules: string[];
    soarActions: string[];
    suricataRule: string;
  }> = {
    'Denial of Service (DoS/DDoS)': {
      title: 'Volumetric & Application DDoS Throttling Playbook',
      description: 'Mitigate TCP SYN flood storms, Slowloris HTTP header stalls, and UDP amplification attacks.',
      severity: 'CRITICAL',
      firewallRules: [
        '# Enable TCP SYN Cookies in Linux Kernel',
        'sysctl -w net.ipv4.tcp_syncookies=1',
        '# Drop incoming SYN bursts exceeding 100/sec per IP',
        'iptables -A INPUT -p tcp --syn -m limit --limit 100/s --limit-burst 150 -j ACCEPT',
        'iptables -A INPUT -p tcp --syn -j DROP',
        '# Drop slow HTTP connections exceeding 60s idle dwell time in NGINX',
        'client_body_timeout 10s; client_header_timeout 10s;',
      ],
      soarActions: [
        'Trigger upstream BGP Anycast DDoS scrubbing tunnel.',
        'Apply Cloudflare / Akamai Under-Attack challenge mode.',
        'Scale stateless web worker instances horizontally in Kubernetes.',
      ],
      suricataRule: 'alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (msg:"SURICATA DoS SYN Flood Threshold Exceeded"; flags:S; threshold:type both, track by_src, count 500, seconds 2; sid:3000001; rev:1;)',
    },
    'Remote to Local (R2L)': {
      title: 'Web Application Injection & Credential Stuffing Playbook',
      description: 'Shield against Blind SQL Injection, Cross-Site Scripting, and automated dictionary brute force.',
      severity: 'HIGH',
      firewallRules: [
        '# Rate-limit failed SSH and HTTPS login attempts via Fail2Ban',
        'iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set',
        'iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP',
        '# Enforce Strict WAF ModSecurity Rule Set (CRS 3.3)',
        'SecRule REQUEST_COOKIES|REQUEST_COOKIES_NAMES|REQUEST_FILENAME|ARGS_NAMES|ARGS "@detectSQLi" "id:942100,phase:2,block,msg:\'SQL Injection Detected\'"',
      ],
      soarActions: [
        'Enforce mandatory Multi-Factor Authentication (MFA) step-up challenge.',
        'Temporarily quarantine suspected remote subnet from privileged endpoints.',
        'Rotate compromised API secrets and invalidate active JWT sessions.',
      ],
      suricataRule: 'alert http $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (msg:"SURICATA SQL Injection Blind Sleep Detected"; content:"SLEEP("; nocase; sid:3000002; rev:1;)',
    },
    'User to Root (U2R)': {
      title: 'Host Kernel Privilege Escalation & Memory Exploit Playbook',
      description: 'Isolate local root exploits (Dirty COW), memory corruption, and unauthorized setuid binary execution.',
      severity: 'CRITICAL',
      firewallRules: [
        '# Enforce SELinux / AppArmor strict profile confinement',
        'setenforce 1',
        '# Disable ptrace scope for unprivileged processes',
        'sysctl -w kernel.yama.ptrace_scope=2',
        '# Mount /tmp and /dev/shm with noexec and nosuid flags',
        'mount -o remount,noexec,nosuid /tmp',
      ],
      soarActions: [
        'Trigger instantaneous host network isolation via EDR agent.',
        'Terminate all processes spawned with UID 0 lacking valid session parentage.',
        'Trigger forensic memory image capture (LiME / Volatility dump).',
      ],
      suricataRule: 'alert tcp $HOME_NET any -> $HOME_NET any (msg:"SURICATA Potential U2R Root Shell Spawned"; content:"uid=0(root)"; sid:3000003; rev:1;)',
    },
    'Malware & Ransomware': {
      title: 'Crypto-Ransomware Epidemic & C2 Beaconing Containment',
      description: 'Halt wormable lateral movement (SMB 445), crypto file encryption, and C2 dial-backs.',
      severity: 'CRITICAL',
      firewallRules: [
        '# Block cross-subnet SMB port 445 and NetBIOS traffic',
        'iptables -A FORWARD -p tcp --dport 445 -j REJECT --reject-with tcp-reset',
        'iptables -A FORWARD -p udp --dport 137:139 -j DROP',
        '# Block known Command & Control (C2) threat IP blocklists',
        'ipset add c2_blacklist 185.220.101.5',
        'iptables -I OUTPUT -m set --match-set c2_blacklist dst -j DROP',
      ],
      soarActions: [
        'Lock Volume Shadow Copies to read-only immutable storage pool.',
        'Broadcast emergency host quarantine to all endpoints on local VLAN.',
        'Revoke Active Directory Kerberos Golden Ticket signing keys (krbtgt reset).',
      ],
      suricataRule: 'alert smb $HOME_NET any -> $HOME_NET 445 (msg:"SURICATA Ransomware SMB Lateral Scan Pattern"; flow:to_server,established; sid:3000004; rev:1;)',
    },
    'Advanced Persistent Threat (APT)': {
      title: 'APT Kill Chain Disruption & DNS Exfiltration Playbook',
      description: 'Detect covert channels, living-off-the-land binaries, and long-subdomain DNS tunneling.',
      severity: 'CRITICAL',
      firewallRules: [
        '# Intercept and sinkhole recursive DNS requests exceeding 60 character label length',
        'iptables -t nat -A PREROUTING -p udp --dport 53 -j DNAT --to-destination 10.0.0.53:53',
        '# Enforce zero-trust microsegmentation between corporate and database VLANs',
        'iptables -A FORWARD -s 10.0.1.0/24 -d 10.0.4.0/24 -m state --state NEW -j DROP',
      ],
      soarActions: [
        'Sinkhole adversarial command domain at recursive DNS resolver.',
        'Trigger full Active Directory audit for Kerberoasting / DCSync anomalies.',
        'Dispatch Threat Hunting team to cross-correlate historical telemetry.',
      ],
      suricataRule: 'alert dns $HOME_NET any -> any 53 (msg:"SURICATA High Entropy Long DNS Tunneling Query"; content:"|00 01|"; dns_query; pcre:"/^[a-z0-9]{45,}\./i"; sid:3000005; rev:1;)',
    },
    'Reconnaissance': {
      title: 'Probing & Port Scanning Suppression Playbook',
      description: 'Mitigate Nmap stealth SYN scans, OS fingerprinting, and automated vulnerability scanners.',
      severity: 'MEDIUM',
      firewallRules: [
        '# Implement Port Knocking dynamic knock sequence',
        'iptables -A INPUT -p tcp --tcp-flags SYN,ACK,FIN,RST RST -m limit --limit 1/s -j ACCEPT',
        '# Mask OS TCP stack fingerprint quirks',
        'sysctl -w net.ipv4.ip_default_ttl=64',
        'sysctl -w net.ipv4.icmp_echo_ignore_broadcasts=1',
      ],
      soarActions: [
        'Append scanner IP to dynamic 24-hour rate-limit pool.',
        'Serve honeypot synthetic response headers to pollute adversary intelligence.',
      ],
      suricataRule: 'alert tcp $EXTERNAL_NET any -> $HOME_NET any (msg:"SURICATA Nmap OS Fingerprint Probe"; flags:SFUP; sid:3000006; rev:1;)',
    },
    'Normal Traffic': {
      title: 'Baseline Operational Health & Telemetry Logging',
      description: 'Standard security operations baseline for legitimate network traffic.',
      severity: 'CLEAN',
      firewallRules: [
        '# Allow established bidirectional stateful connections',
        'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT',
        'iptables -A INPUT -p tcp --dport 443 -j ACCEPT',
      ],
      soarActions: [
        'Continuously feed clean baseline telemetry into Soft Computing online training pipeline.',
      ],
      suricataRule: '# Normal traffic within expected baseline parameters. No alert triggered.',
    },
  };

  const currentPlaybook = threatPlaybooks[selectedThreat];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#101b2a] to-slate-900 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Autonomous Mitigation <span className="text-emerald-400">& Incident Response Playbook</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Dynamic defense orchestration generating tailored kernel firewall rules (IPTables/Sysctl), Suricata IDS rules, and SOAR automation triggers based on Soft Computing classified threat classes.
        </p>
      </div>

      {/* Threat Category Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(Object.keys(threatPlaybooks) as AttackSpectrumCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedThreat(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium border transition-all whitespace-nowrap ${
              selectedThreat === cat
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Playbook Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Firewall Rules & Kernel Configuration (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Kernel & Firewall Defense Scripts
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                Bash / IPTables
              </span>
            </div>

            <div className="bg-[#070b14] p-4 rounded-xl border border-slate-800/80 space-y-2 font-mono text-xs text-slate-300 relative">
              {currentPlaybook.firewallRules.map((rule, idx) => (
                <div key={idx} className="flex justify-between items-center group py-0.5">
                  <span className={rule.startsWith('#') ? 'text-slate-500' : 'text-cyan-300'}>
                    {rule}
                  </span>
                  {!rule.startsWith('#') && (
                    <button
                      onClick={() => handleCopy(rule, idx)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-cyan-300 transition-opacity"
                      title="Copy Command"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Suricata IDS Signature */}
            <div className="pt-2">
              <span className="text-xs font-bold font-mono text-slate-400 block mb-1.5">
                Suricata / Snort Generated Rule:
              </span>
              <div className="bg-[#070b14] p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300 break-all">
                {currentPlaybook.suricataRule}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: SOAR Orchestration Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Automated SOAR Playbook
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                Active
              </span>
            </div>

            <div className="space-y-2.5">
              {currentPlaybook.soarActions.map((action, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs font-mono text-slate-300">
                  <span className="p-1 rounded bg-slate-800 text-cyan-400 font-bold mt-0.5 text-[10px]">
                    0{idx + 1}
                  </span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
