import type { Metadata } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/layout';

/**
 * FONTS CONFIGURATION
 *
 * Configured via CSS variables with Google Fonts link for high reliability
 * in both sandboxed and offline production build environments.
 */
const interClass = 'font-sans';
const playfairClass = 'font-serif';
const jetbrainsMonoClass = 'font-mono';

/**
 * METADATA
 *
 * SEO and social sharing configuration.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://shaikrohit.tech'),
  alternates: {
    canonical: 'https://shaikrohit.tech',
  },
  title: {
    default: 'Shaik Rohit | Full Stack & AI Developer',
    template: '%s | Shaik Rohit',
  },
  description:
    'Portfolio of Shaik Rohit — Frontend Developer, React, Docker, and AI Developer at Sithafal Technologies. Computer Engineering student at Dr. Y.C. James Yen Govt Polytechnic with 96% distinction.',
  keywords: [
    'Shaik Rohit',
    'software engineer',
    'full-stack developer',
    'react',
    'docker',
    'next.js',
    'typescript',
    'artificial intelligence',
    'generative ai',
    'portfolio',
    'tirupati',
    'kuppam',
  ],
  authors: [{ name: 'Shaik Rohit', url: 'https://shaikrohit.tech' }],
  creator: 'Shaik Rohit',
  publisher: 'Shaik Rohit',
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://shaikrohit.tech',
    siteName: 'Shaik Rohit Portfolio',
    title: 'Shaik Rohit | Full Stack & AI Developer',
    description:
      'Explore the verified engineering portfolio of Shaik Rohit featuring containerized apps, AI tools, and 3D Canvas visualizers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shaik Rohit Portfolio Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shaik Rohit | Full Stack & AI Developer',
    description:
      'Portfolio of Shaik Rohit featuring modern web applications, Docker workflows, and AI assistants.',
    images: ['/og-image.png'],
    creator: '@rohitshaik',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

/**
 * JSON-LD PERSON SCHEMA (schema.org/Person)
 * High-fidelity structured metadata for Google Rich Results & Knowledge Graph
 */
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://shaikrohit.tech/#person',
  name: 'Shaik Rohit',
  alternateName: ['Rohit Shaik', 'Shaik Rohit Official'],
  givenName: 'Shaik',
  familyName: 'Rohit',
  jobTitle: 'Full Stack & AI Developer',
  description:
    'Full Stack Engineer and AI Developer specializing in React, Next.js, TypeScript, Docker containerization, and Generative AI workflows.',
  url: 'https://shaikrohit.tech',
  image: 'https://shaikrohit.tech/og-image.png',
  email: 'mailto:shaik.rohit.official@gmail.com',
  sameAs: [
    'https://github.com/shaikrohit',
    'https://www.linkedin.com/in/rohitshaik',
    'https://x.com/rohitshaik',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kuppam',
    addressRegion: 'Andhra Pradesh',
    postalCode: '517425',
    addressCountry: 'IN',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Dr. Y.C. James Yen Govt Polytechnic',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kuppam',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Sithafal Technologies',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Tirupati',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN',
    },
  },
  knowsAbout: [
    'Full Stack Development',
    'React',
    'Next.js 16',
    'TypeScript',
    'JavaScript',
    'Docker',
    'Nginx',
    'Python',
    'Flask',
    'Generative AI',
    'Large Language Models (LLMs)',
    'Tailwind CSS',
    'PostgreSQL',
    'Supabase',
    'Git',
    'Linux',
    'Web Accessibility (WCAG 2.1 AA)',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interClass} ${playfairClass} ${jetbrainsMonoClass} relative`}
      suppressHydrationWarning
    >
      <head>
        {/* Dynamic theme-color & color-scheme for browser chrome */}
        <meta name="theme-color" content="#ffffff" id="theme-color-meta" />
        <meta name="color-scheme" content="light dark" />

        {/* Synchronous inline script to eliminate FOUT before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme-storage');var m='system';if(s){var p=JSON.parse(s);m=(p&&p.state&&p.state.mode)||p.mode||s;}var isDark=m==='dark'||(m!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var el=document.documentElement;if(isDark){el.classList.add('dark');el.classList.remove('light');el.setAttribute('data-theme','dark');}else{el.classList.remove('dark');el.classList.add('light');el.setAttribute('data-theme','light');}var meta=document.getElementById('theme-color-meta')||document.querySelector('meta[name="theme-color"]');if(meta){meta.setAttribute('content',isDark?'#07090e':'#ffffff');}}catch(e){}})();`,
          }}
        />

        {/* JSON-LD Person Structured Data for SEO Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7343735267369878"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[var(--surface-base)] font-sans text-[var(--text-primary)] antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
