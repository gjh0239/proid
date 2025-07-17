'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { storyData } from '../data/storyData';

const StoryContext = createContext();

const initialState = {
  currentChapter: 'gameplot',
  currentSection: 'start',
  currentSegment: null,
  displayedText: '',
  isTyping: false,
  showChoices: false,
  choices: [],
  selectedChoices: {},
  textIndex: 0,
  currentText: '',
  showNextButton: false,
  showPrevButton: false,
  history: [],
  isTransitioning: false,
  navigationHistory: ['gameplot'],
  currentPrompt: null,
  isLoopback: false
};

function storyReducer(state, action) {  switch (action.type) {    case 'START_TYPING':
      return {
        ...state,
        isTyping: true,
        displayedText: '',
        textIndex: 0,
        currentText: action.text,
        showChoices: false,
        showNextButton: false,
        isTransitioning: false
      };
    
    case 'START_TRANSITION':
      return {
        ...state,
        isTransitioning: true
      };
    
    case 'UPDATE_TEXT':
      return {
        ...state,
        displayedText: action.text,
        textIndex: action.index
      };
      case 'FINISH_TYPING':
      return {
        ...state,
        isTyping: false,
        showChoices: action.showChoices,
        choices: action.choices || [],
        showNextButton: action.showNextButton,
        isTransitioning: false,
        currentPrompt: action.currentPrompt,
        currentSegment: action.currentSegment,
        isLoopback: action.isLoopback || false
      };
    
    case 'MAKE_CHOICE':
      return {
        ...state,
        selectedChoices: {
          ...state.selectedChoices,
          [action.promptId]: action.choiceId
        },
        showChoices: false,
        history: [...state.history, { type: 'choice', promptId: action.promptId, choiceId: action.choiceId }]
      };
      case 'NEXT_SECTION':
      return {
        ...state,
        currentChapter: action.chapter,
        currentSection: action.section,
        showNextButton: false,
        showPrevButton: true,
        navigationHistory: [...state.navigationHistory, action.chapter]
      };
    
    case 'PREV_SECTION':
      const newHistory = [...state.navigationHistory];
      newHistory.pop(); // Remove current
      const prevChapter = newHistory[newHistory.length - 1] || 'gameplot';
      return {
        ...state,
        currentChapter: prevChapter,
        currentSection: 'start',
        showNextButton: false,
        showPrevButton: newHistory.length > 1,
        navigationHistory: newHistory
      };
    
    case 'RESET_STORY':
      return initialState;
    
    default:
      return state;
  }
}

export function StoryProvider({ children }) {
  const [state, dispatch] = useReducer(storyReducer, initialState);
  const typeText = (text, onComplete) => {
    dispatch({ type: 'START_TYPING', text });
    
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        dispatch({ 
          type: 'UPDATE_TEXT', 
          text: text.substring(0, index + 1),
          index: index + 1
        });
        index++;
      } else {
        clearInterval(typeInterval);
        onComplete();
      }
    }, 20); // Sped up from 30ms to 20ms (1.5x faster)
  };

  const showGamePlot = () => {
    typeText(storyData.gameplot.text, () => {
      dispatch({ 
        type: 'FINISH_TYPING', 
        showNextButton: true 
      });
    });
  };  const showChapter = (chapterNum) => {
    const chapter = storyData.chapters[chapterNum];
    if (!chapter) return;

    if (typeof chapter.content === 'string') {
      // Simple chapter without choices
      typeText(chapter.content, () => {
        // Determine if there's a next chapter
        const availableChapters = storyData.getAvailableChapters();
        const currentIndex = availableChapters.indexOf(chapterNum);
        const hasNext = currentIndex < availableChapters.length - 1;
        
        dispatch({ 
          type: 'FINISH_TYPING', 
          showNextButton: hasNext 
        });
      });
    } else {
      // Complex chapter with choices
      typeText(chapter.content.start, () => {
        dispatch({ 
          type: 'FINISH_TYPING', 
          showChoices: true,
          choices: chapter.content.prompt1?.options || [],
          currentPrompt: 'prompt1'
        });      });
    }
  };
  const makeChoice = (promptId, choiceId) => {
    dispatch({ type: 'START_TRANSITION' });
    
    setTimeout(() => {
      dispatch({ type: 'MAKE_CHOICE', promptId, choiceId });
      
      // Get the current chapter data
      const currentChapter = state.currentChapter === 'gameplot' ? 2 : parseInt(state.currentChapter);
      const chapter = storyData.chapters[currentChapter];
      
      if (chapter && chapter.content[promptId]) {
        const prompt = chapter.content[promptId];
        const result = prompt.results[choiceId];
        
        typeText(result, () => {
          // Check if this choice has loopback behavior
          if (prompt.loopback && prompt.loopback[choiceId]) {
            // Show the loopback choices
            const loopbackOptions = prompt.loopback[choiceId].options;
            dispatch({ 
              type: 'FINISH_TYPING', 
              showChoices: true,
              choices: loopbackOptions,
              currentPrompt: promptId,
              isLoopback: true
            });
          } else {
            // Normal flow - continue with the story
            setTimeout(() => {
              if (promptId === 'prompt1') {
                // After prompt1, show the continue text
                typeText(chapter.content.continue, () => {
                  dispatch({ 
                    type: 'FINISH_TYPING', 
                    showChoices: true,
                    choices: chapter.content.prompt2.options,
                    currentPrompt: 'prompt2'
                  });
                });
              } else if (promptId === 'prompt2') {
                // After prompt2, show the end text
                typeText(chapter.content.end, () => {
                  dispatch({ 
                    type: 'FINISH_TYPING', 
                    showNextButton: true,
                    currentSegment: 'end'
                  });
                });
              }
            }, 1000);
          }
        });
      }
    }, 300); // Brief fade-out delay
  };

  const nextSegment = () => {
    dispatch({ type: 'START_TRANSITION' });
    
    setTimeout(() => {
      const currentChapter = state.currentChapter === 'gameplot' ? 2 : parseInt(state.currentChapter);
      const chapter = storyData.chapters[currentChapter];
      
      if (state.currentSegment === 'end' && chapter.content.transition) {
        // Show transition screen
        typeText(chapter.content.transition, () => {
          dispatch({ 
            type: 'FINISH_TYPING', 
            showNextButton: true,
            currentSegment: 'transition'
          });
        });
      } else if (state.currentSegment === 'transition' && chapter.content.epilogue) {
        // Show epilogue screen
        typeText(chapter.content.epilogue, () => {
          dispatch({ 
            type: 'FINISH_TYPING', 
            showNextButton: true,
            currentSegment: 'epilogue'
          });
        });
      } else {
        // Move to next chapter
        nextChapter();
      }
    }, 300);
  };
  const nextChapter = () => {
    dispatch({ type: 'START_TRANSITION' });
    
    setTimeout(() => {
      const availableChapters = storyData.getAvailableChapters();
      const currentIndex = availableChapters.indexOf(state.currentChapter);
      const nextChapter = availableChapters[currentIndex + 1];
      
      if (nextChapter) {
        dispatch({ type: 'NEXT_SECTION', chapter: nextChapter, section: 'start' });
        if (nextChapter === 'gameplot') {
          showGamePlot();
        } else {
          showChapter(nextChapter);
        }
      }
    }, 300); // Brief fade-out delay
  };

  const prevChapter = () => {
    dispatch({ type: 'START_TRANSITION' });
    
    setTimeout(() => {
      dispatch({ type: 'PREV_SECTION' });
      // Get the previous chapter from history
      const newHistory = [...state.navigationHistory];
      newHistory.pop(); // Remove current
      const prevChapter = newHistory[newHistory.length - 1];
      
      if (prevChapter === 'gameplot') {
        showGamePlot();
      } else {
        showChapter(prevChapter);
      }
    }, 300);
  };  useEffect(() => {
    // Start with game plot
    showGamePlot();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StoryContext.Provider value={{
      ...state,
      makeChoice,
      nextChapter,
      nextSegment,
      prevChapter,
      typeText,
      getCurrentChapterInfo: () => storyData.getChapterInfo(state.currentChapter)
    }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}
