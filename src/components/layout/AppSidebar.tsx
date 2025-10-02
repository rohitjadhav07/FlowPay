'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Send,
  Building2,
  TrendingUp,
  Wallet,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
  Code,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '@/contexts/LanguageContext';

const getNavigation = (t: (key: string) => string) => [
  { name: t('nav.dashboard'), href: '/app', icon: Home },
  { name: t('nav.send'), href: '/app/send', icon: Send },
  { name: t('nav.treasury'), href: '/app/treasury', icon: Building2 },
  { name: t('nav.forex'), href: '/app/forex', icon: TrendingUp },
  { name: t('nav.wallet'), href: '/app/wallet', icon: Wallet },
  { name: t('nav.settings'), href: '/app/settings', icon: Settings },
  { name: t('nav.api-docs'), href: '/app/api-docs', icon: Code },
  { name: t('nav.help'), href: '/app/help', icon: HelpCircle },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  
  const navigation = getNavigation(t);

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">FlowPay</span>
          </motion.div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'nav-link',
                isActive ? 'nav-link-active' : 'nav-link-inactive',
                collapsed ? 'justify-center' : 'justify-start'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="ml-3"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-gray-500 dark:text-gray-400 text-center"
          >
            Built on Aptos
            <br />
            v1.0.0
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}