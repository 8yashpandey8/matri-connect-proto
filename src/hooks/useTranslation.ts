import { useApp } from '@/contexts/AppContext';
import { translations, TranslationKey } from '@/lib/translations';

export const useTranslation = () => {
  const { language } = useApp();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t, language };
};
