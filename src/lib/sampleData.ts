import { Patient } from '@/types';

export const samplePatients: Patient[] = [
  {
    id: '1',
    name: 'Anjali Das',
    age: 24,
    contactNumber: '9876543210',
    address: 'House No. 12, Near Temple',
    village: 'Madhupur',
    pregnancyStatus: 'pregnant',
    lmpDate: '2024-08-15',
    eddDate: '2025-05-22',
    ancVisits: [
      {
        id: 'anc1',
        visitNumber: 1,
        scheduledDate: '2024-09-15',
        completedDate: '2024-09-15',
        status: 'completed',
        bloodPressure: '110/70',
        weight: '52',
        hemoglobin: '11.2',
        notes: 'Normal checkup, prescribed iron supplements'
      },
      {
        id: 'anc2',
        visitNumber: 2,
        scheduledDate: '2024-10-20',
        completedDate: '2024-10-21',
        status: 'completed',
        bloodPressure: '115/72',
        weight: '54',
        hemoglobin: '11.5'
      },
      {
        id: 'anc3',
        visitNumber: 3,
        scheduledDate: '2024-12-15',
        status: 'scheduled'
      },
      {
        id: 'anc4',
        visitNumber: 4,
        scheduledDate: '2025-01-20',
        status: 'scheduled'
      }
    ],
    vaccinations: [
      {
        id: 'vac1',
        name: 'TT1',
        scheduledDate: '2024-09-15',
        completedDate: '2024-09-15',
        status: 'completed'
      },
      {
        id: 'vac2',
        name: 'TT2',
        scheduledDate: '2024-10-20',
        completedDate: '2024-10-21',
        status: 'completed'
      }
    ],
    createdAt: '2024-08-20',
    updatedAt: '2024-10-21'
  },
  {
    id: '2',
    name: 'Lakshmi Sharma',
    age: 28,
    contactNumber: '9123456789',
    address: 'Sharma Bhavan, Main Road',
    village: 'Rampur',
    pregnancyStatus: 'pregnant',
    lmpDate: '2024-09-10',
    eddDate: '2025-06-17',
    ancVisits: [
      {
        id: 'anc5',
        visitNumber: 1,
        scheduledDate: '2024-10-10',
        completedDate: '2024-10-10',
        status: 'completed',
        bloodPressure: '120/80',
        weight: '58',
        hemoglobin: '10.8'
      },
      {
        id: 'anc6',
        visitNumber: 2,
        scheduledDate: '2024-11-15',
        completedDate: '2024-11-16',
        status: 'completed',
        bloodPressure: '118/78',
        weight: '60',
        hemoglobin: '11.0'
      },
      {
        id: 'anc7',
        visitNumber: 3,
        scheduledDate: '2025-01-10',
        status: 'scheduled'
      }
    ],
    vaccinations: [
      {
        id: 'vac3',
        name: 'TT1',
        scheduledDate: '2024-10-10',
        completedDate: '2024-10-10',
        status: 'completed'
      },
      {
        id: 'vac4',
        name: 'TT2',
        scheduledDate: '2024-11-15',
        status: 'scheduled'
      }
    ],
    createdAt: '2024-09-15',
    updatedAt: '2024-11-16'
  },
  {
    id: '3',
    name: 'Priya Mondal',
    age: 22,
    contactNumber: '9988776655',
    address: 'Mondal Para, Lane 3',
    village: 'Sripur',
    pregnancyStatus: 'delivered',
    lmpDate: '2024-03-20',
    eddDate: '2024-12-26',
    childId: 'child1',
    ancVisits: [
      {
        id: 'anc8',
        visitNumber: 1,
        scheduledDate: '2024-04-20',
        completedDate: '2024-04-20',
        status: 'completed',
        bloodPressure: '115/75',
        weight: '50',
        hemoglobin: '11.8'
      },
      {
        id: 'anc9',
        visitNumber: 2,
        scheduledDate: '2024-05-25',
        completedDate: '2024-05-26',
        status: 'completed',
        bloodPressure: '118/76',
        weight: '52',
        hemoglobin: '11.5'
      },
      {
        id: 'anc10',
        visitNumber: 3,
        scheduledDate: '2024-07-20',
        completedDate: '2024-07-20',
        status: 'completed',
        bloodPressure: '120/78',
        weight: '55',
        hemoglobin: '11.2'
      },
      {
        id: 'anc11',
        visitNumber: 4,
        scheduledDate: '2024-09-15',
        completedDate: '2024-09-15',
        status: 'completed',
        bloodPressure: '122/80',
        weight: '58',
        hemoglobin: '11.0'
      }
    ],
    vaccinations: [
      {
        id: 'vac5',
        name: 'BCG',
        scheduledDate: '2024-12-27',
        completedDate: '2024-12-27',
        status: 'completed',
        dueForChild: true
      },
      {
        id: 'vac6',
        name: 'OPV 0',
        scheduledDate: '2024-12-27',
        completedDate: '2024-12-27',
        status: 'completed',
        dueForChild: true
      },
      {
        id: 'vac7',
        name: 'Hepatitis B1',
        scheduledDate: '2024-12-27',
        completedDate: '2024-12-27',
        status: 'completed',
        dueForChild: true
      },
      {
        id: 'vac8',
        name: 'OPV 1',
        scheduledDate: '2025-02-03',
        status: 'scheduled',
        dueForChild: true
      }
    ],
    createdAt: '2024-04-01',
    updatedAt: '2024-12-27'
  },
  {
    id: '4',
    name: 'Sunita Roy',
    age: 26,
    contactNumber: '9765432109',
    address: 'Roy House, Station Road',
    village: 'Madhupur',
    pregnancyStatus: 'pregnant',
    lmpDate: '2024-10-05',
    eddDate: '2025-07-12',
    ancVisits: [
      {
        id: 'anc12',
        visitNumber: 1,
        scheduledDate: '2024-11-05',
        status: 'missed'
      },
      {
        id: 'anc13',
        visitNumber: 2,
        scheduledDate: '2024-12-10',
        status: 'scheduled'
      }
    ],
    vaccinations: [
      {
        id: 'vac9',
        name: 'TT1',
        scheduledDate: '2024-11-05',
        status: 'missed'
      },
      {
        id: 'vac10',
        name: 'TT2',
        scheduledDate: '2024-12-10',
        status: 'scheduled'
      }
    ],
    createdAt: '2024-10-10',
    updatedAt: '2024-10-10'
  }
];
