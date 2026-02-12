import fs from 'fs/promises';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import path from 'path';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    category: string;
    publishDate: string;
    featured: boolean;
}

type Props = {
    params: Promise<{ locale: string }>;
};

async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'blog.json');
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        return data.posts || [];
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    return {
        title: isEn ? 'Blog | BOSNA AJANS' : 'Blog | BOSNA AJANS',
        description: isEn
            ? 'Tips, guides and insights about photography and video production.'
            : 'Fotoğrafçılık ve video prodüksiyon hakkında ipuçları, rehberler ve içgörüler.',
    };
}

export default async function BlogPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isEn = locale === 'en';
    const posts = await getBlogPosts();
    const featuredPosts = posts.filter(p => p.featured);
    const regularPosts = posts.filter(p => !p.featured);

    return (
        <main className="min-h-screen bg-ink-900">
            {/* Hero */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <span className="text-forest-400 text-sm font-medium tracking-wider uppercase mb-4 block">
                        Blog
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-paper-50 mb-6">
                        {isEn ? 'Insights & Tips' : 'İçgörüler & İpuçları'}
                    </h1>
                    <p className="text-xl text-paper-300 max-w-2xl">
                        {isEn
                            ? 'Latest articles about photography, video production, and creative industry insights.'
                            : 'Fotoğrafçılık, video prodüksiyon ve kreatif sektör hakkında en son makaleler.'}
                    </p>
                </div>
            </section>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
                <section className="pb-16 md:pb-24">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24">
                        <h2 className="text-2xl font-display text-paper-50 mb-8">
                            {isEn ? 'Featured Articles' : 'Öne Çıkan Makaleler'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group block"
                                >
                                    <article className="bg-ink-800 rounded-2xl overflow-hidden border border-ink-700 hover:border-forest-500/50 transition-all duration-300">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={post.image || '/media/placeholder.jpg'}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-forest-500 text-paper-50 text-xs font-medium rounded-full">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-display text-xl text-paper-50 mb-3 group-hover:text-forest-400 transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-paper-400 text-sm line-clamp-2 mb-4">
                                                {post.excerpt}
                                            </p>
                                            <time className="text-paper-500 text-xs">
                                                {new Date(post.publishDate).toLocaleDateString('tr-TR', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="py-16 md:py-24 bg-ink-800/50">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <h2 className="text-2xl font-display text-paper-50 mb-8">
                        {isEn ? 'All Articles' : 'Tüm Makaleler'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group block"
                            >
                                <article className="bg-ink-900 rounded-2xl overflow-hidden border border-ink-700 hover:border-forest-500/50 transition-all duration-300">
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <Image
                                            src={post.image || '/media/placeholder.jpg'}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-forest-400 text-xs font-medium mb-2 block">
                                            {post.category}
                                        </span>
                                        <h3 className="font-display text-lg text-paper-50 mb-3 group-hover:text-forest-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-paper-400 text-sm line-clamp-2">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 md:py-32 border-t border-ink-700">
                <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
                    <h2 className="font-display text-3xl md:text-4xl text-paper-50 mb-6">
                        {isEn ? 'Have a Project in Mind?' : 'Aklınızda Bir Proje mi Var?'}
                    </h2>
                    <p className="text-paper-300 text-lg mb-10 max-w-xl mx-auto">
                        {isEn
                            ? 'Let\'s discuss how we can bring your vision to life.'
                            : 'Vizyonunuzu nasıl hayata geçirebileceğimizi konuşalım.'}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-paper-50 text-ink-900 font-semibold rounded-full hover:bg-forest-400 transition-all duration-300"
                    >
                        {isEn ? 'Contact Us' : 'İletişime Geç'}
                    </Link>
                </div>
            </section>
        </main>
    );
}
