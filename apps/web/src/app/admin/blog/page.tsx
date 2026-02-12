'use client';

import { useEffect, useState } from 'react';

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
    featured: boolean;
    seoTitle: string;
    seoDescription: string;
}

export default function BlogAdminPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPost, setNewPost] = useState<Partial<BlogPost>>({
        category: 'Genel',
        author: 'BOSNA AJANS',
        featured: false,
        tags: [],
    });

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/content/blog');
            const data = await res.json();
            if (data.success && data.data?.posts) {
                setPosts(data.data.posts.sort((a: BlogPost, b: BlogPost) =>
                    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
                ));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    const savePosts = async (updatedPosts: BlogPost[]) => {
        try {
            const res = await fetch('/api/admin/content/blog', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ posts: updatedPosts }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Kaydedildi!' });
                setPosts(updatedPosts);
            } else {
                setMessage({ type: 'error', text: 'Hata oluştu' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleAdd = () => {
        if (!newPost.title) return;
        const post: BlogPost = {
            id: Date.now().toString(36),
            title: newPost.title,
            slug: generateSlug(newPost.title),
            excerpt: newPost.excerpt || '',
            content: newPost.content || '',
            image: newPost.image || '/media/blog/default.jpg',
            category: newPost.category || 'Genel',
            tags: newPost.tags || [],
            author: newPost.author || 'BOSNA AJANS',
            publishDate: new Date().toISOString().split('T')[0],
            featured: newPost.featured || false,
            seoTitle: newPost.seoTitle || newPost.title,
            seoDescription: newPost.seoDescription || newPost.excerpt || '',
        };
        savePosts([post, ...posts]);
        setNewPost({ category: 'Genel', author: 'BOSNA AJANS', featured: false, tags: [] });
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Bu makaleyi silmek istediğinize emin misiniz?')) {
            savePosts(posts.filter(p => p.id !== id));
        }
    };

    const handleUpdate = (id: string, updates: Partial<BlogPost>) => {
        const updatedPosts = posts.map(p => p.id === id ? { ...p, ...updates } : p);
        setPosts(updatedPosts);
    };

    const handleSaveEdit = (id: string) => {
        savePosts(posts);
        setEditingId(null);
    };

    const toggleFeatured = (id: string) => {
        const updatedPosts = posts.map(p =>
            p.id === id ? { ...p, featured: !p.featured } : p
        );
        savePosts(updatedPosts);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Blog Yönetimi</h1>
                    <p className="text-gray-400 mt-1">Blog makalelerini yönetin ({posts.length} makale)</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    + Yeni Makale
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Yeni Makale Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Başlık"
                            value={newPost.title || ''}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Kategori"
                            value={newPost.category || ''}
                            onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <textarea
                            placeholder="Özet"
                            value={newPost.excerpt || ''}
                            onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2"
                            rows={2}
                        />
                        <textarea
                            placeholder="İçerik (Markdown destekler)"
                            value={newPost.content || ''}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2"
                            rows={10}
                        />
                        <input
                            type="text"
                            placeholder="Görsel URL"
                            value={newPost.image || ''}
                            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Etiketler (virgülle ayırın)"
                            value={newPost.tags?.join(', ') || ''}
                            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value.split(',').map(t => t.trim()) })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="SEO Başlık"
                            value={newPost.seoTitle || ''}
                            onChange={(e) => setNewPost({ ...newPost, seoTitle: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="SEO Açıklama"
                            value={newPost.seoDescription || ''}
                            onChange={(e) => setNewPost({ ...newPost, seoDescription: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <label className="flex items-center gap-2 text-white">
                            <input
                                type="checkbox"
                                checked={newPost.featured || false}
                                onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                                className="w-4 h-4"
                            />
                            Öne Çıkan
                        </label>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                            Ekle
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                            İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        {editingId === post.id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={post.title}
                                        onChange={(e) => handleUpdate(post.id, { title: e.target.value })}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        placeholder="Başlık"
                                    />
                                    <input
                                        type="text"
                                        value={post.category}
                                        onChange={(e) => handleUpdate(post.id, { category: e.target.value })}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                        placeholder="Kategori"
                                    />
                                </div>
                                <textarea
                                    value={post.excerpt}
                                    onChange={(e) => handleUpdate(post.id, { excerpt: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    rows={2}
                                    placeholder="Özet"
                                />
                                <textarea
                                    value={post.content}
                                    onChange={(e) => handleUpdate(post.id, { content: e.target.value })}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm"
                                    rows={15}
                                    placeholder="İçerik"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => handleSaveEdit(post.id)} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">
                                        Kaydet
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm">
                                        İptal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white font-medium truncate">{post.title}</h3>
                                        {post.featured && (
                                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Öne Çıkan</span>
                                        )}
                                    </div>
                                    <p className="text-gray-400 text-sm truncate">{post.category} • {post.publishDate}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleFeatured(post.id)}
                                        className={`px-3 py-1 rounded-lg text-sm ${post.featured ? 'bg-amber-600 text-white' : 'bg-gray-600 text-white'}`}
                                    >
                                        ⭐
                                    </button>
                                    <button onClick={() => setEditingId(post.id)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                        Düzenle
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
                                        Sil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
