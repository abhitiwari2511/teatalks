"use client";

interface ReactionCardProps {
  reactionEmojis: Record<string, string>;
  localReactionCount: Record<string, number>;
  userReaction: string | null;
  onReactionClick: (type: string) => Promise<void>;
}

export default function ReactionCard({
  reactionEmojis,
  localReactionCount,
  userReaction,
  onReactionClick,
}: ReactionCardProps) {
  const totalReactions = Object.values(localReactionCount).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <div className="bg-[#B4E7E7] border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">👍</span>
        <h3 className="text-xl font-black text-black">Like</h3>
        <span className="ml-auto text-2xl font-black text-black">
          {totalReactions}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {Object.entries(reactionEmojis).map(([type, emoji]) => {
          const isSelected = userReaction === type;
          return (
            <button
              key={type}
              onClick={() => onReactionClick(type)}
              className={`flex cursor-pointer items-center justify-center gap-2 border-4 border-black rounded-xl p-3 hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                isSelected ? "bg-[#FF9B7C] scale-105" : "bg-white"
              }`}
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-lg font-bold text-black">
                {localReactionCount[type] || 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
