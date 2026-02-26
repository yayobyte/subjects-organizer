# Visual Curriculum & Prerequisite Tracker

A modern, interactive web application for tracking academic progress with seamless data persistence and cross-device sync. Now fully powered by **Supabase Authentication** and **Row Level Security (RLS)**.

**Last Updated**: February 2026 - Migrated to Supabase Auth & Pure Frontend Architecture

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20RLS-3ecf8e.svg)

## 📖 Project Documentation

Navigate through the technical details and setup guides:

| File | Description |
|---|---|
| [**Quick Reference**](QUICK_REFERENCE.md) | TL;DR for developers (Commands, Schema, Auth). |
| [**Project Setup**](PROJECT_SETUP.md) | Full installation and configuration guide. |
| [**Architecture**](ARCHITECTURE.md) | System design, data flow, and RLS security model. |
| [**Deployment**](DEPLOYMENT.md) | How to deploy to Vercel and set up Supabase Cloud. |
| [**Local Development**](LOCAL_DEV.md) | Running and testing the app on your local machine. |
| [**Changelog**](CHANGELOG.md) | Track version history and new feature releases. |

### Feature Deep-Dives
- [**Color System**](COLOR_SYSTEM.md): Visual guide to subject statuses.
- [**Prerequisites Feature**](PREREQUISITES_FEATURE.md): Detailed editing logic.
- [**Prerequisite Lines**](PREREQUISITE_LINES.md): Technical SVG visualization info.

## ✨ Features

### 🔐 User Authentication (NEW)
- **Email/Password Sign-in**: Secure login and registration powered by Supabase Auth.
- **Email Confirmation**: Automatic verification flow for new accounts.
- **Private Data Storage**: Row Level Security (RLS) ensures only you can see and edit your curriculum.
- **Smart Data Fallback**: New accounts automatically start with the default university curriculum data.

### 📚 Curriculum View
- **Horizontal Semester Layout**: 10 semesters displayed in a sleek landscape scroll.
- **Drag & Drop Reordering**: Reorder subjects within each semester with real-time persistence.
- **Visual Prerequisite Connections**: Toggle animated bezier lines showing course dependencies.
- **Color-Coded Status System**:
  - 🟢 **Green**: Completed
  - 🔵 **Blue**: In-progress
  - 🟡 **Amber**: Ready to take (prerequisites met)
  - 🔴 **Red**: Locked (prerequisites missing)

### 🎨 Premium Design
- **Dark Mode**: Backend-synced preference that follows you across devices.
- **Glassmorphism UI**: Modern, translucent components with Framer Motion animations.
- **Stats Dashboard**: Real-time calculation of GPA, Credits, and Progress.

## 🚀 Technical Architecture

We have moved away from server-side proxies to a **Direct-to-Database** architecture. The frontend communicates directly with Supabase, leveraging the user's JWT for secure database access.

- **Frontend**: React 19 + Vite + TypeScript.
- **Database**: Supabase (PostgreSQL) + RLS.
- **Auth**: Supabase Auth (Shared across devices).
- **Styling**: Tailwind CSS v4.
- **Deployment**: Vercel (Static Frontend).

## 🛠️ Installation & Setup

1. **Clone the repo**
2. **Setup Supabase Environment Variables** in `.env.local`:
   ```bash
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. **Run Migrations**: Run the SQL scripts in `supabase/` (see Walkthrough) to enable RLS.
4. **Install and Run**:
   ```bash
   npm install
   npm run dev
   ```

## 🎮 Usage Guide

- **Sign up**: Create an account and verify your email.
- **Sync**: Your curriculum now follows you! Changes made on your phone appear instantly on your desktop.
- **Reset**: Use the "Reset Data" button to restore your private curriculum to the university baseline.

---

**Created by Antigravity AI - 2026**
