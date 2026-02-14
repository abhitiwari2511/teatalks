import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserProfileData } from "@/types/types";

export function useUserProfile(username: string) {
  const { user, getUserProfile, updateBio } = useAuth();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  return {
    profileData,
    loading,
    error,
    isOwnProfile,
    isEditModalOpen,
    handleEditBio,
    handleSaveBio,
    handleCloseModal,
  };
}
