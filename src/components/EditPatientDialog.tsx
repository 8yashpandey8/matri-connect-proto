import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Patient } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface EditPatientDialogProps {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Patient>) => void;
}

export const EditPatientDialog: React.FC<EditPatientDialogProps> = ({
  patient,
  open,
  onOpenChange,
  onSave,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: patient.name,
      age: patient.age,
      contactNumber: patient.contactNumber,
      address: patient.address,
      village: patient.village,
      pregnancyStatus: patient.pregnancyStatus || 'none',
      lmpDate: patient.lmpDate || '',
      eddDate: patient.eddDate || '',
    },
  });

  const pregnancyStatus = watch('pregnancyStatus');

  const onSubmit = (data: any) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editPatient')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('patientName')}</Label>
              <Input id="name" {...register('name', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">{t('age')}</Label>
              <Input id="age" type="number" {...register('age', { required: true, valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">{t('contactNumber')}</Label>
              <Input id="contactNumber" {...register('contactNumber', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="village">{t('village')}</Label>
              <Input id="village" {...register('village', { required: true })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">{t('address')}</Label>
              <Input id="address" {...register('address', { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pregnancyStatus">{t('pregnancyStatus')}</Label>
              <Select
                value={pregnancyStatus}
                onValueChange={(value) => setValue('pregnancyStatus', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('none')}</SelectItem>
                  <SelectItem value="pregnant">{t('pregnant')}</SelectItem>
                  <SelectItem value="delivered">{t('delivered')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {pregnancyStatus === 'pregnant' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lmpDate">{t('lmpDate')}</Label>
                  <Input id="lmpDate" type="date" {...register('lmpDate')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eddDate">{t('eddDate')}</Label>
                  <Input id="eddDate" type="date" {...register('eddDate')} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">{t('save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
