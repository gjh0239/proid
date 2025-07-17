export const storyData = {
  gameplot: {
    type: 'narrator',
    text: "Kai is a year 1 mass comm student at NP. One day, he stays late at the NP library studying. He finds an old-looking book/journal (?). He gets transported back to the 1963 newly-opened Ngee Ann College. Still holding the book, he hears someone shout \"You found my book!\". Kai meets Mei, a business student at Ngee Ann College that has a passion for creative writing and the arts."
  },
  
  chapters: {
    1: {
      title: "Before the 1960s",
      content: "Placeholder: Content will be added.\n\nThis chapter will explore the historical context and events leading up to the founding of Ngee Ann College in 1963. The rich history and cultural significance of this institution will be revealed through immersive storytelling."
    },
    
    2: {
      title: "The Beginning and the Proposal (1960s to before 1980s)",      content: {
        start: "Mei invites Kai to sit in for her business class. In class, Mei slides Kai a proposal that she has written for the principal, calling for creative electives in Ngee Ann College.",
        
        prompt1: {
          type: 'choice',
          options: [
            { id: 1, text: "Focus on business class" },
            { id: 2, text: "Help Mei with the proposal" }
          ],
          results: {
            1: "Mei winks at Kai, and went back to listening to the class. After class, Mei asks Kai if he would like to grab a coffee together, to which Kai gladly accepted. After finding a table to enjoy their coffee, Mei asks Kai again if he could help with her proposal for the creation of creative electives in Ngee Ann College to the principal.",
            2: "Mei slides a rough sketch of her protest idea across the table to Kai."
          },
          // Special handling for choice 1 - loops back with only option 2
          loopback: {
            1: {
              options: [
                { id: 2, text: "Help Mei with the proposal" }
              ]
            }
          }
        },
        
        continue: "Kai scans the page, frowning. \"Seven courses… and none for the arts?\" he muttered. Business, Linguistics, and STEM were thriving — but creative disciplines were severely underrepresented. It wasn't just an oversight. It was inequality.\n\nMei had a bold idea: expand Ngee Ann's course offerings — to include Arts and Commerce — so every student, regardless of passion, had a place. She brought her proposal to Mr. Lien from the library, hoping he could help it reach the college board.\n\nAt the same time, whispers began to spread… Ngee Ann Kongsi was planning to transition into a full-fledged college. But the school board was livid.\n\nIn a drastic, out-of-touch move, they paused construction of the new campus — crushing Mei's dream of the School of Arts & Commerce. When Mei found out, she was furious.\n\nThat's when she and Kai decided — enough was enough. Together, they started planning a boycott. A student revolution.\n\nAs they worked side-by-side, Kai found himself falling for Mei. But he didn't know… it wasn't meant to last.\n\nOne of Mei's closest friends betrayed her to the board. She was expelled, just days before the protest. As she was dragged away, she looked at Kai one last time and whispered: \"This is it for me. Please… finish what we started. Goodbye.\" 💔\n\nKai had to do something.",
        
        prompt2: {
          type: 'choice',
          options: [
            { id: 1, text: "Try negotiating with the board" },
            { id: 2, text: "Serve as a leader, rallying the students" }
          ],
          results: {
            1: "Kai negotiates with the board. However, the board's disapproval set him back on his path. The board members were stubborn and unwilling to listen to reason. Kai realized that negotiation alone wouldn't be enough - he needed to take a stronger stand.",
            2: "Kai stands up to lead, serving the students, himself, and most importantly Mei."
          },
          // Special handling for choice 1 - shows result then only option 2
          loopback: {
            1: {
              options: [
                { id: 2, text: "Serve as a leader, rallying the students" }
              ]
            }
          }
        },
        
        end: "Heartbroken, he turned Mei's dream into a movement.\n\nWhen students saw what happened to her, they united. Together, they staged a mass protest — the biggest the school had ever seen.\n\nCornered by public pressure, the board caved. Construction resumed. The School of Arts & Commerce was finally born.",
        
        transition: "🎓 Ten Years Later...",
        
        epilogue: "Kai stood at the gates of the new campus. It was everything Mei had imagined… but she wasn't there to see it. He had won the battle. But at what cost?"
      }
    },
    
    3: {
      title: "Echo (1990s)",
      content: "It had been ten years.\n\nKai stood still in the middle of the new Clementi campus, surrounded by sleek buildings and wide walkways. The student body had doubled. The architecture was modern. But for Kai, it felt hollow—like something important had been paved over. The revolution had worked. The School of Arts and Commerce had been built. But Mei… Mei wasn't here to see it.\n\nAs he wandered past the new Business Block, something caught his eye—a tree with a small bronze plaque at the base: \"Planted by Class of '63 – For the Future.\" He felt a pull. Digging slightly into the soil around it, his fingers struck metal—a rusted tin box. Inside: a faded poem written in Mei's handwriting, and a single line that hit him harder than anything else: \"If they forget us, then remember for me.\"\n\nThe 1990s were changing fast. In 1992, the campus had officially moved from its humble beginnings at Kim Yam Road to Clementi. By 1998, Ngee Ann launched its Centre for Computer Studies, and in 1999, became the first polytechnic in Singapore to go fully wireless. Technology was taking over. The revolution had become digitized.\n\nKai, now older and quieter, created something small—an underground student archive in a forgotten corner of the school server. He named it Echo. He scanned Mei's writings, archived protest flyers, and saved photos of their handwritten proposal. Not many knew it existed, but Kai didn't care. Mei's voice was back in the school system—not as noise, but as memory.\n\nPlaceholder: Additional content and choices will be added for Chapter 3."
    }
  },
  
  // Helper function to get chapter info
  getChapterInfo: function(chapterKey) {
    if (chapterKey === 'gameplot') {
      return { title: 'Prologue', number: 0 };
    }
    const chapterNum = parseInt(chapterKey);
    return {
      title: this.chapters[chapterNum]?.title || 'Unknown Chapter',
      number: chapterNum
    };
  },
  
  // Get available chapters
  getAvailableChapters: function() {
    return ['gameplot', 1, 2, 3];
  }
};
