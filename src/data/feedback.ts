import { FeedbackItem, FeedbackSummaryStats, FeedbackRating } from '../types/feedback';

export const INITIAL_FEEDBACK_DATA: FeedbackItem[] = [
  {
    id: 'FB-1001',
    authorName: 'Rameshwar B. Patil',
    authorRole: 'Landowner',
    authorEmail: 'ramesh.patil@talegaon.org',
    category: 'Valuation & Compensation',
    rating: 2,
    title: 'Circle rate multiplier in Urse village undervalued compared to market transactions',
    comment: 'The circle rate applied for Survey 104/2B is based on 2021 agricultural registry, whereas neighboring industrial plots traded at 2.4x last year. We request the SLAO valuation board to adopt recent registered sales deeds for the 100% solatium calculation.',
    projectId: 'PRJ-NH48',
    projectName: 'NH-48 6-Lane Expansion',
    parcelId: 'P-1042',
    surveyNumber: '104/2B',
    createdAt: '2026-09-08',
    upvotes: 14,
    status: 'Action Planned',
    adminResponse: 'Valuation board meeting scheduled for Sept 15 with District Collectorate to verify 2025-26 transaction indices.',
    sentiment: 'Critical',
    tags: ['Urse Village', 'Solatium', 'Circle Rate']
  },
  {
    id: 'FB-1002',
    authorName: 'Sunita D. Deshmukh',
    authorRole: 'Landowner',
    authorEmail: 'deshmukh.sunita@gmail.com',
    category: 'Valuation & Compensation',
    rating: 4,
    title: 'Direct DBT bank transfer of undisputed solatium completed smoothly',
    comment: 'The 80% advance compensation arrived directly in our Punjab National Bank account within 4 working days of submitting the affidavit. Appreciate the transparent SMS alerts on fund movement.',
    projectId: 'PRJ-NH48',
    projectName: 'NH-48 6-Lane Expansion',
    parcelId: 'P-1044',
    surveyNumber: '106/1A',
    createdAt: '2026-09-06',
    upvotes: 9,
    status: 'Resolved',
    adminResponse: 'Confirmed by District Treasury Office. Final 20% release pending possession certificate.',
    sentiment: 'Positive',
    tags: ['DBT', 'Compensation', 'Quick Disbursal']
  },
  {
    id: 'FB-1003',
    authorName: 'Er. Rajesh K. Singhal',
    authorRole: 'Project Authority',
    authorEmail: 'director.nh48@nexora.io',
    category: 'Platform & Risk Model Usability',
    rating: 5,
    title: 'SHAP Explainability feature helped prioritize right-of-way bottlenecks in Package 3',
    comment: 'The delay risk decomposition highlighted that legal coparcenary shares were delaying Package 3 by 95 days, not physical resistance. We redeployed our liaison officers specifically to resolve family mutation records, cutting estimated slippage by half.',
    projectId: 'PRJ-NH48',
    projectName: 'NH-48 6-Lane Expansion',
    createdAt: '2026-09-05',
    upvotes: 22,
    status: 'Acknowledged',
    adminResponse: 'Glad to hear. Additional SHAP micro-breakdowns are being rolled out for environmental clearances.',
    sentiment: 'Positive',
    tags: ['SHAP AI', 'Decision Support', 'Package 3']
  },
  {
    id: 'FB-1004',
    authorName: 'Dhananjay More (Tahasildar / Revenue)',
    authorRole: 'Field Revenue Officer',
    authorEmail: 'tahasil.maval@maharashtra.gov.in',
    category: 'Ground Survey Accuracy',
    rating: 3,
    title: 'ETS Electronic Survey pinpointed 1.2m discrepancy with historical Cadastral Map',
    comment: 'When cross-verifying Survey 105/3 with modern DGPS coordinates, the railway siding boundary overlap was corrected amicably before award inquiry. Suggest standardizing DGPS raw RINEX uploads into the Nexora GIS map.',
    projectId: 'PRJ-DFC92',
    projectName: 'Western Dedicated Freight Corridor',
    parcelId: 'P-2089',
    surveyNumber: '208/4',
    createdAt: '2026-09-03',
    upvotes: 11,
    status: 'Action Planned',
    adminResponse: 'Direct DGPS / RINEX coordinate parser scheduled for Platform Release 2.4.',
    sentiment: 'Neutral',
    tags: ['DGPS', 'ETS Survey', 'Cadastral']
  },
  {
    id: 'FB-1005',
    authorName: 'Adv. Meenakshi Sundaram',
    authorRole: 'Legal Counsel',
    authorEmail: 'legal.counsel@nexora.io',
    category: 'Legal & Title Clarity',
    rating: 4,
    title: 'Section 77 escrow deposit mechanism successfully prevented High Court stay',
    comment: 'Depositing the disputed portion of compensation into the reference court under Section 77 allowed the sub-collector to issue the section 40 emergency certificate without violating civil court interim rights.',
    projectId: 'PRJ-NH48',
    projectName: 'NH-48 6-Lane Expansion',
    parcelId: 'P-1042',
    createdAt: '2026-09-02',
    upvotes: 18,
    status: 'Resolved',
    adminResponse: 'Precedent documented in the legal coordination dossier for similar pending civil suits.',
    sentiment: 'Positive',
    tags: ['Escrow', 'Civil Court', 'Section 77']
  },
  {
    id: 'FB-1006',
    authorName: 'Kailash S. Rathod (Sarpanch)',
    authorRole: 'Public Stakeholder',
    authorEmail: 'rathod.gram@palghar.org',
    category: 'R&R / Resettlement',
    rating: 2,
    title: 'Tribal community drinking water well replacement delayed in Manor forest fringe',
    comment: 'While residential plots were demarcated, the community borewell and approach road promised under the Rehabilitation Award are still incomplete. Community elders are reluctant to hand over tree felling permits until water line is operational.',
    projectId: 'PRJ-DFC92',
    projectName: 'Western Dedicated Freight Corridor',
    createdAt: '2026-08-30',
    upvotes: 16,
    status: 'Under Review',
    adminResponse: 'Executive directive sent to R&R wing to expedite mobile water tankers and borewell drilling.',
    sentiment: 'Critical',
    tags: ['Community R&R', 'Water Supply', 'Tribal Rights']
  },
  {
    id: 'FB-1007',
    authorName: 'Govind P. Narayanan',
    authorRole: 'Landowner',
    authorEmail: 'narayanan.gp@kolar.in',
    category: 'Statutory Timelines & SLAO',
    rating: 4,
    title: 'Online hearing notification reduced travel time to Collectorate',
    comment: 'Receiving the WhatsApp/SMS alert for Section 15 objection hearing with digital slot booking saved our family multiple trips from Bengaluru to Kolar. Transparent process.',
    projectId: 'PRJ-EXP11',
    projectName: 'Bengaluru-Chennai Expressway',
    parcelId: 'P-4012',
    surveyNumber: '88/3',
    createdAt: '2026-08-28',
    upvotes: 7,
    status: 'Resolved',
    sentiment: 'Positive',
    tags: ['E-Hearing', 'SMS Alerts', 'SLAO']
  },
  {
    id: 'FB-1008',
    authorName: 'Priya V. Shenoy (Project Director)',
    authorRole: 'Project Authority',
    authorEmail: 'director.exp11@nexora.io',
    category: 'Statutory Timelines & SLAO',
    rating: 4,
    title: 'Inter-department coordination module cut utility shifting latency by 3 weeks',
    comment: 'Assigning the Kolar water pipeline relocation directly through the joint task board prevented the usual bureaucratic paper loop between the Water Board and PWD.',
    projectId: 'PRJ-EXP11',
    projectName: 'Bengaluru-Chennai Expressway',
    createdAt: '2026-08-25',
    upvotes: 13,
    status: 'Resolved',
    adminResponse: 'Pipeline shifting completed on Aug 27. Roadbed earthwork now active.',
    sentiment: 'Positive',
    tags: ['Utility Relocation', 'Inter-Dept', 'Efficiency']
  },
  {
    id: 'FB-1009',
    authorName: 'Devidas G. Jadhav',
    authorRole: 'Landowner',
    authorEmail: 'devidas.j@navsari.org',
    category: 'Valuation & Compensation',
    rating: 3,
    title: 'Orchard tree and fruit-bearing valuation needs horticulture officer reassessment',
    comment: 'The compensation for 42 mature mango trees on Survey 304/1A was calculated at flat timber rates instead of capitalized 15-year fruit-bearing yield under the RFCTLARR rules. Have lodged appeal.',
    projectId: 'PRJ-HSR01',
    projectName: 'High-Speed Rail Corridor',
    parcelId: 'P-3044',
    surveyNumber: '304/1A',
    createdAt: '2026-08-22',
    upvotes: 12,
    status: 'Under Review',
    adminResponse: 'District Horticulture Officer deputed for joint site tree census on Sept 14.',
    sentiment: 'Neutral',
    tags: ['Tree Valuation', 'Horticulture', 'Mango Orchard']
  },
  {
    id: 'FB-1010',
    authorName: 'Sanjay A. Varma',
    authorRole: 'System Administrator',
    authorEmail: 'admin@nexora.io',
    category: 'Platform & Risk Model Usability',
    rating: 5,
    title: 'Live parcel inspection ledger has improved administrative audit transparency',
    comment: 'The centralized tracking of every parcel status, combined with automatic delay probability scoring, has eliminated audit discrepancies across 10 national infrastructure corridors.',
    createdAt: '2026-08-18',
    upvotes: 20,
    status: 'Acknowledged',
    sentiment: 'Positive',
    tags: ['System Audit', 'Transparency', 'Executive Overview']
  }
];

const LOCAL_STORAGE_KEY = 'nexora_stakeholder_feedback_v1';

export function getStoredFeedback(): FeedbackItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_FEEDBACK_DATA));
      return INITIAL_FEEDBACK_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_FEEDBACK_DATA;
  } catch (err) {
    console.warn('Failed to load feedback from localStorage, using seed data:', err);
    return INITIAL_FEEDBACK_DATA;
  }
}

export function saveStoredFeedback(items: FeedbackItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn('Failed to persist feedback in localStorage:', err);
  }
}

export function calculateFeedbackStats(items: FeedbackItem[]): FeedbackSummaryStats {
  const totalCount = items.length;
  if (totalCount === 0) {
    return {
      totalCount: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      categoryDistribution: {},
      roleDistribution: {},
      resolvedCount: 0,
      actionPlannedCount: 0,
      positivePercentage: 0
    };
  }

  let totalRatingSum = 0;
  const ratingDist: { [star in FeedbackRating]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const catDist: { [cat: string]: number } = {};
  const roleDist: { [role: string]: number } = {};
  let resolved = 0;
  let actionPlanned = 0;
  let positiveCount = 0;

  items.forEach(item => {
    totalRatingSum += item.rating;
    if (ratingDist[item.rating] !== undefined) {
      ratingDist[item.rating]++;
    }
    catDist[item.category] = (catDist[item.category] || 0) + 1;
    roleDist[item.authorRole] = (roleDist[item.authorRole] || 0) + 1;

    if (item.status === 'Resolved') resolved++;
    if (item.status === 'Action Planned') actionPlanned++;
    if (item.rating >= 4 || item.sentiment === 'Positive') positiveCount++;
  });

  const averageRating = Number((totalRatingSum / totalCount).toFixed(1));
  const positivePercentage = Math.round((positiveCount / totalCount) * 100);

  return {
    totalCount,
    averageRating,
    ratingDistribution: ratingDist,
    categoryDistribution: catDist as any,
    roleDistribution: roleDist as any,
    resolvedCount: resolved,
    actionPlannedCount: actionPlanned,
    positivePercentage
  };
}
