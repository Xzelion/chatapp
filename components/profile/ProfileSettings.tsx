"use client";

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Shield } from 'lucide-react';
import { ProfileSettings } from '@/lib/types/profile';
import { updateUserSettings } from '@/lib/services/profile/settings';
import { useToast } from '@/components/ui/use-toast';

interface ProfileSettingsProps {
  userId: string;
  initialSettings: ProfileSettings;
  onUpdate: (settings: ProfileSettings) => void;
}

export default function ProfileSettings({
  userId,
  initialSettings,
  onUpdate
}: ProfileSettingsProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserSettings(userId, settings);
      onUpdate(settings);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Bell className="h-5 w-5" />
          <h3>Notifications</h3>
        </div>
        
        <div className="space-y-4 ml-7">
          <div className="flex items-center justify-between">
            <Label htmlFor="sound">Sound notifications</Label>
            <Switch
              id="sound"
              checked={settings.notifications.sound}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, sound: checked }
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="desktop">Desktop notifications</Label>
            <Switch
              id="desktop"
              checked={settings.notifications.desktop}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, desktop: checked }
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="mentions">Notify on mentions</Label>
            <Switch
              id="mentions"
              checked={settings.notifications.mentions}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                notifications: { ...prev.notifications, mentions: checked }
              }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="h-5 w-5" />
          <h3>Privacy</h3>
        </div>
        
        <div className="space-y-4 ml-7">
          <div className="flex items-center justify-between">
            <Label htmlFor="online-status">Show online status</Label>
            <Switch
              id="online-status"
              checked={settings.privacy.showOnlineStatus}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, showOnlineStatus: checked }
              }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="direct-messages">Allow direct messages</Label>
            <Switch
              id="direct-messages"
              checked={settings.privacy.allowDirectMessages}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                privacy: { ...prev.privacy, allowDirectMessages: checked }
              }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Moon className="h-5 w-5" />
          <h3>Theme</h3>
        </div>
        
        <div className="space-y-4 ml-7">
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((theme) => (
              <Button
                key={theme}
                variant={settings.theme === theme ? "default" : "outline"}
                onClick={() => setSettings(prev => ({ ...prev, theme }))}
                className="capitalize"
              >
                {theme}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        className="w-full"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}