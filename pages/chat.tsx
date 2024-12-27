"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import OnlineUsers from '@/components/chat/OnlineUsers';
import SearchDialog from '@/components/chat/SearchDialog';
import MessageListHeader from '@/components/chat/MessageListHeader';
import { useChat } from '@/lib/chat-context';
import ConnectionStatusIndicator from '@/components/chat/ConnectionStatus';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export default function ChatRoom() {
  const { user, loading: authLoading } = useAuth();
  const { messages, onlineUsers, loading: messagesLoading, sendMessage } = useChat();
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileUsers, setShowMobileUsers] = useState(false);

  if (!user || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <OnlineUsers 
        currentUserId={user.id} 
        className="hidden md:flex"
        users={onlineUsers}
      />
      
      <div className="flex-1 flex flex-col">
        <MessageListHeader 
          onSearchClick={() => setShowSearch(true)}
          onlineCount={onlineUsers?.length ?? 0}
          onShowUsers={() => setShowMobileUsers(true)}
        />

        <MessageList 
          messages={messages}
          currentUserId={user.id}
          loading={messagesLoading}
        />

        <div className="p-4 border-t border-border bg-card/95">
          <MessageInput 
            onSendMessage={sendMessage}
            disabled={messagesLoading}
          />
        </div>
      </div>

      <Sheet open={showMobileUsers} onOpenChange={setShowMobileUsers}>
        <SheetContent side="right" className="p-0">
          <OnlineUsers 
            currentUserId={user.id}
            users={onlineUsers}
          />
        </SheetContent>
      </Sheet>

      <SearchDialog
        open={showSearch}
        onOpenChange={setShowSearch}
        currentUserId={user.id}
      />

      <ConnectionStatusIndicator />
    </div>
  );
}