import React from 'react';
import { Users, Baby, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Reminder } from '@/types';

const Dashboard: React.FC = () => {
  const { patients } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Calculate statistics
  const totalPatients = patients.length;
  const pregnantWomen = patients.filter(p => p.pregnancyStatus === 'pregnant').length;
  
  const upcomingVisits = patients.reduce((acc, patient) => {
    const upcoming = patient.ancVisits.filter(visit => visit.status === 'scheduled').length;
    return acc + upcoming;
  }, 0);

  const overdueVisits = patients.reduce((acc, patient) => {
    const overdue = patient.ancVisits.filter(visit => {
      if (visit.status === 'scheduled') {
        const scheduledDate = new Date(visit.scheduledDate);
        return scheduledDate < new Date();
      }
      return false;
    }).length;
    return acc + overdue;
  }, 0);

  const childrenVaccinated = patients.filter(p => 
    p.vaccinations.some(v => v.dueForChild && v.status === 'completed')
  ).length;

  // Get recent reminders
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
          
          if (daysDiff <= 7) {
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
        }
      });

      // Vaccination reminders
      patient.vaccinations.forEach(vac => {
        if (vac.status === 'scheduled') {
          const vacDate = new Date(vac.scheduledDate);
          vacDate.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((vacDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 7) {
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
        }
      });
    });

    return reminders.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const recentReminders = getReminders().slice(0, 5);

  const stats = [
    {
      label: t('totalPatients'),
      value: totalPatients,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: t('pregnantWomen'),
      value: pregnantWomen,
      icon: Baby,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: t('upcomingVisits'),
      value: upcomingVisits,
      icon: Calendar,
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      label: t('overdueVisits'),
      value: overdueVisits,
      icon: AlertCircle,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: t('childrenVaccinated'),
      value: childrenVaccinated,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="space-y-6 md:ml-72">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('dashboard')}</h1>
        <p className="text-muted-foreground">Overview of maternal and child health data</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Reminders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">{t('reminders')}</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/reminders')}>
            {t('viewAll')}
          </Button>
        </div>

        {recentReminders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No upcoming reminders</p>
        ) : (
          <div className="space-y-3">
            {recentReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    reminder.status === 'overdue' ? 'bg-accent' : 'bg-info'
                  }`} />
                  <div>
                    <p className="font-medium text-foreground">{reminder.patientName}</p>
                    <p className="text-sm text-muted-foreground">{reminder.title}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    reminder.status === 'overdue' ? 'text-accent' : 'text-info'
                  }`}>
                    {reminder.status === 'overdue' ? t('overdue') : t('upcoming')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(reminder.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/add-patient')}>
          <h3 className="text-lg font-semibold text-foreground mb-2">{t('addPatient')}</h3>
          <p className="text-sm text-muted-foreground">Register a new patient in the system</p>
        </Card>
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/patients')}>
          <h3 className="text-lg font-semibold text-foreground mb-2">{t('patients')}</h3>
          <p className="text-sm text-muted-foreground">View and manage all patient records</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
