'use client';

import { Locale, routing } from '@/i18n/routing';
import { useParams, usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const currentLocale = params.locale as Locale;

    const switchLocale = (newLocale: Locale) => {
        // Get the path without the locale prefix
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
        router.push(`/${newLocale}${pathWithoutLocale}`);
    };

    return (
        <div className="flex flex-col items-center gap-1">
            {routing.locales.map((locale) => (
                <button
                    key={locale}
                    onClick={() => switchLocale(locale)}
                    className={`text-caption uppercase tracking-widest transition-colors ${locale === currentLocale
                            ? 'text-paper-50'
                            : 'text-paper-300/40 hover:text-paper-300'
                        }`}
                    aria-current={locale === currentLocale ? 'true' : undefined}
                >
                    {locale}
                </button>
            ))}
        </div>
    );
}
