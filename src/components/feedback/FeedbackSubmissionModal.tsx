import React, { useState } from 'react';
import { 
  FeedbackCategory, 
  FeedbackItem, 
  FeedbackRating, 
  FeedbackRole 
} from '../../types/feedback';
import { Project } from '../../types';
import { 
  X, 
  Star, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  FolderGit2,
  MapPin,
  Tag
} from 'lucide-react';

interface FeedbackSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newFeedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'upvotes' | 'status'>) => void;
  projects?: Project[];
  defaultRole?: FeedbackRole;
}

const CATEGORIES: FeedbackCategory[] = [
  'Valuation & Compensation',
  'Ground Survey Accuracy',
  'Legal & Title Clarity',
  'Statutory Timelines & SLAO',
  'R&R / Resettlement',
  'Platform & Risk Model Usability',
  'General Suggestion'
];

const ROLES: FeedbackRole[] = [
  'Landowner',
  'Project Authority',
  'Field Revenue Officer',
  'Legal Counsel',
  'Public Stakeholder',
  'System Administrator'
];

export const FeedbackSubmissionModal: React.FC<FeedbackSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
  defaultRole = 'Landowner'
}) => {
  const [rating, setRating] = useState<FeedbackRating>(4);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorRole, setAuthorRole] = useState<FeedbackRole>(defaultRole);
  const [category, setCategory] = useState<FeedbackCategory>('Valuation & Compensation');
  const [projectId, setProjectId] = useState<string>('');
  const [surveyNumber, setSurveyNumber] = useState<string>('');
  const [parcelId, setParcelId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return '1 - Severe Grievance / Critical Bottleneck';
      case 2: return '2 - Below Expectation / Needs Administrative Intervention';
      case 3: return '3 - Moderate / Progressing with Partial Friction';
      case 4: return '4 - Good / Standard Statutory Efficiency';
      case 5: return '5 - Excellent / Model Practice or Full Resolution';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      setErrorMsg('Please enter your full name or entity name.');
      return;
    }
    if (!title.trim() || title.length < 5) {
      setErrorMsg('Please enter a descriptive headline (at least 5 characters).');
      return;
    }
    if (!comment.trim() || comment.length < 15) {
      setErrorMsg('Please provide detailed feedback or observations (at least 15 characters).');
      return;
    }

    const selectedProj = projects.find(p => p.id === projectId);
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const sentiment = rating >= 4 ? 'Positive' : rating === 3 ? 'Neutral' : 'Critical';

    onSubmit({
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim() || undefined,
      authorRole,
      category,
      rating,
      title: title.trim(),
      comment: comment.trim(),
      projectId: projectId || undefined,
      projectName: selectedProj ? selectedProj.name : undefined,
      surveyNumber: surveyNumber.trim() || undefined,
      parcelId: parcelId.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : [category.split(' ')[0]],
      sentiment
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setTitle('');
      setComment('');
      setSurveyNumber('');
      setParcelId('');
      setTagsInput('');
      setErrorMsg('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl border border-slate-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#18201a] text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-amber-500">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Submit Stakeholder Feedback &amp; Grievance
              </h3>
              <p className="text-[11px] text-stone-300">
                Log observations, crop solatium remarks, ground demarcation inputs, or contractor feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-serif font-bold text-lg text-stone-900">
              Feedback Successfully Recorded
            </h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Thank you. Your feedback has been integrated into the central stakeholder observatory and executive dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Rating Selector */}
            <div className="p-3 bg-amber-50/50 border border-amber-200">
              <label className="font-bold text-stone-800 uppercase tracking-wide text-[10px] font-mono block mb-1">
                Satisfaction / Experience Rating *
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star as FeedbackRating)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 text-stone-300 hover:text-amber-500 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating !== null ? hoverRating : rating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="font-mono text-stone-800 font-semibold ml-2">
                  {getRatingLabel(hoverRating !== null ? hoverRating : rating)}
                </span>
              </div>
            </div>

            {/* Submitter Info: Name, Role, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Full Name / Submitter *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rameshwar Patil (Farmer / Landowner)"
                  className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Stakeholder Role *
                </label>
                <select
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value as FeedbackRole)}
                  className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r === 'Landowner' ? '🌾 Landowner / Farmer' : r === 'Project Authority' ? '🚜 Project Authority / EPC Constructor' : r === 'Field Revenue Officer' ? '📜 Field Revenue Officer / Patwari' : r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Email / Contact (Optional)
                </label>
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder="email@domain.com or Phone"
                  className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Category & Project Linking */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Grievance / Feedback Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500 font-sans"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Related Corridor / Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500 font-sans"
                >
                  <option value="">-- Optional / General Infrastructure --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Specific Parcel References */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Survey Number / 7-12 (Optional)
                </label>
                <input
                  type="text"
                  value={surveyNumber}
                  onChange={(e) => setSurveyNumber(e.target.value)}
                  placeholder="e.g. 104/2B or 74/2A"
                  className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Parcel Identifier (Optional)
                </label>
                <input
                  type="text"
                  value={parcelId}
                  onChange={(e) => setParcelId(e.target.value)}
                  placeholder="e.g. P-1042"
                  className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Headline Title */}
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Headline / Key Summary *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solatium calculation rate dispute in Urse village"
                className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500 font-sans font-semibold"
              />
            </div>

            {/* Detailed Narrative */}
            <div>
              <label className="font-semibold text-stone-800 block mb-1">
                Detailed Feedback Narrative / Observations *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Provide specific details regarding the ground reality, delay reasons, crop valuation, or contractor access issues..."
                className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Tags / Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Circle Rate, Soil Survey, Well Compensation, RoW Clearance"
                className="w-full p-2 bg-white border border-stone-300 focus:outline-none focus:border-amber-500 text-[11px]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-[10px] text-stone-500">
                All submissions are indexed into transparent public land audits.
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold flex items-center space-x-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-stone-950" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
