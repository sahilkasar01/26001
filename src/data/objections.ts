import { ObjectionScenario } from '../types';

export const mockObjectionScenarios: ObjectionScenario[] = [
  {
    id: 'OBJ-001',
    objectionType: 'Compensation Dispute (Circle Rate / Market Valuation)',
    parcelId: 'P-1042',
    village: 'Talegaon Dabhade',
    projectId: 'PRJ-NH48',
    directParcelDelayRisk: 18,
    nearbyParcelsAffected: 7,
    potentialProjectDelayDays: 11,
    description: 'Landowner and co-sharers challenge the compensation quantum, demanding peri-urban commercial rate multiplier. Contiguity blockage halts right-of-way handover for 2.4 kilometers.',
    affectedParcelIds: ['P-1042', 'P-1043', 'P-1044', 'P-1045', 'P-1046', 'P-1047', 'P-1048']
  },
  {
    id: 'OBJ-002',
    objectionType: 'Title & Coparcenary Inheritance Challenge',
    parcelId: 'P-1042',
    village: 'Talegaon Dabhade',
    projectId: 'PRJ-NH48',
    directParcelDelayRisk: 24,
    nearbyParcelsAffected: 4,
    potentialProjectDelayDays: 19,
    description: 'Coparceners obtained temporary civil injunction. If unaddressed, court proceedings typically exceed 90+ days without an administrative Section 77 escrow deposit intervention.',
    affectedParcelIds: ['P-1042', 'P-1043', 'P-1044', 'P-1045']
  },
  {
    id: 'OBJ-003',
    objectionType: 'Statutory Forest & FRA Community Clearance',
    parcelId: 'P-2011',
    village: 'Boisar',
    projectId: 'PRJ-DFC92',
    directParcelDelayRisk: 22,
    nearbyParcelsAffected: 9,
    potentialProjectDelayDays: 24,
    description: 'Gram Sabha resolution deferred due to quorum shortfall under Forest Rights Act. Delay arrests bridge abutment earthworks on DFCCIL Package 3B.',
    affectedParcelIds: ['P-2011', 'P-2012', 'P-2013']
  },
  {
    id: 'OBJ-004',
    objectionType: 'High Court Writ on Urgency Notification Clause',
    parcelId: 'P-3021',
    village: 'Chhajarsi',
    projectId: 'PRJ-SC01',
    directParcelDelayRisk: 26,
    nearbyParcelsAffected: 6,
    potentialProjectDelayDays: 32,
    description: 'Stay order granted by Division Bench on Section 4 notice invocation. Freezes development on 1.8km arterial ring road segment.',
    affectedParcelIds: ['P-3021', 'P-3022']
  },
  {
    id: 'OBJ-005',
    objectionType: 'Livelihood Loss & Coastal Access Injunction (NGT)',
    parcelId: 'P-6001',
    village: 'Vadhavan Coastal',
    projectId: 'PRJ-PORT12',
    directParcelDelayRisk: 28,
    nearbyParcelsAffected: 12,
    potentialProjectDelayDays: 45,
    description: 'Environmental tribunal stay on land reclamation until alternative artisanal landing facilities and biodiversity safeguards are legally registered.',
    affectedParcelIds: ['P-6001', 'P-6002', 'P-6003']
  }
];
