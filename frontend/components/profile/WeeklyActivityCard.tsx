import { WeeklyActivity } from "@/types/types";

interface WeeklyActivityCardProps {
  weeklyActivity: WeeklyActivity;
}

export default function WeeklyActivityCard({
  weeklyActivity,
}: WeeklyActivityCardProps) {
  return (
    <div className="bg-[#FFB5D5] border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
      <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
        This Week 🎉
      </h2>

      <div className="space-y-3">
        {/* post create huye */}
        <div className="flex items-center gap-3 text-foreground">
          <span className="text-2xl">📝</span>
          <span className="font-semibold">
            {weeklyActivity.postsCreated}{" "}
            {weeklyActivity.postsCreated === 1 ? "post" : "posts"} created
          </span>
        </div>

        {/* comments huye */}
        <div className="flex items-center gap-3 text-foreground">
          <span className="text-2xl">💬</span>
          <span className="font-semibold">
            {weeklyActivity.commentsMade}{" "}
            {weeklyActivity.commentsMade === 1 ? "comment" : "comments"} made
          </span>
        </div>
      </div>
    </div>
  );
}
