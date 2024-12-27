"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Upload, Loader2 } from 'lucide-react';
import { uploadAvatar } from '@/lib/services/profile';
import { useToast } from '@/components/ui/use-toast';

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
}

export default function AvatarUpload({
  userId,
  currentAvatarUrl,
  onAvatarUpdate
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadAvatar(userId, file);
      if (url) {
        onAvatarUpdate(url);
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Profile"
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-2xl font-medium">
            {userId[0]?.toUpperCase()}
          </div>
        )}
      </Avatar>

      <div className="flex items-center gap-2">
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('avatar-upload')?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          Upload Avatar
        </Button>
      </div>
    </div>
  );
}