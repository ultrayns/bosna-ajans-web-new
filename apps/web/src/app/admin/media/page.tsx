'use client';

import { useState } from 'react';

export default function MediaPage() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ url: string; fileName: string }>>([]);
    const [folder, setFolder] = useState('general');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setMessage(null);

        const newFiles: Array<{ url: string; fileName: string }> = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            try {
                const res = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await res.json();
                if (result.success) {
                    newFiles.push({ url: result.url, fileName: result.fileName });
                }
            } catch (error) {
                console.error('Upload error:', error);
            }
        }

        if (newFiles.length > 0) {
            setUploadedFiles([...uploadedFiles, ...newFiles]);
            setMessage({ type: 'success', text: `${newFiles.length} dosya başarıyla yüklendi!` });
        } else {
            setMessage({ type: 'error', text: 'Yükleme başarısız.' });
        }

        setUploading(false);
        e.target.value = '';
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setMessage({ type: 'success', text: 'URL kopyalandı!' });
        setTimeout(() => setMessage(null), 2000);
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Medya Yükleme</h1>
                    <p className="text-gray-400 mt-1">Görsel ve video dosyalarını yükleyin.</p>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Upload Area */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <label className="text-sm text-gray-300">Klasör:</label>
                    <select
                        value={folder}
                        onChange={(e) => setFolder(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                        <option value="general">Genel</option>
                        <option value="projects">Projeler</option>
                        <option value="team">Ekip</option>
                        <option value="logos">Logolar</option>
                    </select>
                </div>

                <label className="block border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {uploading ? (
                        <p className="text-emerald-400">Yükleniyor...</p>
                    ) : (
                        <>
                            <p className="text-white mb-1">Dosyaları buraya sürükleyin veya tıklayın</p>
                            <p className="text-gray-500 text-sm">JPG, PNG, GIF, WEBP, MP4, WEBM (Max 50MB)</p>
                        </>
                    )}
                </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Yüklenen Dosyalar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedFiles.map((file, i) => (
                            <div key={i} className="bg-gray-700/50 rounded-lg p-3">
                                <div className="aspect-video bg-gray-700 rounded overflow-hidden mb-2">
                                    {file.url.match(/\.(mp4|webm)$/i) ? (
                                        <video src={file.url} className="w-full h-full object-cover" controls />
                                    ) : (
                                        <img src={file.url} alt={file.fileName} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <p className="text-white text-sm truncate mb-2">{file.fileName}</p>
                                <button
                                    onClick={() => copyToClipboard(file.url)}
                                    className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    URL Kopyala
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Info */}
            <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <h3 className="text-white font-medium mb-2">Kullanım</h3>
                <p className="text-gray-400 text-sm">
                    Yüklenen dosyalar <code className="bg-gray-700 px-1 rounded">/media/uploads/{'{folder}'}/</code> klasörüne kaydedilir.
                    URL'yi kopyalayıp diğer sayfalarda kullanabilirsiniz.
                </p>
            </div>
        </div>
    );
}
