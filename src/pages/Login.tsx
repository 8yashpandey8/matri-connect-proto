import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Stethoscope, Briefcase } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UserRole } from '@/types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = () => {
    if (name.trim() && selectedRole) {
      setUser({
        id: Date.now().toString(),
        name: name.trim(),
        role: selectedRole
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground mx-auto mb-4">
            <Stethoscope className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t('appName')}</h1>
          <p className="text-muted-foreground">Maternal & Child Health Tracking</p>
        </div>

        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Your Name</label>
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">{t('selectRole')}</label>
          
          <button
            onClick={() => setSelectedRole('asha')}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              selectedRole === 'asha'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedRole === 'asha' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <UserCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">{t('ashaWorker')}</div>
                <div className="text-sm text-muted-foreground">Community Health Worker</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedRole('phc')}
            className={`w-full p-4 rounded-xl border-2 transition-all ${
              selectedRole === 'phc'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedRole === 'phc' ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">{t('phcStaff')}</div>
                <div className="text-sm text-muted-foreground">Primary Health Centre Staff</div>
              </div>
            </div>
          </button>
        </div>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!name.trim() || !selectedRole}
          size="lg"
          className="w-full"
        >
          {t('login')}
        </Button>

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground">
          This is a prototype for demonstration purposes
        </p>
      </Card>
    </div>
  );
};

export default Login;
