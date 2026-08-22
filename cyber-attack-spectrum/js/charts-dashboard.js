/**
 * Interactive Cybersecurity Charts & Visualizers
 * High-performance Canvas rendering for:
 * 1. Model Comparative Benchmark Chart
 * 2. ROC / AUC Curve Visualizer
 * 3. GA Evolutionary Convergence Graph
 * 4. Interactive Fuzzy Membership Curve Graph
 * 5. Dynamic Confusion Matrix Heatmap
 */

class CyberChartsDashboard {
  constructor() {
    this.activeMetric = 'accuracy';
  }

  init() {
    this.renderModelBenchmark();
    this.renderRocCurves();
    this.renderGaConvergence();
    this.renderFuzzyMembershipCurves();
    this.renderConfusionMatrix();

    window.addEventListener('resize', () => {
      this.renderModelBenchmark();
      this.renderRocCurves();
      this.renderGaConvergence();
      this.renderFuzzyMembershipCurves();
      this.renderConfusionMatrix();
    });
  }

  // 1. Model Benchmark Comparison Bar/Gauge Chart
  renderModelBenchmark(metric = 'accuracy') {
    this.activeMetric = metric;
    const canvas = document.getElementById('benchmarkChartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight || 280;
    canvas.width = width;
    canvas.height = height;

    const data = window.CYBER_SPECTRUM_DATA.comparativeMetrics;
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 30, right: 30, bottom: 50, left: 160 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const barHeight = Math.min(32, (chartH / data.length) - 10);

    data.forEach((item, index) => {
      const y = padding.top + index * (chartH / data.length) + 6;
      let val = item[metric];
      let maxVal = metric === 'far' ? 6 : (metric === 'inferenceTimeMs' ? 8 : 100);
      let minVal = metric === 'far' ? 0 : (metric === 'inferenceTimeMs' ? 0 : 85);

      let normW = ((val - minVal) / (maxVal - minVal)) * chartW;
      normW = Math.max(10, Math.min(chartW, normW));

      // Label
      ctx.fillStyle = item.highlight ? '#00f0ff' : '#94a3b8';
      ctx.font = `${item.highlight ? 'bold' : 'normal'} 12px Inter, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.model, padding.left - 15, y + barHeight / 2);

      // Track Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(padding.left, y, chartW, barHeight, 4);
      ctx.fill();

      // Bar Fill
      const grad = ctx.createLinearGradient(padding.left, y, padding.left + normW, y);
      grad.addColorStop(0, item.color);
      grad.addColorStop(1, item.highlight ? '#00ff88' : item.color);

      ctx.fillStyle = grad;
      ctx.shadowColor = item.highlight ? 'rgba(0, 240, 255, 0.5)' : 'transparent';
      ctx.shadowBlur = item.highlight ? 12 : 0;
      ctx.beginPath();
      ctx.roundRect(padding.left, y, normW, barHeight, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Value text inside / next to bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      const unit = metric === 'far' ? '% FAR' : (metric === 'inferenceTimeMs' ? ' ms' : '%');
      ctx.fillText(`${val}${unit}`, padding.left + normW + 10, y + barHeight / 2);
    });
  }

  // 2. ROC / AUC Curve
  renderRocCurves() {
    const canvas = document.getElementById('rocChartCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight || 260;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    const pad = { top: 25, right: 30, bottom: 40, left: 50 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const gx = pad.left + (w / 5) * i;
      const gy = pad.top + (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(gx, pad.top);
      ctx.lineTo(gx, pad.top + h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(pad.left + w, gy);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText((i * 0.2).toFixed(1), gx, pad.top + h + 16);
      ctx.textAlign = 'right';
      ctx.fillText((1.0 - i * 0.2).toFixed(1), pad.left - 8, gy + 4);
    }

    // Random Guess Baseline (Diagonal)
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top + h);
    ctx.lineTo(pad.left + w, pad.top);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve plotting helper
    const drawCurve = (color, points, shadow = false) => {
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + h);
      points.forEach(pt => {
        const px = pad.left + pt.fpr * w;
        const py = pad.top + (1 - pt.tpr) * h;
        ctx.lineTo(px, py);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = shadow ? 3 : 1.8;
      if (shadow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Proposed ANFIS+GA (AUC 0.998)
    drawCurve('#00f0ff', [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.002, tpr: 0.88 },
      { fpr: 0.008, tpr: 0.96 },
      { fpr: 0.02, tpr: 0.985 },
      { fpr: 0.06, tpr: 0.994 },
      { fpr: 1.0, tpr: 1.0 }
    ], true);

    // Deep LSTM (AUC 0.991)
    drawCurve('#00ff88', [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.008, tpr: 0.82 },
      { fpr: 0.025, tpr: 0.93 },
      { fpr: 0.06, tpr: 0.97 },
      { fpr: 0.15, tpr: 0.988 },
      { fpr: 1.0, tpr: 1.0 }
    ]);

    // GA-SVM (AUC 0.982)
    drawCurve('#8a2be2', [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.015, tpr: 0.74 },
      { fpr: 0.05, tpr: 0.89 },
      { fpr: 0.12, tpr: 0.95 },
      { fpr: 0.25, tpr: 0.975 },
      { fpr: 1.0, tpr: 1.0 }
    ]);

    // Decision Tree (AUC 0.935)
    drawCurve('#64748b', [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.05, tpr: 0.65 },
      { fpr: 0.14, tpr: 0.82 },
      { fpr: 0.30, tpr: 0.91 },
      { fpr: 1.0, tpr: 1.0 }
    ]);
  }

  // 3. Genetic Algorithm Evolutionary Convergence Curve
  renderGaConvergence() {
    const canvas = document.getElementById('gaConvergenceCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight || 240;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    const pad = { top: 25, right: 30, bottom: 40, left: 45 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    // GA generations simulation (1 to 50)
    const generations = 50;
    const fitnessData = [];
    const featureCountData = [];

    for (let g = 1; g <= generations; g++) {
      // Fitness curve approaches 0.9914
      const fit = 0.82 + (0.9914 - 0.82) * (1 - Math.exp(-g / 8.5)) + (Math.sin(g) * 0.002);
      // Feature count reduces from 41 down to 14
      const feats = Math.round(41 - (41 - 14) * (1 - Math.exp(-g / 11)));
      fitnessData.push({ gen: g, val: Math.min(0.995, fit) });
      featureCountData.push({ gen: g, val: feats });
    }

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const gy = pad.top + (h / 5) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, gy);
      ctx.lineTo(pad.left + w, gy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px "JetBrains Mono"';
      ctx.textAlign = 'right';
      ctx.fillText((1.0 - i * 0.04).toFixed(2), pad.left - 6, gy + 3);
    }

    // Plot Fitness Curve
    ctx.beginPath();
    fitnessData.forEach((pt, idx) => {
      const px = pad.left + ((pt.gen - 1) / (generations - 1)) * w;
      const py = pad.top + (1 - (pt.val - 0.80) / 0.20) * h;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Gradient fill under fitness curve
    const lastX = pad.left + w;
    const firstX = pad.left;
    ctx.lineTo(lastX, pad.top + h);
    ctx.lineTo(firstX, pad.top + h);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + h);
    areaGrad.addColorStop(0, 'rgba(0, 240, 255, 0.25)');
    areaGrad.addColorStop(1, 'rgba(0, 240, 255, 0.0)');
    ctx.fillStyle = areaGrad;
    ctx.fill();
  }

  // 4. Live Fuzzy Membership Curve Visualizer
  renderFuzzyMembershipCurves(activeValue = 45000) {
    const canvas = document.getElementById('fuzzyGraphCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight || 180;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    const pad = { top: 20, right: 20, bottom: 30, left: 35 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + h);
    ctx.lineTo(pad.left + w, pad.top + h);
    ctx.stroke();

    // Sets: Low, Med, High, Extreme
    const sets = [
      { name: "Low", color: "#00ff88", a: 0, b: 0, c: 500, d: 2500 },
      { name: "Med", color: "#00f0ff", a: 1500, b: 4000, c: 10000, d: 20000 },
      { name: "High", color: "#f59e0b", a: 15000, b: 30000, c: 60000, d: 85000 },
      { name: "Extreme", color: "#ff2a5f", a: 70000, b: 90000, c: 150000, d: 150000 }
    ];

    const maxX = 120000;

    sets.forEach(s => {
      ctx.beginPath();
      for (let x = 0; x <= maxX; x += 1000) {
        let mu = 0;
        if (x <= s.a || x >= s.d) mu = 0;
        else if (x >= s.b && x <= s.c) mu = 1;
        else if (x > s.a && x < s.b) mu = (x - s.a) / (s.b - s.a);
        else if (x > s.c && x < s.d) mu = (s.d - x) / (s.d - s.c);

        const px = pad.left + (x / maxX) * w;
        const py = pad.top + (1 - mu) * h;
        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw active indicator needle
    const clampedActive = Math.min(maxX, Math.max(0, activeValue));
    const needleX = pad.left + (clampedActive / maxX) * w;
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(needleX, pad.top);
    ctx.lineTo(needleX, pad.top + h);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 5. Interactive Confusion Matrix Heatmap
  renderConfusionMatrix() {
    const container = document.getElementById('confusionMatrixContainer');
    if (!container) return;

    const classes = ["DoS/DDoS", "Probe", "Web Inj", "Malware", "U2R", "Benign"];
    const matrix = [
      [9942, 18, 12, 14, 4, 10],     // Actual DoS
      [22, 4890, 8, 15, 6, 9],       // Actual Probe
      [14, 12, 3920, 24, 8, 22],     // Actual Web
      [8, 10, 18, 2840, 12, 12],     // Actual Malware
      [2, 4, 6, 8, 982, 18],         // Actual U2R
      [16, 12, 20, 15, 14, 28420]    // Actual Benign
    ];

    let html = `<table class="cm-table">
      <thead>
        <tr>
          <th class="cm-corner">Actual \\ Pred</th>
          ${classes.map(c => `<th>${c}</th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

    matrix.forEach((row, rIdx) => {
      const rowSum = row.reduce((a, b) => a + b, 0);
      html += `<tr>
        <td class="cm-row-header">${classes[rIdx]}</td>`;
      
      row.forEach((val, cIdx) => {
        const isDiagonal = rIdx === cIdx;
        const pct = (val / rowSum) * 100;
        let cellClass = isDiagonal ? 'cm-cell-match' : (val > 15 ? 'cm-cell-err-high' : 'cm-cell-err-low');
        html += `<td class="cm-cell ${cellClass}" title="Actual: ${classes[rIdx]}, Predicted: ${classes[cIdx]} (${val} samples, ${pct.toFixed(2)}%)">
          <div class="cm-val">${val.toLocaleString()}</div>
          <div class="cm-pct">${pct.toFixed(1)}%</div>
        </td>`;
      });

      html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }
}

window.CyberChartsDashboard = CyberChartsDashboard;
