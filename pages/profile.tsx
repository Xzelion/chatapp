"use client";

import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/lib/types/user';
import ProfileForm from '@/components/profile/ProfileForm';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    // Update local storage with new profile data
    localStorage.setItem('chatUser', JSON.stringify(updatedProfile));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        <div className="bg-card rounded-lg shadow-lg p-6">
          <ProfileForm
            profile={user as UserProfile}
            onUpdate={handleProfileUpdate}
          />
        </div>
      </div>
    </div>
  );
}