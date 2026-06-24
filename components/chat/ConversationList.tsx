'use client';

import type { ConversationSummary } from '@/types/chat';

interface ConversationListProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  isOpen: boolean;
  onClose: () => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNew,
  isOpen,
  onClose,
}: ConversationListProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-surface-container z-50 shadow-xl flex flex-col transition-transform duration-200 lg:static lg:z-auto lg:shadow-none lg:translate-x-0 lg:w-56 xl:w-64 lg:bg-surface-container-lowest lg:border-r lg:border-surface-container lg:rounded-none lg:h-full ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container flex-shrink-0">
          <h3 className="text-label-md font-bold text-on-surface uppercase tracking-wider">
            Conversations
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={onNew}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer"
              title="New conversation"
            >
              <span className="material-symbols-outlined text-base text-primary">
                add
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer lg:hidden"
            >
              <span className="material-symbols-outlined text-base text-secondary">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Conversation items */}
        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <span className="material-symbols-outlined text-3xl text-secondary/30 mb-2 block">
                chat_bubble_outline
              </span>
              <p className="text-body-md text-secondary/50">No conversations yet</p>
              <p className="text-label-sm text-secondary/40 mt-1">
                Start a new chat to plan your trip!
              </p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`group flex items-center gap-2 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                  activeId === conv._id
                    ? 'bg-primary-container/15 text-primary'
                    : 'hover:bg-surface-container text-on-surface'
                }`}
                onClick={() => onSelect(conv._id)}
              >
                <span className="material-symbols-outlined text-base flex-shrink-0 opacity-50">
                  chat
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md font-medium truncate">
                    {conv.title}
                  </p>
                  <p className="text-label-sm text-secondary/50">
                    {timeAgo(conv.updatedAt)} · {conv.messageCount} msgs
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv._id);
                  }}
                  className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-error/10 hover:text-error transition-all cursor-pointer"
                  title="Delete conversation"
                >
                  <span className="material-symbols-outlined text-sm">
                    delete
                  </span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* New Chat Button (bottom) */}
        <div className="px-3 py-3 border-t border-surface-container flex-shrink-0">
          <button
            onClick={onNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary-container text-label-md font-semibold hover:shadow-md transition-all active:scale-[0.97] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Chat
          </button>
        </div>
      </div>
    </>
  );
}
