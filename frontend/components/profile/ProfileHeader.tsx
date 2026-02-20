import { User } from "@/types/types";
import { Calendar, Edit } from "lucide-react";
import { Button } from "../ui/button";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onEditBio?: () => void;
}

export const ProfileHeader = ({
  user,
  isOwnProfile,
  onEditBio,
}: ProfileHeaderProps) => {
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-card border-4 border-border rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 sm:w-32 sm:h-32 bg-secondary rounded-full border-4 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
          <span className="text-3xl sm:text-6xl">👤</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 md:mb-2">
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-foreground wrap-break-word">
                @{user.userName}
              </h1>
            </div>

            {isOwnProfile && (
              <Button
                onClick={onEditBio}
                variant="secondary"
                size="sm"
                className="border-2 cursor-pointer border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>

          <p className="text-foreground text-base mb-4 max-w-2xl">
            {user.bio ||
              "CS senior | Coffee enthusiast ☕ | Always procrastinating but somehow making it work 🤷"}
          </p>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">
              Joined {formatJoinDate(user.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
