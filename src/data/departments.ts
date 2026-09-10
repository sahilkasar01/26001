import { CoordinationTask } from '../types';

export const mockCoordinationTasks: CoordinationTask[] = [
  {
    id: 'TASK-501',
    department: 'Revenue',
    taskTitle: 'Verify co-sharer heirship documents & bank mandates for P-1042',
    projectId: 'PRJ-NH48',
    parcelId: 'P-1042',
    assignedOfficer: 'Shri S. K. Deshmukh (SLAO Pune)',
    deadline: '16-Sep-2026',
    status: 'In Progress',
    priority: 'CRITICAL',
    notes: 'Escrow deposit authorization file prepared for Collector signature.'
  },
  {
    id: 'TASK-502',
    department: 'Legal',
    taskTitle: 'Draft urgent vacation of injunction plea before Civil Court Maval',
    projectId: 'PRJ-NH48',
    parcelId: 'P-1042',
    assignedOfficer: 'Adv. Meenakshi Sundaram (Chief Legal Counsel)',
    deadline: '14-Sep-2026',
    status: 'In Progress',
    priority: 'CRITICAL',
    notes: 'Briefing note sent to Special Counsel.'
  },
  {
    id: 'TASK-503',
    department: 'District Administration',
    taskTitle: 'Conduct Special Sub-Divisional Gram Sabha for FRA certification',
    projectId: 'PRJ-DFC92',
    parcelId: 'P-2011',
    assignedOfficer: 'Dr. Govind Bodke (Collector Palghar)',
    deadline: '20-Sep-2026',
    status: 'In Progress',
    priority: 'CRITICAL',
    notes: 'Notices issued to 14 occupant families.'
  },
  {
    id: 'TASK-504',
    department: 'PWD',
    taskTitle: 'Shift 220kV HT transmission line & utility poles at Ch. 65+400',
    projectId: 'PRJ-NH48',
    parcelId: 'P-1046',
    assignedOfficer: 'Er. Rajesh Kulkarni (EE PWD Pune)',
    deadline: '24-Sep-2026',
    status: 'Pending',
    priority: 'MEDIUM',
    notes: 'Joint survey completed with MSETCL.'
  },
  {
    id: 'TASK-505',
    department: 'R&R',
    taskTitle: 'Prepare specialized fisherfolk livelihood restoration charter',
    projectId: 'PRJ-PORT12',
    parcelId: 'P-6001',
    assignedOfficer: 'Smt. Ananya Rao (Director R&R)',
    deadline: '28-Sep-2026',
    status: 'In Progress',
    priority: 'HIGH',
    notes: 'Stakeholder consultation round 1 concluded.'
  },
  {
    id: 'TASK-506',
    department: 'Project Authority',
    taskTitle: 'Issue provisional residential plot entitlement bonds under Sec 23A',
    projectId: 'PRJ-SC01',
    parcelId: 'P-3022',
    assignedOfficer: 'Shri Alok Tandon (CEO GNIDA)',
    deadline: '18-Sep-2026',
    status: 'Pending',
    priority: 'HIGH',
    notes: 'Board resolution awaiting final stamp.'
  },
  {
    id: 'TASK-507',
    department: 'Railways',
    taskTitle: 'Engineering feasibility review for vehicular underpass at Saphale',
    projectId: 'PRJ-DFC92',
    parcelId: 'P-2013',
    assignedOfficer: 'Er. V. K. Gupta (Chief Project Manager DFCCIL)',
    deadline: '22-Sep-2026',
    status: 'Completed',
    priority: 'MEDIUM',
    notes: 'Feasibility approved; drawing integrated into tender pack.'
  }
];
