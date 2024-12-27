import { MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { deleteMessage } from '@/lib/services/reactions';
import { useToast } from '@/components/ui/use-toast';

interface MessageActionsProps {
  messageId: string;
  userId: string;
  isOwner: boolean;
  onDelete: () => void;
}

export default function MessageActions({
  messageId,
  userId,
  isOwner,
  onDelete
}: MessageActionsProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteMessage(messageId, userId);
      onDelete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isOwner) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}