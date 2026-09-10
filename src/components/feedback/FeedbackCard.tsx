import React, { useState } from 'react';
import { FeedbackItem, FeedbackStatus } from '../../types/feedback';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  Tag, 
  MapPin, 
  FolderGit2, 
  User, 
  Send
} from 'lucide-react';

interface FeedbackCardProps {
  item: FeedbackItem;
  onUpvote: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: FeedbackStatus, adminNote?: string) => void;
  canManageStatus?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  item,
  onUpvote,
  onUpdateStatus,
  canManageStatus = true
}) => {
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus>(item.status);

  const handleUpvoteClick = () => {
    if (!hasUpvoted) {
      onUpvote(item.id);
      setHasUpvoted(true);
    }
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateStatus) {
      onUpdateStatus(item.id, selectedStatus, replyText.trim() || item.adminResponse);
      setIsReplying(false);
      setReplyText('');
    }
  };

  // Role badge styling
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Landowner':
        return 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold';
      case 'Project Authority':
        return 'bg-amber-100 text-amber-950 border-amber-400 font-bold';
      case 'Field Revenue Officer':
        return 'bg-stone-200 text-stone-900 border-stone-400';
      case 'Legal Counsel':
        return 'bg-stone-100 text-stone-800 border-stone-300';
      case 'System Administrator':
        return 'bg-[#18201a] text-amber-300 border-amber-500/40';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  // Status badge styling
  const getStatusBadge = (status: FeedbackStatus) => {
    switch (status) {
      case 'Resolved':
        return {
          label: 'Resolved',
          cls: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CheckCircle2
        };
      case 'Action Planned':
        return {
          label: 'Action Planned',
          cls: 'bg-amber-50 text-amber-900 border-amber-300',
          icon: Clock
        };
      case 'Acknowledged':
        return {
          label: 'Acknowledged',
          cls: 'bg-stone-100 text-stone-800 border-stone-300',
          icon: MessageSquare
        };
      default:
        return {
          label: 'Under Review',
          cls: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: AlertCircle
        };
    }
  };

  const statusInfo = getStatusBadge(item.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white border border-stone-300 hover:border-amber-400 transition shadow-xs p-4 flex flex-col justify-between">
      <div>
        {/* Header: Author, Role, Date, and Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5 mb-2.5">
          <div className="flex items-center space-x-2 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-950 font-bold text-xs shrink-0">
              {item.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-stone-900 text-xs">{item.authorName}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 border ${getRoleBadge(item.authorRole)}`}>
              {item.authorRole}
            </span>
            <span className="text-[10px] text-stone-500 font-mono">
              {item.createdAt}
            </span>
          </div>

          {/* Star Rating Display */}
          <div className="flex items-center space-x-1 shrink-0">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= item.rating
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-stone-300'
                }`}
              />
            ))}
            <span className="text-xs font-mono font-bold text-stone-700 ml-1">
              {item.rating}.0
            </span>
          </div>
        </div>

        {/* Category & Project Context Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-2 text-[11px]">
          <span className="bg-stone-100 text-stone-700 font-mono px-2 py-0.5 border border-stone-200 font-medium">
            {item.category}
          </span>
          {item.projectName && (
            <span className="bg-stone-100 text-stone-800 font-mono px-2 py-0.5 border border-stone-300 flex items-center gap-1">
              <FolderGit2 className="w-3 h-3 text-amber-700" />
              <span>{item.projectName}</span>
            </span>
          )}
          {item.surveyNumber && (
            <span className="bg-amber-50 text-amber-900 font-mono px-2 py-0.5 border border-amber-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-700" />
              <span>Survey #{item.surveyNumber} {item.parcelId ? `(${item.parcelId})` : ''}</span>
            </span>
          )}
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 border flex items-center gap-1 ml-auto ${statusInfo.cls}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Title */}
        <h4 className="font-serif font-bold text-stone-900 text-sm leading-snug mb-1.5">
          {item.title}
        </h4>

        {/* Narrative / Comment */}
        <p className="text-xs text-stone-700 leading-relaxed font-sans">
          {item.comment}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1 flex-wrap">
            {item.tags.map((t) => (
              <span key={t} className="text-[10px] text-stone-600 bg-stone-100 border border-stone-200 px-1.5 py-0.2">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Administrative Action Response Box (if any) */}
        {item.adminResponse && (
          <div className="mt-3 p-2.5 bg-amber-50/50 border-l-3 border-l-amber-600 border border-amber-200 text-xs">
            <div className="flex items-center space-x-1.5 text-amber-950 font-bold text-[11px] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Executive / Authority Response:</span>
            </div>
            <p className="text-stone-700 italic">
              &quot;{item.adminResponse}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Footer Controls: Upvote, Response, Status Update */}
      <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleUpvoteClick}
          disabled={hasUpvoted}
          className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs border font-mono transition ${
            hasUpvoted
              ? 'bg-amber-100 text-amber-950 border-amber-400 font-bold'
              : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-300'
          }`}
          title="Mark this feedback as important or helpful"
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-amber-600 text-amber-700' : ''}`} />
          <span>Helpful ({item.upvotes})</span>
        </button>

        {canManageStatus && (
          <div className="flex items-center space-x-2">
            {!isReplying ? (
              <button
                type="button"
                onClick={() => setIsReplying(true)}
                className="text-[11px] font-mono text-amber-900 hover:underline font-bold"
              >
                {item.adminResponse ? 'Update Action Note' : '+ Respond / Update Status'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="text-[11px] font-mono text-stone-500 hover:underline"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Administrative Action Drawer */}
      {isReplying && (
        <form onSubmit={handleSaveResponse} className="mt-3 p-3 bg-slate-50 border border-slate-300 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800 text-[11px]">Official Status Update</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as FeedbackStatus)}
              className="px-2 py-1 text-xs bg-white border border-stone-300 font-mono"
            >
              <option value="Under Review">Under Review</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Action Planned">Action Planned</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add an executive response or action memo for this stakeholder..."
            rows={2}
            className="w-full p-2 text-xs bg-white border border-stone-300 focus:outline-none focus:border-amber-500"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="px-2.5 py-1 text-stone-600 bg-white border border-stone-300 text-[11px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] flex items-center gap-1 shadow-xs"
            >
              <Send className="w-3 h-3 text-stone-950" />
              <span>Save Official Update</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
