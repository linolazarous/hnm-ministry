# Heavenly Nature Ministry Website

![HNM Logo](/src/assets/images/logo.webp)

**Motto:** "We Are One"  
**Website:** [https://hnm.org](https://hnm.org)

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Ministry Information](#ministry-information)
- [License](#license)

## Project Overview

This repository contains the official website for Heavenly Nature Ministry (HNM), a Christian organization dedicated to serving street children, orphans, and abandoned children in South Sudan and beyond. The website serves as:

- A digital hub for ministry information
- A platform for live worship streaming
- A secure donation portal
- A connection point for volunteers

## Features

### Core Functionality
✅ **Livestream Integration**  
- YouTube/Facebook live streaming with interactive chat
- Sermon archive with search functionality

✅ **Donation System**  
- Secure Stripe payment processing
- Recurring donation options
- Tax receipt generation

✅ **Member Portal**  
- Passwordless authentication via Magic.link
- Event registration and calendar
- Prayer request submission

✅ **Admin Dashboard**  
- Livestream controls
- Content management
- Donation analytics

## Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Sass](https://sass-lang.com/) with CSS Modules
- **UI Components**: [MUI](https://mui.com/) + custom ministry design system

### Backend Services
- **Authentication**: [Magic.link](https://magic.link/)
- **Payments**: [Stripe](https://stripe.com/)
- **Database**: [FaunaDB](https://fauna.com/)
- **Hosting**: [Netlify](https://www.netlify.com/)

### Integrations
- **Bible API**: [bible-api.com](https://bible-api.com/)
- **Email**: [SendGrid](https://sendgrid.com/)
- **Monitoring**: [Sentry](https://sentry.io/) + [Datadog](https://www.datadoghq.com/)

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- Netlify CLI (optional)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/linolazarous/hnm-ministry.git
   cd hnm-ministry 