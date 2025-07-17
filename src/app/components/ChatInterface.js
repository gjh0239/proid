'use client';

import { useStory } from '../contexts/StoryContext';
import { useState, useEffect } from 'react';

export default function ChatInterface() {  const { 
    displayedText, 
    isTyping, 
    showChoices, 
    choices, 
    showNextButton,
    showPrevButton, 
    makeChoice, 
    nextChapter,
    nextSegment,
    prevChapter,
    currentChapter,
    currentSegment,
    isTransitioning,
    getCurrentChapterInfo,
    currentPrompt
  } = useStory();

  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [chapterInfo, setChapterInfo] = useState({ title: 'Prologue', number: 0 });

  // Update chapter info when chapter changes
  useEffect(() => {
    const info = getCurrentChapterInfo();
    setChapterInfo(info);
  }, [currentChapter, getCurrentChapterInfo]);

  // Calculate dynamic height based on content length
  const getContentHeight = () => {
    const textLength = displayedText.length;
    const choicesCount = choices.length;
    
    // Base height
    let height = 'min-h-[400px]';
    
    // Adjust based on text length
    if (textLength > 500) {
      height = 'min-h-[500px]';
    }
    if (textLength > 1000) {
      height = 'min-h-[600px]';
    }
    if (textLength > 1500) {
      height = 'min-h-[700px]';
    }
    
    // Add extra height for choices
    if (choicesCount > 2) {
      height = height.replace('min-h-[', 'min-h-[').replace('px]', `px] max-h-[800px]`);
    }
    
    return height;
  };
  // Handle button fade-in animation
  useEffect(() => {
    if (showChoices || showNextButton || showPrevButton) {
      const timer = setTimeout(() => {
        setButtonsVisible(true);
      }, 200); // Small delay for smooth transition
      return () => clearTimeout(timer);
    } else {
      setButtonsVisible(false);
    }
  }, [showChoices, showNextButton, showPrevButton]);  const handleChoice = (promptId, choiceId) => {
    setButtonsVisible(false); // Fade out buttons before choice
    makeChoice(promptId, choiceId);
  };
  const handleNextChapter = () => {
    setButtonsVisible(false); // Fade out button before transition
    
    // Check if we're in a segmented view (end, transition, epilogue)
    if (currentSegment === 'end' || currentSegment === 'transition') {
      nextSegment();
    } else {
      nextChapter();
    }
  };
  const handlePrevChapter = () => {
    setButtonsVisible(false); // Fade out button before transition
    prevChapter();
  };

  return (
    <div className={`w-full ${getContentHeight()} max-w-4xl mx-auto flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl content-transition border border-gray-200 dark:border-gray-700`}>
      {/* Chapter Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">
          Chapter {chapterInfo.number}: {chapterInfo.title}
        </h2>
      </div>
      {/* Story Text Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className={`whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed text-lg transition-opacity duration-300 ${isTransitioning ? 'opacity-30' : 'opacity-100'}`}>
            {displayedText}
            {isTyping && (
              <span className="inline-block w-2 h-6 bg-gray-800 dark:bg-gray-200 ml-1 typing-cursor" />
            )}
          </div>
        </div>
      </div>      {/* Choice Buttons */}
      {showChoices && choices.length > 0 && (        <div className={`p-6 border-t border-gray-200 dark:border-gray-600 transition-all duration-500 ease-out ${buttonsVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div className="flex flex-col space-y-4">
            {choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(currentPrompt || 'prompt1', choice.id)}                className={`w-full p-5 text-left bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-xl button-hover shadow-sm hover:shadow-lg transition-all duration-300 ${buttonsVisible ? 'animate-fadeInUp' : ''}`}
                style={{
                  animationDelay: buttonsVisible ? `${index * 150}ms` : '0ms'
                }}
              >
                <span className="text-blue-800 dark:text-blue-200 font-medium text-base">
                  Option {choice.id}: {choice.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}      {/* Navigation and Action Buttons */}
      {(showNextButton || showPrevButton) && (
        <div className={`p-6 border-t border-gray-200 dark:border-gray-600 transition-all duration-500 ease-out ${buttonsVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
          <div className="flex gap-4">
            {/* Previous Button */}
            {showPrevButton && (
              <button
                onClick={handlePrevChapter}
                className={`flex-1 p-5 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl button-hover shadow-sm hover:shadow-lg transition-all duration-300 ${buttonsVisible ? 'animate-fadeInUp' : ''}`}
              >
                <span className="text-gray-800 dark:text-gray-200 font-medium text-base">
                  ← Previous Chapter
                </span>
              </button>
            )}
            
            {/* Next Button */}
            {showNextButton && (
              <button
                onClick={handleNextChapter}
                className={`flex-1 p-5 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 border border-green-200 dark:border-green-700 rounded-xl button-hover shadow-sm hover:shadow-lg transition-all duration-300 ${buttonsVisible ? 'animate-fadeInUp' : ''}`}
              >                <span className="text-green-800 dark:text-green-200 font-medium text-base">
                  {currentChapter === 'gameplot' 
                    ? 'Begin Story' 
                    : currentSegment === 'end' 
                      ? 'Continue' 
                      : currentSegment === 'transition' 
                        ? 'Continue' 
                        : 'Next Chapter'} →
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
