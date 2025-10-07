import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Calendar, Activity, Syringe, CheckCircle, Clock, AlertCircle, Edit } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EditPatientDialog } from '@/components/EditPatientDialog';
import { EditANCVisitDialog } from '@/components/EditANCVisitDialog';
import { EditVaccinationDialog } from '@/components/EditVaccinationDialog';
import { ANCVisit, Vaccination } from '@/types';

const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, updatePatient } = useApp();
  const { t } = useTranslation();
  
  const [editPatientOpen, setEditPatientOpen] = useState(false);
  const [editVisitOpen, setEditVisitOpen] = useState(false);
  const [editVaccinationOpen, setEditVaccinationOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<ANCVisit | null>(null);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);

  const patient = patients.find(p => p.id === id);

  const handleEditVisit = (visit: ANCVisit) => {
    setSelectedVisit(visit);
    setEditVisitOpen(true);
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setEditVaccinationOpen(true);
  };

  const handleSaveVisit = (updates: Partial<ANCVisit>) => {
    if (patient && selectedVisit) {
      const updatedVisits = patient.ancVisits.map(v =>
        v.id === selectedVisit.id ? { ...v, ...updates } : v
      );
      updatePatient(patient.id, { ancVisits: updatedVisits });
    }
  };

  const handleSaveVaccination = (updates: Partial<Vaccination>) => {
    if (patient && selectedVaccination) {
      const updatedVaccinations = patient.vaccinations.map(v =>
        v.id === selectedVaccination.id ? { ...v, ...updates } : v
      );
      updatePatient(patient.id, { vaccinations: updatedVaccinations });
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Patient not found</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-info" />;
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-accent" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">{t('completed')}</Badge>;
      case 'scheduled':
        return <Badge className="bg-info text-info-foreground">{t('scheduled')}</Badge>;
      case 'missed':
        return <Badge className="bg-accent text-accent-foreground">{t('missed')}</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 md:ml-72">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/patients')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{patient.name}</h1>
          <p className="text-muted-foreground">{patient.village}</p>
        </div>
      </div>

      {/* Patient Info Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('age')}</p>
                <p className="font-semibold text-foreground">{patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('pregnancyStatus')}</p>
                <div className="mt-1">
                  {patient.pregnancyStatus === 'pregnant' && (
                    <Badge className="bg-info text-info-foreground">{t('pregnant')}</Badge>
                  )}
                  {patient.pregnancyStatus === 'delivered' && (
                    <Badge className="bg-success text-success-foreground">{t('delivered')}</Badge>
                  )}
                  {patient.pregnancyStatus === 'none' && (
                    <Badge variant="outline">{t('none')}</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="text-foreground">{patient.contactNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p className="text-foreground">{patient.address}</p>
              </div>
            </div>

            {patient.pregnancyStatus === 'pregnant' && patient.lmpDate && patient.eddDate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">{t('lmpDate')}</p>
                  <p className="font-medium text-foreground">
                    {new Date(patient.lmpDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('eddDate')}</p>
                  <p className="font-medium text-foreground">
                    {new Date(patient.eddDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
          </div>
          <Button variant="outline" size="icon" onClick={() => setEditPatientOpen(true)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* ANC Visits */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">{t('ancVisits')}</h2>
          </div>
        </div>

        {patient.ancVisits.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No ANC visits recorded</p>
        ) : (
          <div className="space-y-4">
            {patient.ancVisits.map((visit) => (
              <div
                key={visit.id}
                className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(visit.status)}
                    <div>
                      <p className="font-semibold text-foreground">
                        {t('visitNumber')} {visit.visitNumber}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(visit.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(visit.status)}
                    <Button variant="outline" size="icon" onClick={() => handleEditVisit(visit)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {visit.status === 'completed' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-border">
                    {visit.bloodPressure && (
                      <div>
                        <p className="text-xs text-muted-foreground">{t('bloodPressure')}</p>
                        <p className="text-sm font-medium text-foreground">{visit.bloodPressure}</p>
                      </div>
                    )}
                    {visit.weight && (
                      <div>
                        <p className="text-xs text-muted-foreground">{t('weight')}</p>
                        <p className="text-sm font-medium text-foreground">{visit.weight} kg</p>
                      </div>
                    )}
                    {visit.hemoglobin && (
                      <div>
                        <p className="text-xs text-muted-foreground">{t('hemoglobin')}</p>
                        <p className="text-sm font-medium text-foreground">{visit.hemoglobin} g/dL</p>
                      </div>
                    )}
                  </div>
                )}

                {visit.notes && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">{t('notes')}</p>
                    <p className="text-sm text-foreground">{visit.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Vaccinations */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-semibold text-foreground">{t('vaccinations')}</h2>
          </div>
        </div>

        {patient.vaccinations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No vaccinations recorded</p>
        ) : (
          <div className="space-y-3">
            {patient.vaccinations.map((vac) => (
              <div
                key={vac.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(vac.status)}
                  <div>
                    <p className="font-semibold text-foreground">{vac.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(vac.scheduledDate).toLocaleDateString()}
                      {vac.dueForChild && (
                        <span className="ml-2 text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded">
                          Child
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(vac.status)}
                  <Button variant="outline" size="icon" onClick={() => handleEditVaccination(vac)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Edit Dialogs */}
      {patient && (
        <>
          <EditPatientDialog
            patient={patient}
            open={editPatientOpen}
            onOpenChange={setEditPatientOpen}
            onSave={(updates) => updatePatient(patient.id, updates)}
          />
          {selectedVisit && (
            <EditANCVisitDialog
              visit={selectedVisit}
              open={editVisitOpen}
              onOpenChange={setEditVisitOpen}
              onSave={handleSaveVisit}
            />
          )}
          {selectedVaccination && (
            <EditVaccinationDialog
              vaccination={selectedVaccination}
              open={editVaccinationOpen}
              onOpenChange={setEditVaccinationOpen}
              onSave={handleSaveVaccination}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PatientDetail;
