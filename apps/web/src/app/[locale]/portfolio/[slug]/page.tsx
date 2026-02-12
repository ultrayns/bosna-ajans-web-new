import { BlockRenderer } from '@/components/blocks';
import { NextProject, ProjectHero } from '@/components/project';
import { getProjectBySlug, mockProjectDetails } from '@/lib/mock-project-detail';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

// Generate static paths for all projects
export async function generateStaticParams() {
    return Object.keys(mockProjectDetails).map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        return { title: 'Project Not Found' };
    }

    return {
        title: `${project.title} | BOSNAAJANS`,
        description: project.shortIntro,
        openGraph: {
            title: `${project.title} | BOSNAAJANS`,
            description: project.shortIntro,
            images: project.heroPoster ? [project.heroPoster] : undefined,
        },
    };
}

export default async function ProjectDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    // Get next project
    const projectIndex = Object.keys(mockProjectDetails).indexOf(slug);
    const nextSlug = Object.keys(mockProjectDetails)[(projectIndex + 1) % Object.keys(mockProjectDetails).length];
    const nextProject = mockProjectDetails[nextSlug];

    return (
        <main className="min-h-screen bg-paper-50 dark:bg-ink-900">
            {/* Hero */}
            <ProjectHero
                title={project.title}
                client={project.client.name}
                year={project.year}
                categories={project.categories}
                services={project.services}
                shortIntro={project.shortIntro}
                heroPoster={project.heroPoster}
                heroVideo={project.heroVideo}
            />

            {/* Full Description */}
            {project.fullDescription && (
                <section className="py-16 md:py-24">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <p className="text-xl text-ink-700 dark:text-paper-300 leading-relaxed">
                            {project.fullDescription}
                        </p>
                    </div>
                </section>
            )}

            {/* Blocks */}
            <section className="py-8 md:py-12">
                <BlockRenderer blocks={project.blocks} credits={project.credits} />
            </section>

            {/* Next Project */}
            {nextProject && (
                <NextProject project={nextProject} />
            )}
        </main>
    );
}
