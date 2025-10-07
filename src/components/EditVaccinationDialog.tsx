import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Vaccination } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface EditVaccinationDialogProps {
  vaccination: Vaccination;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: Partial<Vaccination>) => void;
}

export const EditVaccinationDialog: React.FC<EditVaccinationDialogProps> = ({
  vaccination,
  open,
  onOpenChange,
  onSave,
}) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: vaccination.name,
      scheduledDate: vaccination.scheduledDate.split('T')[0],
      completedDate: vaccination.completedDate ? vaccination.completedDate.split('T')[0] : '',
      status: vaccination.status,
      dueForChild: vaccination.dueForChild || false,
    },
  });

  const status = watch('status');
  const dueForChild = watch('dueForChild');

  const onSubmit = (data: any) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('editVaccination')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('vaccinationName')}</Label>
            <Input id="name" {...register('name', { required: true })} />
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dueForChild"
              checked={dueForChild}
              onCheckedChange={(checked) => setValue('dueForChild', checked as boolean)}
            />
            <Label htmlFor="dueForChild" className="cursor-pointer">
              {t('dueForChild')}
            </Label>
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
