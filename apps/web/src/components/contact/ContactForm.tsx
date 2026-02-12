'use client';

import { motion } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

interface FormData {
    name: string;
    email: string;
    company: string;
    phone: string;
    service: string;
    budget: string;
    message: string;
    honeypot: string; // Spam protection
}

interface ContactFormProps {
    locale?: string;
}

// Allowed file types and max size
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ContactForm({ locale = 'tr' }: ContactFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        budget: '',
        message: '',
        honeypot: '',
    });

    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const services = [
        { value: '', label: locale === 'tr' ? 'Hizmet Seçin' : 'Select a Service' },
        { value: 'film-production', label: 'Film Production' },
        { value: 'fashion-photography', label: 'Fashion Photography' },
        { value: 'post-production', label: 'Post Production' },
        { value: 'creative-direction', label: 'Creative Direction' },
        { value: 'other', label: locale === 'tr' ? 'Diğer' : 'Other' },
    ];

    const budgets = [
        { value: '', label: locale === 'tr' ? 'Bütçe Aralığı' : 'Budget Range' },
        { value: '10-25k', label: '₺10,000 - ₺25,000' },
        { value: '25-50k', label: '₺25,000 - ₺50,000' },
        { value: '50-100k', label: '₺50,000 - ₺100,000' },
        { value: '100k+', label: '₺100,000+' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateFile = useCallback((file: File): string | null => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return locale === 'tr'
                ? 'Sadece PDF, Word ve resim dosyaları kabul edilir.'
                : 'Only PDF, Word and image files are accepted.';
        }
        if (file.size > MAX_FILE_SIZE) {
            return locale === 'tr'
                ? 'Dosya boyutu 10MB\'dan küçük olmalıdır.'
                : 'File size must be less than 10MB.';
        }
        return null;
    }, [locale]);

    const handleFileChange = useCallback((selectedFile: File | null) => {
        setFileError(null);
        if (selectedFile) {
            const error = validateFile(selectedFile);
            if (error) {
                setFileError(error);
                setFile(null);
            } else {
                setFile(selectedFile);
            }
        } else {
            setFile(null);
        }
    }, [validateFile]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    }, [handleFileChange]);

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        handleFileChange(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        setFileError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Honeypot check - if filled, it's a bot
        if (formData.honeypot) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'honeypot') {
                    submitData.append(key, value);
                }
            });
            if (file) {
                submitData.append('file', file);
            }

            const response = await fetch('/api/lead', {
                method: 'POST',
                body: submitData,
            });

            if (!response.ok) {
                throw new Error('Submission failed');
            }

            setIsSubmitted(true);
        } catch (err) {
            setError(locale === 'tr'
                ? 'Bir hata oluştu. Lütfen tekrar deneyin.'
                : 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <div className="w-16 h-16 bg-forest-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-paper-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="font-display text-2xl text-ink-900 dark:text-paper-50 mb-4">
                    {locale === 'tr' ? 'Mesajınız Alındı!' : 'Message Received!'}
                </h3>
                <p className="text-ink-600 dark:text-paper-300">
                    {locale === 'tr'
                        ? 'En kısa sürede sizinle iletişime geçeceğiz.'
                        : "We'll get back to you as soon as possible."}
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot - hidden from users */}
            <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                        {locale === 'tr' ? 'Ad Soyad' : 'Full Name'} *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-ink-200 dark:border-paper-50/20 bg-paper-50 dark:bg-ink-800 text-ink-900 dark:text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                        E-posta *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-ink-200 dark:border-paper-50/20 bg-paper-50 dark:bg-ink-800 text-ink-900 dark:text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                </div>

                {/* Company */}
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                        {locale === 'tr' ? 'Şirket' : 'Company'}
                    </label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-ink-200 dark:border-paper-50/20 bg-paper-50 dark:bg-ink-800 text-ink-900 dark:text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                        {locale === 'tr' ? 'Telefon' : 'Phone'}
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-ink-200 dark:border-paper-50/20 bg-paper-50 dark:bg-ink-800 text-ink-900 dark:text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                </div>

                {/* Service */}
                <div>
                    <label htmlFor="service" className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                        {locale === 'tr' ? 'İlgilendiğiniz Hizmet' : 'Service Interested In'}
                    </label>
                    <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-ink-200 dark:border-paper-50/20 bg-paper-50 dark:bg-ink-800 text-ink-900 dark:text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    >
                        {services.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Budget */}
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                        {locale === 'tr' ? 'Bütçe' : 'Budget'}
                    </label>
                    <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-ink-200 dark:border-paper-50/20 bg-paper-50 dark:bg-ink-800 text-ink-900 dark:text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    >
                        {budgets.map((b) => (
                            <option key={b.value} value={b.value}>{b.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                    {locale === 'tr' ? 'Proje Detayları' : 'Project Details'} *
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={locale === 'tr' ? 'Projeniz hakkında bize bilgi verin...' : 'Tell us about your project...'}
                    className="w-full px-4 py-3 border border-ink-200 dark:border-paper-50/20 bg-paper-50 dark:bg-ink-800 text-ink-900 dark:text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
                />
            </div>

            {/* File Upload - Drag & Drop */}
            <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-paper-300 mb-2">
                    {locale === 'tr' ? 'Brief / Dosya Ekle' : 'Attach Brief / File'}
                </label>
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging
                            ? 'border-forest-500 bg-forest-500/10'
                            : 'border-ink-200 dark:border-paper-50/20 hover:border-forest-500 dark:hover:border-forest-400'
                        } ${file ? 'bg-forest-500/5' : ''}`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    {file ? (
                        <div className="flex items-center justify-center gap-3">
                            <svg className="w-6 h-6 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-ink-700 dark:text-paper-300">{file.name}</span>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                                className="ml-2 p-1 text-oxide-500 hover:text-oxide-700 dark:hover:text-oxide-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <svg className="w-10 h-10 mx-auto text-ink-400 dark:text-paper-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-ink-600 dark:text-paper-400">
                                {locale === 'tr'
                                    ? 'Dosyayı sürükleyin veya tıklayarak seçin'
                                    : 'Drag & drop a file or click to browse'}
                            </p>
                            <p className="text-xs text-ink-400 dark:text-paper-500">
                                PDF, Word, JPG, PNG (max 10MB)
                            </p>
                        </div>
                    )}
                </div>

                {fileError && (
                    <p className="mt-2 text-sm text-oxide-500">{fileError}</p>
                )}
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 bg-oxide-100 dark:bg-oxide-900/30 text-oxide-700 dark:text-oxide-300 rounded">
                    {error}
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-4 bg-ink-900 dark:bg-paper-50 text-paper-50 dark:text-ink-900 font-medium hover:bg-ink-800 dark:hover:bg-paper-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting
                    ? (locale === 'tr' ? 'Gönderiliyor...' : 'Sending...')
                    : (locale === 'tr' ? 'Mesaj Gönder' : 'Send Message')}
            </button>
        </form>
    );
}
