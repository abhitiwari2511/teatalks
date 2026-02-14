interface ProfileStatsProps {
  postCount: number;
  commentCount: number;
}

export default function ProfileStats({
  postCount,
  commentCount,
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-[#FF9B7C] border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="text-5xl font-black text-foreground mb-2">
          {postCount}
        </div>
        <div className="text-sm font-bold text-foreground uppercase tracking-wide">
          Posts
        </div>
      </div>

      <div className="bg-[#FFB5D5] border-4 border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
        <div className="text-5xl font-black text-foreground mb-2">
          {commentCount}
        </div>
        <div className="text-sm font-bold text-foreground uppercase tracking-wide">
          Comments
        </div>
      </div>
    </div>
  );
}
