"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import WeeklyActivityCard from "@/components/profile/WeeklyActivityCard";
import ProfilePostCard from "@/components/profile/ProfilePostCard";
import EditBioModal from "@/components/profile/EditBioModal";
import { UserProfileData } from "@/types/types";
import Header from "@/components/homePage/Header";

const UserProfile = () => {
  const params = useParams();
  const router = useRouter();
  const { user, getUserProfile, updateBio } = useAuth();
  const username = params.username as string;

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isOwnProfile = user?.userName === username;
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getUserProfile(username);
        if (data) {
          setProfileData(data);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleEditBio = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveBio = async (newBio: string) => {
    try {
      await updateBio(newBio);
      const data = await getUserProfile(username);
      if (data) {
        setProfileData(data);
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update bio:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {error || "Profile not found"}
          </h2>
          <button
            onClick={() => router.push("/home")}
            className="text-primary hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* profile ka header */}
          <ProfileHeader
            user={profileData.user}
            isOwnProfile={isOwnProfile}
            onEditBio={handleEditBio}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProfileStats
                postCount={profileData.postCount}
                commentCount={profileData.commentCount}
              />

              {/* recent posts saari */}
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-4">
                  Recent Posts
                </h2>
                {profileData.posts.length === 0 ? (
                  <div className="bg-card border-4 border-border rounded-2xl p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-muted-foreground text-lg font-semibold">
                      No posts yet
                    </p>
                    {isOwnProfile && (
                      <p className="text-muted-foreground text-sm mt-2">
                        Start sharing your thoughts!
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    {profileData.posts.map((post, index) => (
                      <ProfilePostCard
                        key={post._id}
                        post={post}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <WeeklyActivityCard weeklyActivity={profileData.weeklyActivity} />
            </div>
          </div>
        </div>
      </div>

      {/* bio modal */}
      <EditBioModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentBio={profileData.user.bio || ""}
        onSave={handleSaveBio}
      />
    </div>
  );
};

export default UserProfile;
