'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global error:', error);
    }, [error]);

    return (
        <html>
            <body className="min-h-screen bg-ink-900 flex items-center justify-center">
                <div className="text-center px-6">
                    {/* 500 Number */}
                    <div className="relative mb-8">
                        <span className="text-[150px] md:text-[200px] font-display text-ink-800 leading-none select-none">
                            500
                        </span>
                    </div>

                    {/* Message */}
                    <h1 className="font-display text-3xl md:text-4xl text-paper-50 mb-4">
                        Bir Hata Oluştu
                    </h1>
                    <p className="text-paper-300 max-w-md mx-auto mb-8">
                        Üzgünüz, beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya daha sonra geri dönün.
                    </p>

                    {/* Error digest for debugging */}
                    {error.digest && (
                        <p className="text-paper-500 text-sm mb-8">
                            Hata Kodu: {error.digest}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => reset()}
                            className="px-8 py-4 bg-paper-50 text-ink-900 font-medium hover:bg-paper-100 transition-colors"
                        >
                            Tekrar Dene
                        </button>
                        <Link
                            href="/"
                            className="px-8 py-4 border border-paper-50/20 text-paper-50 font-medium hover:bg-paper-50/10 transition-colors"
                        >
                            Anasayfaya Dön
                        </Link>
                    </div>
                </div>
            </body>
        </html>
    );
}
