"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { UserProfile, ProfileUpdateData } from '@/lib/types/user';
import { updateProfile } from '@/lib/services/profile';
import { useToast } from '@/components/ui/use-toast';
import AvatarUpload from './AvatarUpload';

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export default function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileUpdateData>({
    nickname: profile.nickname,
    bio: profile.bio || '',
    notification_settings: profile.notification_settings || {
      sounds: true,
      desktop: true
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedProfile = await updateProfile(profile.id, formData);
      if (updatedProfile) {
        onUpdate(updatedProfile);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpdate = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AvatarUpload
        userId={profile.id}
        currentAvatarUrl={profile.avatar_url}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <div className="space-y-4">
        <div>
          <Label htmlFor="nickname">Display Name</Label>
          <Input
            id="nickname"
            value={formData.nickname}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              nickname: e.target.value
            }))}
            maxLength={30}
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              bio: e.target.value
            }))}
            maxLength={160}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="space-y-3">
          <Label>Notifications</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-notifications" className="cursor-pointer">
                Sound Notifications
              </Label>
              <Switch
                id="sound-notifications"
                checked={formData.notification_settings?.sounds}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  notification_settings: {
                    ...prev.notification_settings,
                    sounds: checked
                  }
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="desktop-notifications" className="cursor-pointer">
                Desktop Notifications
              </Label>
              <Switch
                id="desktop-notifications"
                checked={formData.notification_settings?.desktop}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  notification_settings: {
                    ...prev.notification_settings,
                    desktop: checked
                  }
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
        Save Changes
      </Button>
    </form>
  );
}