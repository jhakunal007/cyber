# CyberSpectrum-AI: Classifying Cyber Attack Spectrum Using Soft Computing

[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An interactive, responsive cyber threat intelligence platform that classifies the cyber attack spectrum across 7 threat classes using **Soft Computing** paradigms (Fuzzy Inference Systems, Multi-Layer Perceptron Neural Networks, Genetic Algorithms / PSO, and Hybrid ANFIS).

---

## 🌟 Key Modules

1. **🎛️ Classifier Sandbox**: Real-time soft computing model execution with 12 continuous telemetry sliders, 8 preset scenarios, Softmax distribution bars, 6-D threat radar, and Explainable AI (SHAP-like) feature attributions.
2. **🗺️ Attack Spectrum Matrix**: Cyber threat taxonomy covering Reconnaissance, DoS/DDoS, Remote to Local (R2L), User to Root (U2R), Malware & Ransomware, and APT Kill Chains mapped against MITRE ATT&CK.
3. **🧠 Interactive Neural Network Graph**: Live animated SVG Multi-Layer Perceptron ($8 \to 12 \to 8 \to 7$) with 292 active synaptic lines and neuron activations.
4. **📐 Fuzzy Logic (FIS) Engine**: Mamdani Fuzzy Inference System plotting continuous linguistic membership curves ($\mu(x)$) and rule firing composition with Centroid defuzzification.
5. **📡 Threat Stream & Network Radar**: Real-time packet telemetry feed streaming packets with on-the-fly soft computing classification badges.
6. **📊 Empirical Benchmark Analytics**: Comprehensive comparison of Soft Computing vs Crisp IDS across NSL-KDD and CICIDS datasets, 7x7 confusion matrix, and noise robustness curves.
7. **📄 Batch Telemetry Evaluator**: Bulk network session audit with one-click CSV report export.
8. **🛡️ Autonomous Defense Playbook**: Dynamic Linux kernel `sysctl` settings, `iptables` firewall rules, Suricata IDS signatures, and SOAR orchestrations.
9. **📚 Theory Knowledge Hub**: Mathematical formulations and architectural blueprints for computational intelligence in cybersecurity.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- `npm` (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY_NAME>.git
   cd <YOUR_REPOSITORY_NAME>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📦 Deployment to GitHub Pages

This repository is configured with an automated **GitHub Actions** deployment pipeline:

1. Push your code to the `main` or `master` branch.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. GitHub will automatically build and deploy your site to `https://<YOUR_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/`.

---

## 🧠 Soft Computing Paradigms Implemented

- **Mamdani Fuzzy Inference System (FIS)**: Handles uncertainty and imprecision through continuous triangular, trapezoidal, and Gaussian membership functions $\mu(x) \in [0, 1]$.
- **Multi-Layer Perceptron (ANN)**: Dense forward propagation with Rectified Linear Unit (ReLU) activations and Softmax cross-entropy probabilities.
- **Adaptive Neuro-Fuzzy Inference System (ANFIS)**: First-order Takagi-Sugeno 5-layer hybrid architecture.
- **Genetic Algorithms & PSO**: Pareto-optimal feature subset optimization for high-dimensional telemetry reduction.

---

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
