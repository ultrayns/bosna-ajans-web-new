'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FormEvent, useState } from 'react';

interface ProjectStartModalProps {
    isOpen: boolean;
    onClose: () => void;
    locale?: string;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    projectType: string;
    description: string;
}

const projectTypes = [
    { value: 'product', labelTr: 'Ürün Çekimi', labelEn: 'Product Photography' },
    { value: 'fashion', labelTr: 'Moda Çekimi', labelEn: 'Fashion Photography' },
    { value: 'video', labelTr: 'Video Prodüksiyon', labelEn: 'Video Production' },
    { value: 'event', labelTr: 'Etkinlik Çekimi', labelEn: 'Event Photography' },
    { value: 'jewelry', labelTr: 'Takı Çekimi', labelEn: 'Jewelry Photography' },
    { value: 'food', labelTr: 'Yemek Çekimi', labelEn: 'Food Photography' },
    { value: 'other', labelTr: 'Diğer', labelEn: 'Other' },
];

export default function ProjectStartModal({
    isOpen,
    onClose,
    locale = 'tr',
}: ProjectStartModalProps) {
    const isEn = locale === 'en';
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = isEn ? 'Name is required' : 'İsim gereklidir';
        }

        if (!formData.email.trim()) {
            newErrors.email = isEn ? 'Email is required' : 'E-posta gereklidir';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = isEn ? 'Invalid email format' : 'Geçersiz e-posta formatı';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = isEn ? 'Phone is required' : 'Telefon gereklidir';
        }

        if (!formData.projectType) {
            newErrors.projectType = isEn ? 'Please select a project type' : 'Proje türü seçiniz';
        }

        if (!formData.description.trim()) {
            newErrors.description = isEn ? 'Description is required' : 'Açıklama gereklidir';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // Submit to Leads API
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    projectType: formData.projectType,
                    message: formData.description,
                    source: 'project-start-modal',
                }),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({ name: '', email: '', phone: '', projectType: '', description: '' });
                setTimeout(() => {
                    onClose();
                    setSubmitStatus('idle');
                }, 2000);
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', phone: '', projectType: '', description: '' });
        setErrors({});
        setSubmitStatus('idle');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-ink-950/90 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-ink-900 border border-paper-50/10 rounded-xl shadow-2xl z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-ink-900 border-b border-paper-50/10 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="font-display text-xl text-paper-50">
                                    {isEn ? 'Start Your Project' : 'Projenizi Başlatın'}
                                </h2>
                                <p className="text-paper-400 text-sm mt-1">
                                    {isEn ? 'Tell us about your vision' : 'Vizyonunuzu bizimle paylaşın'}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 flex items-center justify-center bg-paper-50/5 hover:bg-paper-50/10 rounded-full transition-colors"
                                aria-label={isEn ? 'Close' : 'Kapat'}
                            >
                                <svg className="w-5 h-5 text-paper-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-paper-300 mb-2">
                                    {isEn ? 'Full Name' : 'Ad Soyad'} *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`w-full px-4 py-3 bg-paper-50/5 border ${errors.name ? 'border-red-500' : 'border-paper-50/20'} rounded-lg text-paper-50 placeholder:text-paper-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all`}
                                    placeholder={isEn ? 'John Doe' : 'Ahmet Yılmaz'}
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-paper-300 mb-2">
                                    {isEn ? 'Email' : 'E-posta'} *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-4 py-3 bg-paper-50/5 border ${errors.email ? 'border-red-500' : 'border-paper-50/20'} rounded-lg text-paper-50 placeholder:text-paper-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all`}
                                    placeholder="email@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-paper-300 mb-2">
                                    {isEn ? 'Phone' : 'Telefon'} *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full px-4 py-3 bg-paper-50/5 border ${errors.phone ? 'border-red-500' : 'border-paper-50/20'} rounded-lg text-paper-50 placeholder:text-paper-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all`}
                                    placeholder="+90 532 123 4567"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                            </div>

                            {/* Project Type */}
                            <div>
                                <label htmlFor="projectType" className="block text-sm font-medium text-paper-300 mb-2">
                                    {isEn ? 'Project Type' : 'Proje Türü'} *
                                </label>
                                <select
                                    id="projectType"
                                    value={formData.projectType}
                                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                                    className={`w-full px-4 py-3 bg-paper-50/5 border ${errors.projectType ? 'border-red-500' : 'border-paper-50/20'} rounded-lg text-paper-50 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all appearance-none cursor-pointer`}
                                >
                                    <option value="" className="bg-ink-900">{isEn ? 'Select project type' : 'Proje türü seçin'}</option>
                                    {projectTypes.map((type) => (
                                        <option key={type.value} value={type.value} className="bg-ink-900">
                                            {isEn ? type.labelEn : type.labelTr}
                                        </option>
                                    ))}
                                </select>
                                {errors.projectType && <p className="mt-1 text-sm text-red-400">{errors.projectType}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-paper-300 mb-2">
                                    {isEn ? 'Project Description' : 'Proje Açıklaması'} *
                                </label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={4}
                                    className={`w-full px-4 py-3 bg-paper-50/5 border ${errors.description ? 'border-red-500' : 'border-paper-50/20'} rounded-lg text-paper-50 placeholder:text-paper-500 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all resize-none`}
                                    placeholder={isEn ? 'Tell us about your project...' : 'Projenizden bahsedin...'}
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-forest-500 hover:bg-forest-600 disabled:bg-forest-500/50 text-paper-50 font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {isEn ? 'Sending...' : 'Gönderiliyor...'}
                                    </>
                                ) : submitStatus === 'success' ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {isEn ? 'Sent Successfully!' : 'Başarıyla Gönderildi!'}
                                    </>
                                ) : (
                                    <>
                                        {isEn ? 'Submit Project Request' : 'Proje Talebini Gönder'}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            {/* Error message */}
                            {submitStatus === 'error' && (
                                <p className="text-center text-red-400 text-sm">
                                    {isEn ? 'Something went wrong. Please try again.' : 'Bir hata oluştu. Lütfen tekrar deneyin.'}
                                </p>
                            )}
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
