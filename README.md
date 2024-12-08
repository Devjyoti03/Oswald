# Oswald

**Oswald** is an npm package designed to ensure the safety and longevity of your codebase. It acts as a blockchain-powered safety net, backing up your commits while seamlessly integrating with GitHub. Whether it's an unintended deletion or a disruptive event, Oswald ensures your code is always retrievable. It also brings advanced functionality like auto-auditing for smart contracts, making it a valuable tool for modern developers.

---

## 📌 Table of Contents

- [Features](#-features)  
- [Installation](#-installation)  
- [Usage](#-usage)  
- [How It Works](#-how-it-works)  
- [Tech Stack](#-tech-stack)  
- [Contributing](#-contributing)  
- [License](#-license)  
- [Support](#-support)

---

# The Problem Oswald Solves

## The Problem It Solves

Modern development pipelines lack a seamless way to:

- **Store codebases securely on-chain** to ensure immutability and transparency.
- **Audit and validate smart contracts** collaboratively and efficiently during the CI/CD process.
- **Streamline deployment of smart contracts** to EVM-compatible chains with built-in safety checks.

## How It Helps

- **Secure On-Chain Storage:** Safeguard your codebase or files with decentralized storage, ensuring transparency and tamper-proof history.
- **Automated Audits:** Enable multiple agents to audit smart contracts in your CI/CD pipeline, reaching a consensus before approval.
- **Safe & Hassle-Free Deployment:** Simplify the process of deploying validated contracts to EVM chains with just a click.

This tool enhances security, reliability, and efficiency for developers, making Web3 integration in DevOps workflows easier than ever.

---

# Challenges We Ran Into

Building this project was an exciting yet challenging journey. Here are some key hurdles we faced and how we overcame them:

### Bad Internet Connectivity
- **Challenge:** During development and testing, poor internet slowed down interactions with on-chain data and CI/CD workflows.
- **Solution:** We optimized API calls and testing environments to minimize reliance on constant connectivity, ensuring smoother development.

### Implementing the Deployment Process
- **Challenge:** Streamlining the deployment of smart contracts while ensuring proper validation was complex.
- **Solution:** We integrated deployment tools with safeguards like EVM-compatible checks, automating most tasks for consistency.

### Integrating Agents like Quillshield and Slither
- **Challenge:** Setting up multiple agents to independently audit contracts and reach a consensus was technically demanding.
- **Solution:** We designed a modular architecture where each agent runs independently in the CI/CD pipeline, then collates results for a unified decision.

### Walrus SDK Limitations
- **Challenge:** Walrus had no SDK, and its minimum file size requirement made storing entire codebases a major challenge.
- **Solution:** We built custom wrappers for Walrus integration and chunked the codebase into manageable parts, ensuring compatibility while maintaining efficiency.

