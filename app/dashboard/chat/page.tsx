'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useChat } from '@/hooks/useChat';
import ChatWindow from '@/components/chat/ChatWindow';
import ConversationList from '@/components/chat/ConversationList';
import MemoryPanel from '@/components/chat/MemoryPanel';

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);

  const {
    messages,
    isStreaming,
    error,
    memory,
    conversations,
    activeConversationId,
    sendMessage,
    loadConversation,
    createConversation,
    deleteConversation,
    loadConversations,
    loadMemory,
    clearMemory,
    clearError,
  } = useChat();

  // Load conversations and memory on mount
  useEffect(() => {
    if (status === 'authenticated') {
      loadConversations();
      loadMemory();
    }
  }, [status, loadConversations, loadMemory]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-sm uppercase tracking-widest text-secondary font-semibold font-sans">
        <span className="material-symbols-outlined text-primary text-3xl animate-spin mr-2">
          progress_activity
        </span>
        Loading...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-surface font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white border-b border-surface-container flex-shrink-0 z-30">
        <div className="w-full px-4 lg:px-6">
          <div className="flex h-14 justify-between items-center">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer lg:hidden"
                aria-label="Toggle sidebar"
              >
                <span className="material-symbols-outlined text-on-surface">
                  menu
                </span>
              </button>
              <Link href="/dashboard" className="flex items-center gap-2 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="Vyora Logo"
                  className="w-6 h-6 group-hover:scale-105 transition-transform"
                />
                <span className="font-display text-lg font-bold text-on-surface tracking-tight">
                  Vyora
                </span>
              </Link>
              <span className="text-surface-container-high mx-1 hidden sm:inline">|</span>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">
                  travel_explore
                </span>
                <span className="text-body-md font-semibold text-on-surface">
                  AI Trip Planner
                </span>
              </div>
            </div>

            {/* Right: Memory toggle + User + Sign out */}
            <div className="flex items-center gap-2 sm:gap-3">
              <MemoryPanel
                memory={memory}
                onClear={clearMemory}
                isOpen={memoryOpen}
                onToggle={() => setMemoryOpen(!memoryOpen)}
              />

              <div className="hidden sm:flex items-center gap-2 border-l border-surface-container pl-3">
                <span className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                </span>
                <span className="text-label-md font-semibold text-on-surface hidden md:inline">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-label-md font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area — takes remaining height */}
      <div className="flex flex-1 min-h-0">
        {/* Conversation Sidebar — desktop: always visible, fills height */}
        <div className="hidden lg:flex flex-shrink-0">
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={(id) => {
              loadConversation(id);
              setSidebarOpen(false);
            }}
            onDelete={deleteConversation}
            onNew={() => {
              createConversation();
              setSidebarOpen(false);
            }}
            isOpen={true}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Mobile sidebar */}
        <div className="lg:hidden">
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={(id) => {
              loadConversation(id);
              setSidebarOpen(false);
            }}
            onDelete={deleteConversation}
            onNew={() => {
              createConversation();
              setSidebarOpen(false);
            }}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Chat Window — fills remaining space */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            memory={memory}
            error={error}
            onSendMessage={sendMessage}
            onClearError={clearError}
          />
        </div>
      </div>
    </div>
  );
}
