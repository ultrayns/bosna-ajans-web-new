import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-paper-50 dark:bg-ink-900 flex items-center justify-center">
            <div className="text-center px-6">
                {/* 404 Number */}
                <div className="relative mb-8">
                    <span className="text-[200px] md:text-[300px] font-display text-ink-100 dark:text-ink-800 leading-none select-none">
                        404
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-forest-500/20 animate-pulse" />
                    </div>
                </div>

                {/* Message */}
                <h1 className="font-display text-3xl md:text-4xl text-ink-900 dark:text-paper-50 mb-4">
                    Sayfa Bulunamadı
                </h1>
                <p className="text-ink-600 dark:text-paper-300 max-w-md mx-auto mb-8">
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-ink-900 dark:bg-paper-50 text-paper-50 dark:text-ink-900 font-medium hover:bg-ink-800 dark:hover:bg-paper-100 transition-colors"
                    >
                        Anasayfaya Dön
                    </Link>
                    <Link
                        href="/contact"
                        className="px-8 py-4 border border-ink-300 dark:border-paper-50/20 text-ink-900 dark:text-paper-50 font-medium hover:bg-ink-100 dark:hover:bg-paper-50/10 transition-colors"
                    >
                        İletişime Geç
                    </Link>
                </div>
            </div>
        </main>
    );
}
