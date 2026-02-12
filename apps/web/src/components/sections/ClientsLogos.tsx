'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Client {
    id: string;
    name: string;
    logo: string;
    website?: string;
    order: number;
}

interface ClientsLogosProps {
    title?: string;
    locale?: string;
}

export default function ClientsLogos({
    title,
    locale = 'tr'
}: ClientsLogosProps) {
    const isEn = locale === 'en';
    const displayTitle = title || (isEn ? 'Trusted By' : 'Referanslarımız');

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch('/api/admin/content/clients');
                const data = await res.json();
                if (data.success && data.data?.clients) {
                    // Sort by order
                    const sorted = data.data.clients.sort((a: Client, b: Client) => a.order - b.order);
                    setClients(sorted);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClients();
    }, []);

    // Double the array for seamless infinite scroll
    const displayClients = [...clients, ...clients];

    if (loading) {
        return (
            <section className="py-16 md:py-20 bg-ink-800 overflow-hidden">
                <div className="container mx-auto px-6 text-center">
                    <div className="h-32 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-forest-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    if (clients.length === 0) {
        return null;
    }

    return (
        <section className="py-16 md:py-20 bg-ink-800 overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 lg:px-24 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <span className="text-forest-400 text-sm font-medium tracking-wider uppercase mb-3 block">
                        {displayTitle}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-paper-50">
                        {isEn ? 'Brands We Work With' : 'Birlikte Çalıştığımız Markalar'}
                    </h3>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative">
                {/* Gradient Overlays for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ink-800 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ink-800 to-transparent z-10 pointer-events-none" />

                {/* Scrolling Logos */}
                <motion.div
                    className="flex items-center gap-8 py-8"
                    animate={{
                        x: ['0%', '-50%'],
                    }}
                    transition={{
                        x: {
                            duration: 40,
                            repeat: Infinity,
                            ease: 'linear',
                        },
                    }}
                >
                    {displayClients.map((client, index) => (
                        <div
                            key={`${client.id}-${index}`}
                            className="flex-shrink-0 group cursor-pointer"
                        >
                            <div className="w-[140px] h-[70px] relative flex items-center justify-center bg-ink-700/30 rounded-lg transition-all duration-300 group-hover:bg-ink-700/50 group-hover:scale-105 border border-ink-700/50 group-hover:border-forest-500/30 overflow-hidden">
                                <Image
                                    src={client.logo}
                                    alt={client.name}
                                    fill
                                    className="object-contain p-3 grayscale opacity-60 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                                    sizes="140px"
                                    onError={(e) => {
                                        // Show text on error
                                        e.currentTarget.style.display = 'none';
                                        const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text');
                                        if (fallback) (fallback as HTMLElement).style.display = 'flex';
                                    }}
                                />
                                <span className="fallback-text hidden text-paper-400 text-xs font-medium group-hover:text-paper-50 transition-colors items-center justify-center absolute inset-0 text-center px-2">
                                    {client.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

