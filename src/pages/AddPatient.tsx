import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Save } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Patient } from '@/types';
import { toast } from 'sonner';

const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const { addPatient } = useApp();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contactNumber: '',
    address: '',
    village: '',
    pregnancyStatus: 'none' as 'pregnant' | 'delivered' | 'none',
    lmpDate: '',
    eddDate: ''
  });

  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      toast.info('Voice input activated (Simulated)');
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        toast.success('Voice input completed (Demo)');
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.contactNumber || !formData.village) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.pregnancyStatus === 'pregnant' && (!formData.lmpDate || !formData.eddDate)) {
      toast.error('Please provide LMP and EDD dates for pregnant patients');
      return;
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      contactNumber: formData.contactNumber,
      address: formData.address,
      village: formData.village,
      pregnancyStatus: formData.pregnancyStatus,
      lmpDate: formData.lmpDate || undefined,
      eddDate: formData.eddDate || undefined,
      ancVisits: [],
      vaccinations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addPatient(newPatient);
    navigate('/patients');
  };

  return (
    <div className="space-y-6 md:ml-72">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('addPatient')}</h1>
          <p className="text-muted-foreground">Register a new patient</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Voice Input Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant={isListening ? "default" : "outline"}
              size="sm"
              onClick={handleVoiceInput}
              className={isListening ? "animate-pulse" : ""}
            >
              <Mic className="w-4 h-4 mr-2" />
              {t('voiceInput')}
            </Button>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('patientName')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">{t('age')} *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">{t('contact')} *</Label>
                <Input
                  id="contact"
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="village">{t('village')} *</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="Enter village name"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">{t('address')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House number, landmark, etc."
                />
              </div>
            </div>
          </div>

          {/* Pregnancy Information */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground">Pregnancy Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pregnancyStatus">{t('pregnancyStatus')}</Label>
                <Select
                  value={formData.pregnancyStatus}
                  onValueChange={(value: any) => setFormData({ ...formData, pregnancyStatus: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">{t('none')}</SelectItem>
                    <SelectItem value="pregnant">{t('pregnant')}</SelectItem>
                    <SelectItem value="delivered">{t('delivered')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.pregnancyStatus === 'pregnant' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lmpDate">{t('lmpDate')} *</Label>
                  <Input
                    id="lmpDate"
                    type="date"
                    value={formData.lmpDate}
                    onChange={(e) => setFormData({ ...formData, lmpDate: e.target.value })}
                    required={formData.pregnancyStatus === 'pregnant'}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eddDate">{t('eddDate')} *</Label>
                  <Input
                    id="eddDate"
                    type="date"
                    value={formData.eddDate}
                    onChange={(e) => setFormData({ ...formData, eddDate: e.target.value })}
                    required={formData.pregnancyStatus === 'pregnant'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              {t('cancel')}
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {t('save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddPatient;
