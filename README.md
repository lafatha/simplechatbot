# Chatbot App

A modern chatbot application built with Next.js and powered by Google's Gemini AI.

## Features

- Clean, minimalist chat interface
- Real-time AI responses using Gemini API
- Responsive design matching Figma specifications
- Indonesian language support

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Google Gemini AI** - AI chatbot backend

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # API route for Gemini integration
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main chat page
├── components/
│   ├── icons/
│   │   ├── SendIcon.tsx    # Send icon component
│   │   └── FolderIcon.tsx  # Folder/attachment icon
│   ├── ChatMessage.tsx     # Chat message bubble component
│   └── ChatInput.tsx       # Input field component
└── package.json
```

