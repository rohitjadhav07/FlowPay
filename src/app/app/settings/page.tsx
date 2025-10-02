'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Key,
  Smartphone,
  Save,
  Moon,
  Sun,
  Monitor,
  Copy,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { useWallet } from '@/components/providers/Providers';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Select, Option } from '@/components/ui/Select';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { account } = useWallet();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('fp_test_1234567890abcdef');
  const [webhookUrl, setWebhookUrl] = useState('');
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      payments: true,
      forex: true,
      treasury: true,
    },
    security: {
      twoFactor: false,
      biometric: true,
      sessionTimeout: '30',
    },
    preferences: {
      currency: 'USD',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'US',
    },
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('flowpay_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    const savedWebhook = localStorage.getItem('flowpay_webhook_url');
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
  }, []);



  // Languages with native names
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'APT', name: 'Aptos', symbol: 'APT' },
    { code: 'BTC', name: 'Bitcoin', symbol: '₿' },
    { code: 'ETH', name: 'Ethereum', symbol: 'Ξ' },
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC - Coordinated Universal Time' },
    { value: 'EST', label: 'EST - Eastern Standard Time' },
    { value: 'PST', label: 'PST - Pacific Standard Time' },
    { value: 'GMT', label: 'GMT - Greenwich Mean Time' },
    { value: 'CET', label: 'CET - Central European Time' },
    { value: 'JST', label: 'JST - Japan Standard Time' },
    { value: 'CST', label: 'CST - China Standard Time' },
    { value: 'IST', label: 'IST - India Standard Time' },
  ];

  const handleSave = () => {
    try {
      // Save settings to localStorage
      localStorage.setItem('flowpay_settings', JSON.stringify(settings));
      localStorage.setItem('flowpay_webhook_url', webhookUrl);
      
      toast.success(t('settings.saved'));
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast.success('Language updated successfully!');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard!');
  };

  const generateNewApiKey = () => {
    const newKey = 'fp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success('New API key generated!');
  };

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case 'light': return <Sun className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      case 'auto': return <Monitor className="w-4 h-4" />;
      default: return <Sun className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings.title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('settings.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.account')}</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wallet Address
              </label>
              <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                {account?.address || 'Not connected'}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Network
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                Aptos Testnet
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm">
                Standard Account
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.notifications')}</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <button
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      [key]: !value
                    }
                  }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.security')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Two-Factor Authentication
              </label>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  security: {
                    ...prev.security,
                    twoFactor: !prev.security.twoFactor
                  }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security.twoFactor ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Biometric Login
              </label>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  security: {
                    ...prev.security,
                    biometric: !prev.security.biometric
                  }
                }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.security.biometric ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.security.biometric ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <Select
                value={settings.security.sessionTimeout}
                onChange={(value) => setSettings(prev => ({
                  ...prev,
                  security: {
                    ...prev.security,
                    sessionTimeout: value
                  }
                }))}
              >
                <Option value="15">15 minutes</Option>
                <Option value="30">30 minutes</Option>
                <Option value="60">1 hour</Option>
                <Option value="120">2 hours</Option>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card lg:col-span-2"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('settings.preferences')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('settings.theme')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['light', 'dark', 'auto'].map((themeOption) => (
                  <button
                    key={themeOption}
                    onClick={() => setTheme(themeOption as any)}
                    className={`flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                      theme === themeOption
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {getThemeIcon(themeOption)}
                    <span className="text-sm font-medium capitalize">{themeOption}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('settings.language')}
              </label>
              <Select
                value={language}
                onChange={handleLanguageChange}
              >
                {languages.map((lang) => (
                  <Option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('settings.currency')}
              </label>
              <Select
                value={settings.preferences.currency}
                onChange={(value) => setSettings(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    currency: value
                  }
                }))}
              >
                {currencies.map((currency) => (
                  <Option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <Select
                value={settings.preferences.timezone}
                onChange={(value) => setSettings(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    timezone: value
                  }
                }))}
              >
                {timezones.map((tz) => (
                  <Option key={tz.value} value={tz.value}>
                    {tz.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Format
              </label>
              <Select
                value={settings.preferences.dateFormat}
                onChange={(value) => setSettings(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    dateFormat: value
                  }
                }))}
              >
                <Option value="MM/DD/YYYY">MM/DD/YYYY (US)</Option>
                <Option value="DD/MM/YYYY">DD/MM/YYYY (EU)</Option>
                <Option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</Option>
                <Option value="DD.MM.YYYY">DD.MM.YYYY (DE)</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number Format
              </label>
              <Select
                value={settings.preferences.numberFormat}
                onChange={(value) => setSettings(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    numberFormat: value
                  }
                }))}
              >
                <Option value="US">1,234.56 (US)</Option>
                <Option value="EU">1.234,56 (EU)</Option>
                <Option value="IN">1,23,456.78 (IN)</Option>
                <Option value="CH">1'234.56 (CH)</Option>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* API & Developer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">API Access</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="flex space-x-2">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  title={showApiKey ? "Hide API key" : "Show API key"}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={copyApiKey}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-1"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use this key to authenticate API requests to FlowPay services
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-app.com/webhook"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Receive real-time notifications about payments and transactions
              </p>
            </div>
            
            <button
              onClick={generateNewApiKey}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Generate New API Key</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{t('common.save')}</span>
        </button>
      </motion.div>
    </div>
  );
}