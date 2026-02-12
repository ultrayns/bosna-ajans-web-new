import fs from 'fs/promises';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import path from 'path';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    tags: string[];
    author: string;
    publishDate: string;
    seoTitle: string;
    seoDescription: string;
}

type Props = {
    params: Promise<{ locale: string; slug: string }>;
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

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const posts = await getBlogPosts();
    return posts.find(p => p.slug === slug) || null;
}

export async function generateStaticParams() {
    const posts = await getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return { title: 'Makale Bulunamadı' };
    }

    return {
        title: post.seoTitle || `${post.title} | BOSNA AJANS`,
        description: post.seoDescription || post.excerpt,
        keywords: post.tags?.join(', '),
        openGraph: {
            title: post.seoTitle || post.title,
            description: post.seoDescription || post.excerpt,
            images: post.image ? [post.image] : [],
            type: 'article',
            publishedTime: post.publishDate,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await getBlogPost(slug);
    const allPosts = await getBlogPosts();

    if (!post) {
        notFound();
    }

    const isEn = locale === 'en';
    const relatedPosts = allPosts
        .filter(p => p.slug !== slug && p.category === post.category)
        .slice(0, 3);

    // Simple markdown to HTML conversion
    const formatContent = (content: string) => {
        return content
            .split('\n\n')
            .map(paragraph => {
                if (paragraph.startsWith('## ')) {
                    return `<h2 class="font-display text-2xl text-paper-50 mt-10 mb-4">${paragraph.slice(3)}</h2>`;
                }
                if (paragraph.startsWith('### ')) {
                    return `<h3 class="font-display text-xl text-paper-50 mt-8 mb-3">${paragraph.slice(4)}</h3>`;
                }
                if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map(item =>
                        `<li class="mb-2">${item.slice(2)}</li>`
                    ).join('');
                    return `<ul class="list-disc list-inside text-paper-300 space-y-1 mb-4">${items}</ul>`;
                }
                if (paragraph.match(/^\d+\./)) {
                    const items = paragraph.split('\n').map(item =>
                        `<li class="mb-2">${item.replace(/^\d+\.\s*/, '')}</li>`
                    ).join('');
                    return `<ol class="list-decimal list-inside text-paper-300 space-y-1 mb-4">${items}</ol>`;
                }
                // Handle bold text
                const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-paper-50">$1</strong>');
                return `<p class="text-paper-300 leading-relaxed mb-4">${formatted}</p>`;
            })
            .join('');
    };

    return (
        <main className="min-h-screen bg-ink-900">
            {/* Hero */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    {/* Back link */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-paper-400 hover:text-forest-400 transition-colors mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {isEn ? 'All Articles' : 'Tüm Makaleler'}
                    </Link>

                    {/* Category */}
                    <span className="inline-block px-4 py-1 bg-forest-500/20 text-forest-400 text-sm font-medium rounded-full mb-6">
                        {post.category}
                    </span>

                    {/* Title */}
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50 mb-6 max-w-4xl leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-paper-400 text-sm">
                        <span>{post.author}</span>
                        <span className="w-1 h-1 bg-paper-600 rounded-full" />
                        <time>
                            {new Date(post.publishDate).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="pb-12">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="relative aspect-[21/9] rounded-3xl overflow-hidden">
                        <Image
                            src={post.image || '/media/placeholder.jpg'}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="pb-16 md:pb-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content */}
                        <article
                            className="lg:col-span-8 prose prose-lg prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
                        />

                        {/* Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-32 space-y-8">
                                {/* Tags */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="bg-ink-800/50 rounded-2xl p-6 border border-ink-700">
                                        <h3 className="text-paper-50 font-medium mb-4">Etiketler</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-ink-700 text-paper-300 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="bg-forest-500/10 rounded-2xl p-6 border border-forest-500/30">
                                    <h3 className="text-paper-50 font-medium mb-2">
                                        {isEn ? 'Need Professional Help?' : 'Profesyonel Yardıma mı İhtiyacınız Var?'}
                                    </h3>
                                    <p className="text-paper-400 text-sm mb-4">
                                        {isEn
                                            ? 'Contact us for your photography and video projects.'
                                            : 'Fotoğraf ve video projeleriniz için bize ulaşın.'}
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="block w-full text-center px-6 py-3 bg-forest-500 text-paper-50 font-medium rounded-xl hover:bg-forest-600 transition-colors"
                                    >
                                        {isEn ? 'Get a Quote' : 'Teklif Al'}
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-16 md:py-24 bg-ink-800/50 border-t border-ink-700">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24">
                        <h2 className="font-display text-2xl text-paper-50 mb-8">
                            {isEn ? 'Related Articles' : 'İlgili Makaleler'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((p) => (
                                <Link
                                    key={p.id}
                                    href={`/blog/${p.slug}`}
                                    className="group block"
                                >
                                    <article className="bg-ink-900 rounded-2xl overflow-hidden border border-ink-700 hover:border-forest-500/50 transition-all">
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image
                                                src={p.image || '/media/placeholder.jpg'}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-display text-lg text-paper-50 group-hover:text-forest-400 transition-colors line-clamp-2">
                                                {p.title}
                                            </h3>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
