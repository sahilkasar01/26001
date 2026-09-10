import React, { useState, useMemo } from 'react';
import { 
  FeedbackItem, 
  FeedbackCategory, 
  FeedbackRating, 
  FeedbackRole, 
  FeedbackStatus 
} from '../types/feedback';
import { Project } from '../types';
import { FeedbackStatsOverview } from '../components/feedback/FeedbackStatsOverview';
import { FeedbackCard } from '../components/feedback/FeedbackCard';
import { FeedbackSubmissionModal } from '../components/feedback/FeedbackSubmissionModal';
import { calculateFeedbackStats } from '../data/feedback';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  Plus, 
  MessageSquareQuote,
  FolderGit2,
  CheckCircle2,
  SlidersHorizontal,
  ThumbsUp,
  Sparkles
} from 'lucide-react';

interface FeedbackPageProps {
  feedbackList: FeedbackItem[];
  projects: Project[];
  onAddFeedback: (item: Omit<FeedbackItem, 'id' | 'createdAt' | 'upvotes' | 'status'>) => void;
  onUpvoteFeedback: (id: string) => void;
  onUpdateFeedbackStatus: (id: string, newStatus: FeedbackStatus, adminNote?: string) => void;
  currentUserRole?: string;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({
  feedbackList,
  projects,
  onAddFeedback,
  onUpvoteFeedback,
  onUpdateFeedbackStatus,
  currentUserRole
}) => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRating, setSelectedRating] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'rating-high' | 'rating-low' | 'upvotes'>('recent');

  // Compute overall stats
  const stats = useMemo(() => {
    return calculateFeedbackStats(feedbackList);
  }, [feedbackList]);

  // Filter and sort items
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      // Role filter
      if (selectedRole !== 'ALL' && item.authorRole !== selectedRole) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Rating filter
      if (selectedRating !== 'ALL' && item.rating.toString() !== selectedRating) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesComment = item.comment.toLowerCase().includes(q);
        const matchesAuthor = item.authorName.toLowerCase().includes(q);
        const matchesProject = item.projectName?.toLowerCase().includes(q) || false;
        const matchesSurvey = item.surveyNumber?.toLowerCase().includes(q) || false;
        const matchesTags = item.tags?.some(t => t.toLowerCase().includes(q)) || false;
        if (!matchesTitle && !matchesComment && !matchesAuthor && !matchesProject && !matchesSurvey && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'rating-high') {
        return b.rating - a.rating;
      }
      if (sortBy === 'rating-low') {
        return a.rating - b.rating;
      }
      if (sortBy === 'upvotes') {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });
  }, [feedbackList, selectedRole, selectedCategory, selectedRating, selectedStatus, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('ALL');
    setSelectedCategory('ALL');
    setSelectedRating('ALL');
    setSelectedStatus('ALL');
    setSortBy('recent');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedRole !== 'ALL' || 
    selectedCategory !== 'ALL' || 
    selectedRating !== 'ALL' || 
    selectedStatus !== 'ALL';

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-[#18201a] text-white p-4 sm:p-5 border-l-4 border-amber-500 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono mb-1">
            <MessageSquareQuote className="w-4 h-4 text-amber-400" />
            <span>TRANSPARENT STAKEHOLDER FEEDBACK REGISTRY</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
            Stakeholder Feedback &amp; Field Sentiment Observatory
          </h1>
          <p className="text-xs text-stone-300 mt-1 max-w-3xl leading-relaxed">
            Direct channel for farmers, civil construction authorities, field revenue patwaris, and legal counsel to register ground realities, dispute observations, and statutory process feedback.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs py-2 px-3.5 shadow-xs transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-stone-950" />
            <span>Submit Feedback</span>
          </button>
        </div>
      </div>

      {/* 1. Overall Statistics & Distribution Component */}
      <FeedbackStatsOverview
        stats={stats}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        activeRoleFilter={selectedRole}
        onSelectRoleFilter={(role) => setSelectedRole(role)}
      />

      {/* 2. Filter, Search & Sort Control Bar */}
      <div className="bg-white border border-stone-300 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feedback by keywords, farmer name, village, project, or survey number..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 focus:outline-none focus:border-amber-500 font-sans"
            />
          </div>

          {/* Quick Sort dropdown */}
          <div className="flex items-center space-x-2 text-xs shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-600 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-1.5 bg-stone-50 border border-stone-300 text-xs font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="recent">Most Recent First</option>
              <option value="rating-high">Highest Rating (5★ → 1★)</option>
              <option value="rating-low">Lowest Rating (1★ → 5★)</option>
              <option value="upvotes">Most Helpful / Upvotes</option>
            </select>
          </div>
        </div>

        {/* Filter Chips Bar */}
        <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-mono text-[11px] font-bold uppercase flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-stone-500" />
            Filters:
          </span>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="p-1 bg-stone-50 border border-stone-300 text-[11px] font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Roles ({feedbackList.length})</option>
            <option value="Landowner">🌾 Landowners / Farmers</option>
            <option value="Project Authority">🚜 Project Authorities / Constructors</option>
            <option value="Field Revenue Officer">📜 Field Revenue Patwaris</option>
            <option value="Legal Counsel">⚖️ Legal Counsel</option>
            <option value="Public Stakeholder">👥 Public Stakeholders</option>
            <option value="System Administrator">⚙️ Administrators</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-1 bg-stone-50 border border-stone-300 text-[11px] font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Valuation & Compensation">Valuation & Compensation</option>
            <option value="Ground Survey Accuracy">Ground Survey Accuracy</option>
            <option value="Legal & Title Clarity">Legal & Title Clarity</option>
            <option value="Statutory Timelines & SLAO">Statutory Timelines & SLAO</option>
            <option value="R&R / Resettlement">R&R / Resettlement</option>
            <option value="Platform & Risk Model Usability">Platform Usability</option>
            <option value="General Suggestion">General Suggestions</option>
          </select>

          {/* Rating Filter */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="p-1 bg-stone-50 border border-stone-300 text-[11px] font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars (Excellent)</option>
            <option value="4">4 Stars (Good)</option>
            <option value="3">3 Stars (Moderate)</option>
            <option value="2">2 Stars (Grievance)</option>
            <option value="1">1 Star (Critical)</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1 bg-stone-50 border border-stone-300 text-[11px] font-mono focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Acknowledged">Acknowledged</option>
            <option value="Action Planned">Action Planned</option>
            <option value="Resolved">Resolved</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="ml-auto text-[11px] text-amber-900 hover:text-amber-950 flex items-center space-x-1 font-mono font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Feedback Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-600 px-1 font-mono">
          <span>
            Showing <strong className="text-stone-900">{filteredFeedback.length}</strong> of {feedbackList.length} feedback entries
          </span>
          {hasActiveFilters && (
            <span className="text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300 font-bold">
              Filtered View Active
            </span>
          )}
        </div>

        {filteredFeedback.length === 0 ? (
          <div className="bg-white border border-stone-300 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-stone-800">
              No Feedback Found Matching Your Filters
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try clearing your search keyword or relaxing the role and category filters to see more entries.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1.5 bg-stone-100 border border-stone-300 hover:bg-stone-200 text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredFeedback.map((item) => (
              <FeedbackCard
                key={item.id}
                item={item}
                onUpvote={onUpvoteFeedback}
                onUpdateStatus={onUpdateFeedbackStatus}
                canManageStatus={currentUserRole !== 'Landowner'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      <FeedbackSubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={onAddFeedback}
        projects={projects}
        defaultRole={(currentUserRole as any) || 'Landowner'}
      />
    </div>
  );
};
