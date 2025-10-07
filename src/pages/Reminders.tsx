import React, { useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Filter } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reminder } from '@/types';

const Reminders: React.FC = () => {
  const { patients } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming'>('all');

  const getReminders = (): Reminder[] => {
    const reminders: Reminder[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    patients.forEach(patient => {
      // ANC visit reminders
      patient.ancVisits.forEach(visit => {
        if (visit.status === 'scheduled') {
          const visitDate = new Date(visit.scheduledDate);
          visitDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((visitDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          reminders.push({
            id: visit.id,
            patientId: patient.id,
            patientName: patient.name,
            type: 'anc',
            title: `ANC Visit ${visit.visitNumber}`,
            dueDate: visit.scheduledDate,
            status: daysDiff < 0 ? 'overdue' : daysDiff === 0 ? 'upcoming' : 'upcoming'
          });
        }
      });

      // Vaccination reminders
      patient.vaccinations.forEach(vac => {
        if (vac.status === 'scheduled') {
          const vacDate = new Date(vac.scheduledDate);
          vacDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((vacDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          reminders.push({
            id: vac.id,
            patientId: patient.id,
            patientName: patient.name,
            type: 'vaccination',
            title: vac.name,
            dueDate: vac.scheduledDate,
            status: daysDiff < 0 ? 'overdue' : daysDiff === 0 ? 'upcoming' : 'upcoming'
          });
        }
      });
    });

    return reminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const allReminders = getReminders();
  
  const filteredReminders = allReminders.filter(reminder => {
    if (filter === 'all') return true;
    return reminder.status === filter;
  });

  const overdueCount = allReminders.filter(r => r.status === 'overdue').length;
  const upcomingCount = allReminders.filter(r => r.status === 'upcoming').length;

  const getDaysUntil = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff < 0) return `${Math.abs(diff)} days overdue`;
    if (diff === 0) return t('dueToday');
    return `In ${diff} days`;
  };

  return (
    <div className="space-y-6 md:ml-72">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('reminders')}</h1>
        <p className="text-muted-foreground">Track upcoming and overdue visits</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold text-foreground">{allReminders.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-info" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('overdue')}</p>
              <p className="text-3xl font-bold text-accent">{overdueCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-accent" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('upcoming')}</p>
              <p className="text-3xl font-bold text-success">{upcomingCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({allReminders.length})
          </Button>
          <Button
            variant={filter === 'overdue' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('overdue')}
          >
            Overdue ({overdueCount})
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({upcomingCount})
          </Button>
        </div>
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No reminders found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredReminders.map((reminder) => (
            <Card
              key={reminder.id}
              className="p-5 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(`/patient/${reminder.patientId}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    reminder.status === 'overdue' ? 'bg-accent/10' : 'bg-info/10'
                  }`}>
                    {reminder.status === 'overdue' ? (
                      <AlertCircle className="w-6 h-6 text-accent" />
                    ) : (
                      <Calendar className="w-6 h-6 text-info" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{reminder.patientName}</p>
                    <p className="text-sm text-muted-foreground">{reminder.title}</p>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    className={
                      reminder.status === 'overdue'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-info text-info-foreground'
                    }
                  >
                    {getDaysUntil(reminder.dueDate)}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reminders;
