'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.send': 'Send Money',
    'nav.treasury': 'Treasury',
    'nav.forex': 'FOREX',
    'nav.wallet': 'Wallet',
    'nav.settings': 'Settings',
    'nav.api-docs': 'API Docs',
    'nav.help': 'Help',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.copy': 'Copy',
    'common.refresh': 'Refresh',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account preferences and security settings',
    'settings.account': 'Account',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.preferences': 'Preferences',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.currency': 'Default Currency',
    'settings.saved': 'Settings saved successfully!',
    
    // Wallet
    'wallet.title': 'Wallet Details',
    'wallet.subtitle': 'View your wallet information and transaction history',
    'wallet.balance': 'APT Balance',
    'wallet.address': 'Wallet Address',
    'wallet.transactions': 'Transaction History',
    'wallet.sent': 'Sent APT',
    'wallet.received': 'Received APT',
    'wallet.failed': 'Failed Transaction',
    
    // Payments
    'payment.title': 'Send Money Globally',
    'payment.recipient': 'Recipient Address',
    'payment.amount': 'Amount',
    'payment.send': 'Send Payment',
    'payment.success': 'Payment sent successfully!',
  },
  
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.send': 'Enviar Dinero',
    'nav.treasury': 'Tesorería',
    'nav.forex': 'FOREX',
    'nav.wallet': 'Billetera',
    'nav.settings': 'Configuración',
    'nav.api-docs': 'Docs API',
    'nav.help': 'Ayuda',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.loading': 'Cargando...',
    'common.success': 'Éxito',
    'common.error': 'Error',
    'common.copy': 'Copiar',
    'common.refresh': 'Actualizar',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Gestiona las preferencias de tu cuenta y configuración de seguridad',
    'settings.account': 'Cuenta',
    'settings.notifications': 'Notificaciones',
    'settings.security': 'Seguridad',
    'settings.preferences': 'Preferencias',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.currency': 'Moneda Predeterminada',
    'settings.saved': '¡Configuración guardada exitosamente!',
    
    // Wallet
    'wallet.title': 'Detalles de Billetera',
    'wallet.subtitle': 'Ver información de tu billetera e historial de transacciones',
    'wallet.balance': 'Saldo APT',
    'wallet.address': 'Dirección de Billetera',
    'wallet.transactions': 'Historial de Transacciones',
    'wallet.sent': 'APT Enviado',
    'wallet.received': 'APT Recibido',
    'wallet.failed': 'Transacción Fallida',
    
    // Payments
    'payment.title': 'Enviar Dinero Globalmente',
    'payment.recipient': 'Dirección del Destinatario',
    'payment.amount': 'Cantidad',
    'payment.send': 'Enviar Pago',
    'payment.success': '¡Pago enviado exitosamente!',
  },
  
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.send': 'Envoyer de l\'Argent',
    'nav.treasury': 'Trésorerie',
    'nav.forex': 'FOREX',
    'nav.wallet': 'Portefeuille',
    'nav.settings': 'Paramètres',
    'nav.api-docs': 'Docs API',
    'nav.help': 'Aide',
    
    // Common
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.loading': 'Chargement...',
    'common.success': 'Succès',
    'common.error': 'Erreur',
    'common.copy': 'Copier',
    'common.refresh': 'Actualiser',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Gérez vos préférences de compte et paramètres de sécurité',
    'settings.account': 'Compte',
    'settings.notifications': 'Notifications',
    'settings.security': 'Sécurité',
    'settings.preferences': 'Préférences',
    'settings.theme': 'Thème',
    'settings.language': 'Langue',
    'settings.currency': 'Devise par Défaut',
    'settings.saved': 'Paramètres sauvegardés avec succès!',
    
    // Wallet
    'wallet.title': 'Détails du Portefeuille',
    'wallet.subtitle': 'Voir les informations de votre portefeuille et l\'historique des transactions',
    'wallet.balance': 'Solde APT',
    'wallet.address': 'Adresse du Portefeuille',
    'wallet.transactions': 'Historique des Transactions',
    'wallet.sent': 'APT Envoyé',
    'wallet.received': 'APT Reçu',
    'wallet.failed': 'Transaction Échouée',
    
    // Payments
    'payment.title': 'Envoyer de l\'Argent Globalement',
    'payment.recipient': 'Adresse du Destinataire',
    'payment.amount': 'Montant',
    'payment.send': 'Envoyer le Paiement',
    'payment.success': 'Paiement envoyé avec succès!',
  },
  
  zh: {
    // Navigation
    'nav.dashboard': '仪表板',
    'nav.send': '发送资金',
    'nav.treasury': '财务',
    'nav.forex': '外汇',
    'nav.wallet': '钱包',
    'nav.settings': '设置',
    'nav.api-docs': 'API文档',
    'nav.help': '帮助',
    
    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.loading': '加载中...',
    'common.success': '成功',
    'common.error': '错误',
    'common.copy': '复制',
    'common.refresh': '刷新',
    
    // Settings
    'settings.title': '设置',
    'settings.subtitle': '管理您的账户偏好和安全设置',
    'settings.account': '账户',
    'settings.notifications': '通知',
    'settings.security': '安全',
    'settings.preferences': '偏好',
    'settings.theme': '主题',
    'settings.language': '语言',
    'settings.currency': '默认货币',
    'settings.saved': '设置保存成功！',
    
    // Wallet
    'wallet.title': '钱包详情',
    'wallet.subtitle': '查看您的钱包信息和交易历史',
    'wallet.balance': 'APT余额',
    'wallet.address': '钱包地址',
    'wallet.transactions': '交易历史',
    'wallet.sent': '已发送APT',
    'wallet.received': '已接收APT',
    'wallet.failed': '交易失败',
    
    // Payments
    'payment.title': '全球汇款',
    'payment.recipient': '收款人地址',
    'payment.amount': '金额',
    'payment.send': '发送付款',
    'payment.success': '付款发送成功！',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('flowpay_language');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('flowpay_language', lang);
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}