export type FeedbackCategory =
  | 'Valuation & Compensation'
  | 'Ground Survey Accuracy'
  | 'Legal & Title Clarity'
  | 'Statutory Timelines & SLAO'
  | 'R&R / Resettlement'
  | 'Platform & Risk Model Usability'
  | 'General Suggestion';

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type FeedbackRole = 
  | 'Landowner' 
  | 'Project Authority' 
  | 'System Administrator' 
  | 'Field Revenue Officer' 
  | 'Legal Counsel' 
  | 'Public Stakeholder';

export type FeedbackStatus = 'Under Review' | 'Acknowledged' | 'Action Planned' | 'Resolved';

export interface FeedbackItem {
  id: string; // e.g. "FB-101"
  authorName: string;
  authorRole: FeedbackRole;
  authorEmail?: string;
  category: FeedbackCategory;
  rating: FeedbackRating;
  title: string;
  comment: string;
  projectId?: string;
  projectName?: string;
  parcelId?: string;
  surveyNumber?: string;
  createdAt: string; // e.g. "2026-09-08"
  upvotes: number;
  status: FeedbackStatus;
  adminResponse?: string;
  tags?: string[];
  sentiment?: 'Positive' | 'Neutral' | 'Critical';
}

export interface FeedbackSummaryStats {
  totalCount: number;
  averageRating: number;
  ratingDistribution: { [star in FeedbackRating]: number };
  categoryDistribution: { [cat in FeedbackCategory]?: number };
  roleDistribution: { [role in FeedbackRole]?: number };
  resolvedCount: number;
  actionPlannedCount: number;
  positivePercentage: number;
}
