import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/layout';

/**
 * FONTS
 *
 * Inter: Clean, readable sans-serif for body text
 * Playfair Display: Elegant serif for headings
 * JetBrains Mono: Excellent monospace for code
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

/**
 * METADATA
 *
 * SEO and social sharing configuration.
 */
export const metadata: Metadata = {
  title: {
    default: 'Shaik Rohit | Full Stack Developer & Cybersecurity Enthusiast',
    template: '%s | Shaik Rohit',
  },
  description:
    'Portfolio of Shaik Rohit, a Full Stack Developer and Cybersecurity enthusiast. Explore my projects, skills, and professional journey in software engineering and network security.',
  keywords: [
    'Shaik Rohit',
    'software engineer',
    'full-stack developer',
    'cybersecurity',
    'penetration testing',
    'react',
    'next.js',
    'typescript',
    'portfolio',
  ],
  authors: [{ name: 'Shaik Rohit' }],
  creator: 'Shaik Rohit',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shaikrohit.tech',
    siteName: 'Shaik Rohit Portfolio',
    title: 'Shaik Rohit | Full Stack Developer & Cybersecurity Enthusiast',
    description:
      'Explore the professional portfolio of Shaik Rohit, featuring full-stack applications and cybersecurity projects.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Shaik Rohit Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shaik Rohit | Full Stack Developer & Cybersecurity Enthusiast',
    description:
      'Portfolio of Shaik Rohit, featuring projects in web development and cybersecurity.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} bg-surface-base relative`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Theme color for browser chrome */}
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="bg-[var(--surface-base)] font-sans text-[var(--text-primary)] antialiased transition-colors duration-300">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
