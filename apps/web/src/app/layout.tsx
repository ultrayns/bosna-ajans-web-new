import { ThemeProvider } from '@/components/providers/ThemeProvider';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
    variable: '--font-sans',
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
});

const playfair = Playfair_Display({
    variable: '--font-display',
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
        default: 'BOSNAAJANS | Fashion-grade Production',
        template: '%s | BOSNAAJANS',
    },
    description: 'Premium fotoğraf ve video prodüksiyon ajansı. Fashion, marka ve müzik projeleri.',
    openGraph: {
        type: 'website',
        locale: 'tr_TR',
        alternateLocale: 'en_US',
        siteName: 'BOSNAAJANS',
    },
    twitter: {
        card: 'summary_large_image',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} antialiased bg-paper-50 dark:bg-ink-900 text-ink-900 dark:text-paper-50 transition-colors duration-300`}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
