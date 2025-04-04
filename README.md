# Heavenly Nature Ministry Website

![HNM Logo](/src/assets/images/logo.webp)

**Motto:** "We Are One"  
**Website:** [https://hnm.org](https://hnm.org)  
**Security Policy:** [SECURITY.md](SECURITY.md)  
**CI/CD Status:** ![GitHub Actions](https://github.com/linolazarous/hnm-ministry/workflows/Deployment/badge.svg)

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Security Considerations](#security-considerations)
- [Development Setup](#development-setup)
- [Deployment Architecture](#deployment-architecture)
- [Contributing](#contributing)
- [Ministry Information](#ministry-information)
- [License](#license)

## Project Overview

The official digital platform for Heavenly Nature Ministry, providing:

- 🌍 Global ministry outreach portal
- 📺 Integrated worship streaming (500+ weekly viewers)
- 💳 Secure donation processing ($50k+ monthly)
- 🤝 Volunteer coordination system

## Key Features

### Ministry Platform
| Feature | Description | Tech Used |
|---------|-------------|-----------|
| **Livestream Hub** | Multi-platform streaming with moderated chat | YouTube API, Facebook SDK |
| **Donation Engine** | PCI-compliant processing with recurring options | Stripe Elements, Webhooks |
| **Member Portal** | Passwordless auth with role-based access | Magic.link, JWT |
| **Admin Console** | Real-time ministry analytics dashboard | FaunaDB, Chart.js |

### Technical Highlights
- ⚡ 95+ Lighthouse performance score
- 🔒 CSP-protected with strict security headers
- 🌐 Multi-language support (English/Arabic)
- 📱 Progressive Web App capabilities

## Technology Stack

### Core Infrastructure
```mermaid
graph TD
    A[Vite 5] --> B[React 18]
    B --> C[FaunaDB]
    B --> D[Stripe]
    B --> E[Magic.link]
    C --> F[Netlify Functions]
    D --> F
    E --> F
