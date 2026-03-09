# Infinity Blog

A premium, highly customizable blogging engine built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **MongoDB**. Designed for an immersive, distraction-free reading experience with gorgeous aesthetics and typography.

## ✨ Features

- **Immersive Reading Experience**: Distraction-free, full-screen reading modal with dynamic typography switching mapping directly to your post config.
- **Dynamic Global Theming**: Globally adjust Hero titles, badge texts, site background colors, and primary glowing accents directly from the UI.
- **Granular Post Customization**: Fine-tune every individual post with distinct layout options (Classic, Modern, Minimal), alignment, custom title colors, and specific cover image aspect ratios.
- **3D Hardware-Accelerated Animations**: Choose from a library of entrance animations (Fade In Up, Zoom In, Slide Right, 3D Flip) powered by natively compiled Tailwind `@keyframes`.
- **Real-Time Engagement**: Optimistic UI updates for instant "Like" interactions that securely persist through Next.js Server Actions to the MongoDB database.
- **Featured Highlights**: Spotlight your best content with 2-column spans and vibrant glowing auras powered by dynamic CSS boundaries.

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/-Next.js_14-000000?style=flat-square&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/rohilshah2006/infinity-blog.git
cd infinity-blog/frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the `frontend` directory and add your MongoDB connection URI:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/infinity-blog
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Repository Structure
- `/frontend/app` - Next.js App Router (Pages & Layouts)
- `/frontend/app/models` - Mongoose Database schemas (`Blog.ts`, `Settings.ts`)
- `/frontend/app/components` - React visual components (`BlogCard.tsx`)
- `/frontend/app/actions.ts` - Secure Next.js Server Actions for database mutations

---
*Built with ❤️ by Rohil Shah*
