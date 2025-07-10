# School History Microsite Development Guide

This guide will help you build the skeleton for your school history microsite using Next.js with App Router and Tailwind CSS.

## Table of Contents

1. [Adding New Pages](#adding-new-pages)
2. [Adding Components to Pages](#adding-components-to-pages)
3. [Styling with Tailwind CSS](#styling-with-tailwind-css)
4. [Routing Between Pages](#routing-between-pages)
5. [Creating a Sticky Navigation Bar](#creating-a-sticky-navigation-bar)

## Adding New Pages

With Next.js App Router, pages are created using the file system structure in the `/app` directory.

### Basic Page Structure

To create a new page:

1. Navigate to the `/app` directory
2. Create a new folder with the name of your route (e.g., `chapters`)
3. Add a `page.js` file inside that folder

```js
// For example: /app/chapters/page.js
export default function ChaptersPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Chapters Overview</h1>
      <p>Explore the different chapters of our school's history.</p>
    </main>
  );
}
```

### Creating Chapter Pages

For individual chapters:

```js
// For example: /app/chapters/chapter1/page.js
export default function Chapter1Page() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Chapter 1: The Beginning (1960-1970)</h1>
      <div className="prose max-w-none">
        <p>Content about this decade of school history...</p>
        
        {/* Visual Novel Section will go here */}
        <div className="mt-12 p-6 border rounded-lg bg-slate-50">
          <h2 className="text-2xl font-semibold mb-4">Interactive Story</h2>
          <p>Visual novel content will be placed here...</p>
        </div>
      </div>
    </main>
  );
}
```

## Adding Components to Pages

Components help organize and reuse UI elements across your microsite.

### Creating a Component

1. Create a `components` folder in the project root
2. Add your component files inside

```js
// /components/BookCover.js - For your home page animation
export default function BookCover({ onOpen }) {
  return (
    <div 
      className="book-cover cursor-pointer" 
      onClick={onOpen}
    >
      <div className="book-spine"></div>
      <div className="book-front flex items-center justify-center bg-amber-100 p-12 rounded shadow-lg">
        <h1 className="text-4xl font-bold text-center">School History Project</h1>
      </div>
    </div>
  );
}
```

### Using Components in Pages

Import and use components in your page files:

```js
// /app/page.js - Home page with book animation
import { useState } from 'react';
import BookCover from '@/components/BookCover';
import Synopsis from '@/components/Synopsis';

export default function HomePage() {
  const [isBookOpen, setIsBookOpen] = useState(false);
  
  return (
    <main className="min-h-screen flex items-center justify-center">
      {!isBookOpen ? (
        <BookCover onOpen={() => setIsBookOpen(true)} />
      ) : (
        <Synopsis />
      )}
    </main>
  );
}
```

## Styling with Tailwind CSS

Your project is already set up with Tailwind CSS, making styling straightforward.

### Using Tailwind Classes

Apply Tailwind utility classes directly to HTML elements:

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600">
  This is a styled box
</div>
```

### Custom Animations

For the book opening animation, you can use CSS keyframes with Tailwind:

1. Create a `styles` folder with a `globals.css` file if not already present
2. Add custom animations:

```css
/* /styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .book-cover {
    @apply relative w-[600px] h-[400px] perspective-1000;
    transform-style: preserve-3d;
  }
  
  .book-front {
    @apply absolute inset-0 backface-hidden transition-transform duration-1000;
  }
  
  .book-cover:hover .book-front {
    @apply transform-gpu rotate-y-90;
  }
}

@keyframes openBook {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(-180deg); }
}
```

### Responsive Design

Use Tailwind's responsive prefixes for different screen sizes:

```jsx
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">Responsive Heading</h1>
</div>
```

## Routing Between Pages

Next.js App Router handles routing automatically based on your file structure.

### Navigation Links

Use the `Link` component from Next.js to navigate between pages:

```jsx
import Link from 'next/link';

export default function NavLinks() {
  return (
    <nav>
      <ul className="flex gap-4">
        <li><Link href="/" className="hover:underline">Home</Link></li>
        <li><Link href="/chapters" className="hover:underline">Chapters</Link></li>
        <li><Link href="/chapters/chapter1" className="hover:underline">Chapter 1</Link></li>
        {/* More chapter links */}
      </ul>
    </nav>
  );
}
```

### Programmatic Navigation

To navigate programmatically (like after the book animation):

```jsx
import { useRouter } from 'next/navigation';

export default function BookCover() {
  const router = useRouter();
  
  const handleClick = () => {
    // Animate the book opening
    // Then navigate
    setTimeout(() => {
      router.push('/chapters');
    }, 1000);
  };
  
  return (
    <div className="book-cover" onClick={handleClick}>
      {/* Book content */}
    </div>
  );
}
```

## Creating a Sticky Navigation Bar

Create a sticky navigation bar component:

```js
// /components/NavBar.js
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  
  const chapters = [
    { id: 1, title: "The Beginning", years: "1960-1970", path: "/chapters/chapter1" },
    { id: 2, title: "Growth Years", years: "1971-1980", path: "/chapters/chapter2" },
    // Add more chapters as needed
  ];
  
  return (
    <header className="sticky top-0 bg-slate-800 text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">School History</Link>
          
          <div className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className={`hover:text-blue-300 ${pathname === '/' ? 'text-blue-300' : ''}`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button className="hover:text-blue-300 flex items-center gap-1">
                Chapters <span>▼</span>
              </button>
              
              <div className="absolute left-0 mt-2 w-60 bg-slate-700 shadow-lg rounded-md hidden group-hover:block">
                <div className="py-2">
                  {chapters.map((chapter) => (
                    <Link 
                      key={chapter.id}
                      href={chapter.path}
                      className={`block px-4 py-2 hover:bg-slate-600 ${
                        pathname === chapter.path ? 'bg-slate-600' : ''
                      }`}
                    >
                      Chapter {chapter.id}: {chapter.title} ({chapter.years})
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}
```

### Adding the NavBar to your Layout

Create a root layout to include the NavBar on all pages:

```js
// /app/layout.js
import NavBar from '@/components/NavBar';
import '@/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
```

## Project Structure Example

```md
/app
  /page.js                  # Home page with book animation
  /layout.js                # Root layout with NavBar
  /chapters
    /page.js                # Chapters overview page
    /chapter1
      /page.js              # Chapter 1 content + visual novel
    /chapter2
      /page.js              # Chapter 2 content + visual novel
      
/components
  /BookCover.js             # Animated book component
  /Synopsis.js              # School history synopsis
  /NavBar.js                # Sticky navigation
  /VisualNovel.js           # Interactive story component

/styles
  /globals.css              # Global styles and animations
```

This structure will give you a solid foundation for building your school history microsite with all the features you described.
