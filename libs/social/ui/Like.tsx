"use client";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { clsx } from "@core/client";
import { usePage } from "@social/client";
import { useState } from "react";

interface LikeProps {
  className?: string;
  like: number;
  totalLike: number;
  likedClassName?: string;
  unlikedClassName?: string;
  onLike?: () => void;
  onResetlike?: () => void;
}
export const Like = ({
  className,
  like,
  totalLike,
  onLike,
  onResetlike,
  likedClassName = "btn-primary",
  unlikedClassName = "btn-ghost bg-white/50",
}: LikeProps) => {
  const [state, setState] = useState({ total: totalLike, like: like > 0 });
  return (
    <div
      className={clsx(
        `btn flex  items-center justify-center gap-1 rounded-lg pt-0.5 text-lg hover:scale-105 
            ${state.like ? likedClassName : unlikedClassName}
            `,
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        setState(state.like ? { total: state.total - 1, like: false } : { total: state.total + 1, like: true });
        state.like ? onLike?.() : onResetlike?.();
      }}
    >
      {state.like ? <AiFillLike className="-mt-1" /> : <AiOutlineLike className="-mt-1" />} {state.total}
    </div>
  );
};

interface WithDislikeProps {
  className?: string;
  like: number;
  totalLike: number;
  onLike?: () => void;
  onResetlike?: () => void;
  onDislike?: () => void;
}
const WithDislike = ({ className, like, totalLike, onLike, onResetlike, onDislike }: WithDislikeProps) => {
  const { l } = usePage();
  const [state, setState] = useState({ total: totalLike, like: like > 0, dislike: like < 0 });
  return (
    <div className={clsx(`flex gap-2`, className)}>
      <button
        className={`btn mx-1 flex w-auto items-center gap-2 ${state.like ? "btn-primary" : "btn-outline"}`}
        onClick={() => {
          setState(
            state.like
              ? { total: state.total - 1, like: false, dislike: false }
              : { total: state.total + 1, like: true, dislike: false }
          );
          !state.dislike && state.like ? onResetlike?.() : onLike?.();
        }}
      >
        {state.like ? <AiFillLike /> : <AiOutlineLike />}
        <span className="ml-1 flex gap-2">
          {l("shared.like")} {state.total}
        </span>
      </button>
      <button
        className={`btn btn-square ${state.dislike ? "btn-primary" : "btn-outline"}`}
        onClick={() => {
          setState(
            state.dislike
              ? { total: state.total, like: false, dislike: false }
              : { total: state.total - (state.like ? 1 : 0), like: false, dislike: true }
          );
          !state.like && state.dislike ? onResetlike?.() : onDislike?.();
        }}
      >
        {state.dislike ? <AiFillDislike /> : <AiOutlineDislike />}
      </button>
    </div>
  );
};
Like.WithDislike = WithDislike;
