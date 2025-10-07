import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ANCVisit } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface EditANCVisitDialogProps {
  visit: ANCVisit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<ANCVisit>) => void;
}

export const EditANCVisitDialog: React.FC<EditANCVisitDialogProps> = ({
  visit,
  open,
  onOpenChange,
  onSave,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      visitNumber: visit.visitNumber,
      scheduledDate: visit.scheduledDate.split('T')[0],
      completedDate: visit.completedDate ? visit.completedDate.split('T')[0] : '',
      status: visit.status,
      notes: visit.notes || '',
      bloodPressure: visit.bloodPressure || '',
      weight: visit.weight || '',
      hemoglobin: visit.hemoglobin || '',
    },
  });

  const status = watch('status');

  const onSubmit = (data: any) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editANCVisit')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitNumber">{t('visitNumber')}</Label>
              <Input id="visitNumber" type="number" {...register('visitNumber', { required: true, valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">{t('status')}</Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">{t('scheduled')}</SelectItem>
                  <SelectItem value="completed">{t('completed')}</SelectItem>
                  <SelectItem value="missed">{t('missed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">{t('scheduledDate')}</Label>
              <Input id="scheduledDate" type="date" {...register('scheduledDate', { required: true })} />
            </div>
            {status === 'completed' && (
              <div className="space-y-2">
                <Label htmlFor="completedDate">{t('completedDate')}</Label>
                <Input id="completedDate" type="date" {...register('completedDate')} />
              </div>
            )}
            {status === 'completed' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure">{t('bloodPressure')}</Label>
                  <Input id="bloodPressure" placeholder="120/80" {...register('bloodPressure')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">{t('weight')} (kg)</Label>
                  <Input id="weight" {...register('weight')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hemoglobin">{t('hemoglobin')} (g/dL)</Label>
                  <Input id="hemoglobin" {...register('hemoglobin')} />
                </div>
              </>
            )}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">{t('notes')}</Label>
              <Textarea id="notes" {...register('notes')} />
            </div>
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
