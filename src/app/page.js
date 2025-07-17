'use client';

import ThemeToggle from "./components/ThemeToggle";
import ChatInterface from "./components/ChatInterface";
import { StoryProvider } from "./contexts/StoryContext";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <ThemeToggle />
      <div className="w-full max-w-5xl">        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
            A Timeless Journey
          </h1>          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
            Interactive story through time and memory
          </p>
        </div>
        <StoryProvider>
          <ChatInterface />
        </StoryProvider>
      </div>
    </div>
  );
}
