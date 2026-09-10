import { StakeholderGroup } from '../types';

export const mockStakeholders: StakeholderGroup[] = [
  {
    id: 'STK-01',
    entityName: 'Talegaon Farmers Welfare Sangharsh Samiti',
    type: 'Farmers Union',
    village: 'Talegaon Dabhade & Urse',
    district: 'Pune',
    projectId: 'PRJ-NH48',
    sentimentStatus: 'Adverse Opposition',
    totalObjections: 42,
    unresolvedComplaints: 18,
    escalationLevel: 'Level 2 - Sub-Divisional Magistrate',
    primaryIssue: 'Demand for 4x compensation factor under LARR Act 2013 and commercial plot reservation near interchange.',
    lastMeetingDate: '02-Sep-2026'
  },
  {
    id: 'STK-02',
    entityName: 'Koli Machhimar Vikas Sanstha (Vadhavan Coast)',
    type: 'Community Group',
    village: 'Vadhavan Coastal',
    district: 'Palghar',
    projectId: 'PRJ-PORT12',
    sentimentStatus: 'Adverse Opposition',
    totalObjections: 86,
    unresolvedComplaints: 41,
    escalationLevel: 'Level 3 - District Collector',
    primaryIssue: 'Apprehension over blockage of near-shore fishing grounds, boat mooring channel destruction, and lack of alternative harbour.',
    lastMeetingDate: '28-Aug-2026'
  },
  {
    id: 'STK-03',
    entityName: 'Boisar Tribal Forest Rights Vigilance Council',
    type: 'NGO',
    village: 'Boisar & Palghar Rural',
    district: 'Palghar',
    projectId: 'PRJ-DFC92',
    sentimentStatus: 'Conditional Agreement',
    totalObjections: 24,
    unresolvedComplaints: 9,
    escalationLevel: 'Level 2 - Sub-Divisional Magistrate',
    primaryIssue: 'Strict compliance with PESA Gram Sabha consent norms and community grazing land restitution.',
    lastMeetingDate: '05-Sep-2026'
  },
  {
    id: 'STK-04',
    entityName: 'Kisan Ekta Sangathan (Greater Noida)',
    type: 'Landowner Committee',
    village: 'Chhajarsi & Dadri',
    district: 'Gautam Buddha Nagar',
    projectId: 'PRJ-SC01',
    sentimentStatus: 'Adverse Opposition',
    totalObjections: 65,
    unresolvedComplaints: 32,
    escalationLevel: 'Level 3 - District Collector',
    primaryIssue: 'Claiming parity with Allahabad HC 64.7% compensation judgment and 10% developed abadi plots.',
    lastMeetingDate: '01-Sep-2026'
  },
  {
    id: 'STK-05',
    entityName: 'Gram Panchayat Somatane',
    type: 'Gram Panchayat',
    village: 'Somatane',
    district: 'Pune',
    projectId: 'PRJ-NH48',
    sentimentStatus: 'Cooperative',
    totalObjections: 8,
    unresolvedComplaints: 1,
    escalationLevel: 'Level 1 - Project Liaison',
    primaryIssue: 'Construction of pedestrian overhead footbridge for school students crossing highway.',
    lastMeetingDate: '06-Sep-2026'
  },
  {
    id: 'STK-06',
    entityName: 'Raybag Sugarcane Cultivators Guild',
    type: 'Farmers Union',
    village: 'Kudachi',
    district: 'Belagavi',
    projectId: 'PRJ-IRR77',
    sentimentStatus: 'Grievance Pending',
    totalObjections: 19,
    unresolvedComplaints: 7,
    escalationLevel: 'Level 1 - Project Liaison',
    primaryIssue: 'Standing crop loss compensation assessment cycle synchronization.',
    lastMeetingDate: '04-Sep-2026'
  }
];
