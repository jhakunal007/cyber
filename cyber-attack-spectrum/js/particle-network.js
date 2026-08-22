/**
 * Interactive Cyber Threat Defense Canvas
 * Simulates network nodes, telemetry packet transmission, intrusion surges,
 * and Soft Computing AI defense ripples.
 */

class CyberParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.packets = [];
    this.defenseRipples = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.nodeCount = 45;
    this.maxDistance = 140;
    this.threatMode = 'normal'; // 'normal', 'attack', 'inspect'
    this.lastPacketTime = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.triggerDefensePulse(clickX, clickY, '#00f0ff');
    });

    this.createNodes();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
    this.height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Adjust node count based on screen width
    if (this.width < 768) {
      this.nodeCount = 25;
      this.maxDistance = 90;
    } else {
      this.nodeCount = 50;
      this.maxDistance = 140;
    }
    this.createNodes();
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      const isAIInspector = (i % 7 === 0);
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: isAIInspector ? 4.5 : Math.random() * 2 + 1.8,
        isAIInspector: isAIInspector,
        baseColor: isAIInspector ? '#00f0ff' : '#6366f1',
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  triggerDefensePulse(x, y, color = '#00ff88') {
    this.defenseRipples.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: 180,
      opacity: 0.9,
      color: color
    });
  }

  spawnPacket() {
    if (this.nodes.length < 2) return;
    const srcIndex = Math.floor(Math.random() * this.nodes.length);
    let dstIndex = Math.floor(Math.random() * this.nodes.length);
    while (dstIndex === srcIndex) {
      dstIndex = Math.floor(Math.random() * this.nodes.length);
    }

    const src = this.nodes[srcIndex];
    const dst = this.nodes[dstIndex];

    const isAttack = Math.random() < 0.25;
    this.packets.push({
      startX: src.x,
      startY: src.y,
      endX: dst.x,
      endY: dst.y,
      progress: 0,
      speed: 0.015 + Math.random() * 0.015,
      isAttack: isAttack,
      color: isAttack ? '#ff2a5f' : '#00f0ff'
    });
  }

  update() {
    const now = performance.now();
    if (now - this.lastPacketTime > 250) {
      this.spawnPacket();
      this.lastPacketTime = now;
    }

    // Update nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.04;

      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;

      // Mouse repulsion/interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = node.x - this.mouse.x;
        const dy = node.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 1.5;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force;
        }
      }
    }

    // Update packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        if (p.isAttack) {
          this.triggerDefensePulse(p.endX, p.endY, '#ff2a5f');
        }
        this.packets.splice(i, 1);
      }
    }

    // Update defense ripples
    for (let i = this.defenseRipples.length - 1; i >= 0; i--) {
      const r = this.defenseRipples[i];
      r.radius += 3.5;
      r.opacity -= 0.02;
      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        this.defenseRipples.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw connecting edges
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }

    // Draw packets
    for (let i = 0; i < this.packets.length; i++) {
      const p = this.packets[i];
      const curX = p.startX + (p.endX - p.startX) * p.progress;
      const curY = p.startY + (p.endY - p.startY) * p.progress;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(curX, curY, p.isAttack ? 3.5 : 2.5, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.restore();
    }

    // Draw defense ripples
    for (let i = 0; i < this.defenseRipples.length; i++) {
      const r = this.defenseRipples[i];
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = r.color;
      this.ctx.globalAlpha = Math.max(0, r.opacity);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      this.ctx.save();
      this.ctx.beginPath();
      const currentRadius = n.radius + (n.isAIInspector ? Math.sin(n.pulse) * 1.5 : 0);
      this.ctx.arc(n.x, n.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      this.ctx.fillStyle = n.baseColor;
      this.ctx.shadowColor = n.baseColor;
      this.ctx.shadowBlur = n.isAIInspector ? 14 : 6;
      this.ctx.fill();

      if (n.isAIInspector) {
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, currentRadius + 5, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

window.CyberParticleNetwork = CyberParticleNetwork;
