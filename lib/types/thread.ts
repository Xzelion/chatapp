export interface ThreadMessage extends Message {
  parent_id: string | null;
  reply_count?: number;
}

export interface Thread {
  id: string;
  parent_message: ThreadMessage;
  replies: ThreadMessage[];
  participants: ChatUser[];
}