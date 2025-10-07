import React, { useState } from 'react';
import { Search, User, Phone, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Patients: React.FC = () => {
  const { patients } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.contactNumber.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pregnant':
        return <Badge className="bg-info text-info-foreground">{t('pregnant')}</Badge>;
      case 'delivered':
        return <Badge className="bg-success text-success-foreground">{t('delivered')}</Badge>;
      default:
        return <Badge variant="outline">{t('none')}</Badge>;
    }
  };

  return (
    <div className="space-y-6 md:ml-72">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('patients')}</h1>
        <p className="text-muted-foreground">Manage all patient records</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Patient Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'} found
        </p>
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <Card className="p-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No patients found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(`/patient/${patient.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                    <p className="text-sm text-muted-foreground">{patient.age} years old</p>
                  </div>
                </div>
                {patient.pregnancyStatus && getStatusBadge(patient.pregnancyStatus)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{patient.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{patient.village}, {patient.address}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="text-muted-foreground">ANC Visits: </span>
                  <span className="font-semibold text-foreground">
                    {patient.ancVisits.filter(v => v.status === 'completed').length}/
                    {patient.ancVisits.length}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Vaccinations: </span>
                  <span className="font-semibold text-foreground">
                    {patient.vaccinations.filter(v => v.status === 'completed').length}/
                    {patient.vaccinations.length}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;
