'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Page error:', error);
    }, [error]);

    return (
        <main className="min-h-screen bg-paper-50 dark:bg-ink-900 flex items-center justify-center">
            <div className="text-center px-6">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-oxide-100 dark:bg-oxide-900/30 flex items-center justify-center">
                    <svg className="w-10 h-10 text-oxide-600 dark:text-oxide-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Message */}
                <h1 className="font-display text-2xl md:text-3xl text-ink-900 dark:text-paper-50 mb-4">
                    Bir Şeyler Ters Gitti
                </h1>
                <p className="text-ink-600 dark:text-paper-300 max-w-md mx-auto mb-8">
                    Bu sayfayı yüklerken bir sorun oluştu. Lütfen tekrar deneyin.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-8 py-4 bg-ink-900 dark:bg-paper-50 text-paper-50 dark:text-ink-900 font-medium hover:bg-ink-800 dark:hover:bg-paper-100 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-4 border border-ink-300 dark:border-paper-50/20 text-ink-900 dark:text-paper-50 font-medium hover:bg-ink-100 dark:hover:bg-paper-50/10 transition-colors"
                    >
                        Anasayfaya Dön
                    </Link>
                </div>
            </div>
        </main>
    );
}
