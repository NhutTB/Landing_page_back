import React from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    // 🔁 Hàm đổi ngôn ngữ
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('lang', newLang);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <button
                onClick={toggleLanguage}
                className="bg-gray-900/60 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition backdrop-blur-sm"
            >
                {i18n.language === 'en' ? '🇻🇳 Tiếng Việt' : '🇺🇸 English'}
            </button>
        </div>
    );
}