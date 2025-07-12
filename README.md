# 🌐 SkillXchange  
_**Collaborate. Learn. Grow.**_

A seamless full-stack platform for skill swapping through peer-to-peer learning.

---

## 🚀 Overview

**SkillXchange** is a real-time web platform that enables users to **exchange skills** with one another through **mutual swap requests**. Whether you're offering graphic design and looking to learn web development—or vice versa—SkillXchange connects people in a collaborative learning loop.

> 🛠 Built for **Problem Statement 1: Skill Swap Platform** as part of the Hackathon Challenge.

---

## 💡 Problem Statement

In today's world, knowledge is abundant—but often gated by paywalls, institutional access, or geographic limitations. Millions of people possess valuable skills, yet lack the means to acquire new ones affordably.

**SkillXchange** bridges this gap by enabling individuals to **share what they know and gain what they seek** through a barter-like system—no money involved, just skills.

---

## 🎯 Key Objectives

- Empower users to **teach what they know** and **learn what they need**
- Build a fast, intuitive, and scalable full-stack app
- Encourage organic, skill-based networking and mentorship
- Integrate real-time features for efficient communication

---

## 🔥 Features

### 👤 User Profiles  
- Name, location, and optional profile image  
- Availability (e.g., weekends, evenings)  
- Public/Private profile toggle

### 💬 Skill Listings  
- Add, edit, or remove **skills offered** and **skills wanted**

### 🔁 Swap Request System  
- Send, accept, reject, or cancel swap requests  
- View pending, active, and completed exchanges  
- Track your learning/teaching history

### ⭐ Ratings & Feedback  
- Leave ratings and comments after swaps  
- Build public reputation and trust

### 🔍 Skill-Based Search  
- Find users by specific skills (e.g., "Figma", "JavaScript", "Photography")

### 🛡️ Admin Dashboard  
- Moderate users and skills  
- Track request statistics  
- Generate performance reports

---

## 🛠 Tech Stack

| Layer         | Technology Used                          |
|---------------|-------------------------------------------|
| **Frontend**  | React.js, Chakra UI                      |
| **Backend**   | Supabase (Auth, DB, Realtime API)        |
| **Database**  | PostgreSQL (via Supabase)                |
| **Design**    | Figma, Excalidraw                        |
| **Deployment**| Vercel                                   |
| **Versioning**| Git, GitHub                              |

> 💡 Supabase provides instant authentication, database services, and real-time capabilities—reducing our backend effort while keeping security and speed intact.

---

## 👥 Team

| Name            | Role                          | GitHub                              |
|-----------------|-------------------------------|--------------------------------------|
| Krishna Gujrati | Full-Stack Developer          | [@Benkrish](https://github.com/Benkrish) |
| Ratul Lakhanpal | Backend & Auth Specialist     | [@Ratul](https://github.com/ratul-24)     |
| Vidhi Damani    | UI/UX Design & Frontend Dev   | [@vidhi-damani](https://github.com/vidhi-damani) |
| Asmi Parikh     | Product Design & Frontend Developer| [@asmi-parikh](https://github.com/asmi902)     |

---

## 📁 Folder Structure

```bash
skillxchange/
│
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Frontend routes
│   ├── utils/               # Helper functions
│   ├── hooks/               # Custom React hooks
│   └── styles/              # Chakra UI themes/overrides
│
├── supabase/                # SQL schema & Supabase config
├── .env.local               # Environment variables
└── README.md
