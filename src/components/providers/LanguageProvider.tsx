import { createContext, useContext, useState } from 'react';

type Language = 'en' | 'te';

interface LanguageProviderContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageProviderContext = createContext<LanguageProviderContextProps | undefined>(undefined);

// Basic translation dictionary
const translations = {
  en: {
    // Common
    'common.dashboard': 'Dashboard',
    'common.grievances': 'Grievances',
    'common.disputes': 'Disputes',
    'common.temples': 'Temple Letters',
    'common.cmrf': 'CM Relief',
    'common.education': 'Education',
    'common.csr': 'CSR/Tenders',
    'common.appointments': 'Appointments',
    'common.resources': 'Resource Pool',
    'common.programs': 'Programs',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.status': 'Status',
    'common.priority': 'Priority',
    'common.date': 'Date',
    'common.actions': 'Actions',
  },
  te: {
    // Common
    'common.dashboard': 'డాష్‌బోర్డ్',
    'common.grievances': 'ఫిర్యాదులు',
    'common.disputes': 'వివాదాలు',
    'common.temples': 'దేవాలయ లేఖలు',
    'common.cmrf': 'సిఎం రిలీఫ్',
    'common.education': 'విద్య',
    'common.csr': 'సిఎస్ఆర్/టెండర్లు',
    'common.appointments': 'అపాయింట్‌మెంట్లు',
    'common.resources': 'రిసోర్స్ పూల్',
    'common.programs': 'కార్యక్రమాలు',
    'common.submit': 'సమర్పించు',
    'common.cancel': 'రద్దు చేయి',
    'common.save': 'సేవ్ చేయి',
    'common.edit': 'సవరించు',
    'common.delete': 'తొలగించు',
    'common.search': 'వెతుకు',
    'common.filter': 'ఫిల్టర్',
    'common.status': 'స్థితి',
    'common.priority': 'ప్రాధాన్యత',
    'common.date': 'తేదీ',
    'common.actions': 'చర్యలు',
  },
};

interface LanguageProviderProps {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = 'en',
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem('ui-language') as Language) || defaultLanguage
  );

  const t = (key: string, fallback?: string): string => {
    const translation = translations[language][key as keyof typeof translations[typeof language]];
    return translation || fallback || key;
  };

  const value = {
    language,
    setLanguage: (newLanguage: Language) => {
      localStorage.setItem('ui-language', newLanguage);
      setLanguage(newLanguage);
    },
    toggleLanguage: () => {
      const newLanguage = language === 'en' ? 'te' : 'en';
      localStorage.setItem('ui-language', newLanguage);
      setLanguage(newLanguage);
    },
    t,
  };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};