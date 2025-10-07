import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Bell, Plus, LogOut, Wifi, WifiOff, RefreshCw, Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, setUser, isOnline, isSyncing, lastSyncTime, syncData, language, setLanguage } = useApp();
  const { t } = useTranslation();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const formatLastSync = () => {
    if (!lastSyncTime) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard') },
    { path: '/patients', icon: Users, label: t('patients') },
    { path: '/reminders', icon: Bell, label: t('reminders') },
    { path: '/add-patient', icon: Plus, label: t('addPatient') },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
              M
            </div>
            <h1 className="text-xl font-bold text-foreground">{t('appName')}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <Select value={language} onValueChange={(val) => setLanguage(val as any)}>
              <SelectTrigger className="w-[100px] bg-background">
                <Globe className="w-4 h-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
              </SelectContent>
            </Select>

            {/* Sync Status */}
            <div className="flex items-center gap-2 text-sm">
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 text-syncing animate-spin" />
              ) : isOnline ? (
                <Wifi className="w-4 h-4 text-online" />
              ) : (
                <WifiOff className="w-4 h-4 text-offline" />
              )}
              <span className="hidden sm:inline text-muted-foreground">
                {isSyncing ? t('syncing') : isOnline ? t('online') : t('offline')}
              </span>
            </div>

            {/* Sync Button */}
            {isOnline && (
              <Button
                variant="outline"
                size="sm"
                onClick={syncData}
                disabled={isSyncing}
                className="hidden sm:flex"
              >
                <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
                {formatLastSync()}
              </Button>
            )}

            {/* User Info */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                {user?.name.charAt(0)}
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">{user?.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user?.role === 'asha' ? t('ashaWorker') : t('phcStaff')}
                </div>
              </div>
            </div>

            {/* Logout */}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">{t('logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="flex justify-around items-center px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[64px]",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed left-4 top-24 bottom-4 w-64 bg-card rounded-xl border border-border shadow-lg p-4">
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Sync Info */}
        <div className="mt-auto pt-4 border-t border-border mt-4">
          <div className="text-xs text-muted-foreground">
            {t('lastSynced')}: {formatLastSync()}
          </div>
          {isOnline && (
            <Button
              variant="outline"
              size="sm"
              onClick={syncData}
              disabled={isSyncing}
              className="w-full mt-2"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
              Sync Now
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
