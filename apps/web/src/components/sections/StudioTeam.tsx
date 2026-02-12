'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TeamMember {
    name: string;
    role?: string;
    photo?: string;
}

interface StudioTeamProps {
    title?: string;
    teamMembers: TeamMember[];
}

export default function StudioTeam({ title = 'The Team', teamMembers }: StudioTeamProps) {
    return (
        <section className="py-24 md:py-32 bg-paper-50 dark:bg-ink-900">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 dark:text-paper-50">
                        {title}
                    </h2>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            {/* Photo */}
                            <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                                {member.photo ? (
                                    <Image
                                        src={member.photo}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-ink-800" />
                                )}
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/20 transition-colors duration-500" />
                            </div>

                            {/* Name & Role */}
                            <h3 className="font-display text-lg text-ink-900 dark:text-paper-50 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                                {member.name}
                            </h3>
                            {member.role && (
                                <p className="text-sm text-ink-500 dark:text-paper-400">
                                    {member.role}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
