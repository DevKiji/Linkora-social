"use client";

import { useEffect, useReducer, useRef } from "react";

export interface Profile {
  address: string;
  username?: string;
  followerCount?: number;
  follower_count?: number;
  isFollowing?: boolean;
}

interface ProfileCardProps {
  profile: Profile;
}

function formatAddress(address: string): string {
  return address.length > 16 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
}

/** States the follow button cycles through. */
type FollowState =
  | "idle-follow"       // showing "Follow"
  | "transitioning-in"  // animating Follow → Following (tick animates in)
  | "idle-following"    // showing "Following ✓"
  | "confirming-unfollow" // brief "Unfollow?" confirmation
  | "transitioning-out"; // animating Following → Follow

type FollowAction =
  | { type: "CLICK_FOLLOW" }
  | { type: "CLICK_UNFOLLOW" }
  | { type: "TRANSITION_DONE" }
  | { type: "CONFIRM_UNFOLLOW" }
  | { type: "CANCEL_CONFIRM" };

function followReducer(state: FollowState, action: FollowAction): FollowState {
  switch (action.type) {
    case "CLICK_FOLLOW":
      return state === "idle-follow" ? "transitioning-in" : state;
    case "TRANSITION_DONE":
      if (state === "transitioning-in") return "idle-following";
      if (state === "transitioning-out") return "idle-follow";
      return state;
    case "CLICK_UNFOLLOW":
      return state === "idle-following" ? "confirming-unfollow" : state;
    case "CONFIRM_UNFOLLOW":
      return state === "confirming-unfollow" ? "transitioning-out" : state;
    case "CANCEL_CONFIRM":
      return state === "confirming-unfollow" ? "idle-following" : state;
    default:
      return state;
  }
}

/**
 * ProfileCard — displays a user profile with a smooth follow/unfollow button.
 *
 * Transition behaviour:
 * - Follow → Following: button label cross-fades with a tick icon animating in.
 * - Following → (confirm) → Follow: a brief "Unfollow?" confirmation is shown,
 *   then reverses the animation on confirm.
 * - All transitions use CSS only (no external animation library).
 * - Respects `prefers-reduced-motion`: transitions are skipped entirely.
 */
export function ProfileCard({ profile }: ProfileCardProps) {
  const initialState: FollowState = profile.isFollowing
    ? "idle-following"
    : "idle-follow";

  const [followState, dispatch] = useReducer(followReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelConfirmRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const followers = profile.followerCount ?? profile.follower_count ?? 0;
  const displayName = profile.username || formatAddress(profile.address);

  // Drive the transition timers.
  useEffect(() => {
    if (followState === "transitioning-in" || followState === "transitioning-out") {
      timerRef.current = setTimeout(() => {
        dispatch({ type: "TRANSITION_DONE" });
      }, 280);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [followState]);

  // Auto-dismiss the unfollow confirmation after 2.5 s if no action taken.
  useEffect(() => {
    if (followState === "confirming-unfollow") {
      cancelConfirmRef.current = setTimeout(() => {
        dispatch({ type: "CANCEL_CONFIRM" });
      }, 2500);
    }
    return () => {
      if (cancelConfirmRef.current) clearTimeout(cancelConfirmRef.current);
    };
  }, [followState]);

  const handleButtonClick = () => {
    if (followState === "idle-follow") dispatch({ type: "CLICK_FOLLOW" });
    else if (followState === "idle-following") dispatch({ type: "CLICK_UNFOLLOW" });
    else if (followState === "confirming-unfollow") dispatch({ type: "CONFIRM_UNFOLLOW" });
  };

  const isFollowingState =
    followState === "idle-following" ||
    followState === "confirming-unfollow" ||
    followState === "transitioning-out";

  const isAnimating =
    followState === "transitioning-in" || followState === "transitioning-out";

  // --- Button label content ---
  let label: React.ReactNode;
  if (followState === "confirming-unfollow") {
    label = (
      <span className="follow-btn-label follow-btn-label--confirm">Unfollow?</span>
    );
  } else if (isFollowingState) {
    label = (
      <span className="follow-btn-label">
        <TickIcon className="follow-btn-tick" aria-hidden="true" />
        Following
      </span>
    );
  } else {
    label = <span className="follow-btn-label">Follow</span>;
  }

  return (
    <article className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 rounded-lg border border-[var(--border)] bg-[var(--muted)] p-3 md:p-5">
      {/* Avatar */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-900/50 text-lg font-bold text-violet-200">
        {displayName.slice(0, 1).toUpperCase()}
      </div>

      {/* Profile info */}
      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold text-[var(--foreground)]">{displayName}</h2>
        <p className="truncate text-sm text-[var(--text-muted)]" title={profile.address}>
          {formatAddress(profile.address)}
        </p>
        <p className="text-sm text-[var(--text-muted)]">{followers} followers</p>
      </div>

      {/* Follow / Unfollow button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isAnimating}
        className={`follow-btn w-full sm:w-auto shrink-0 ${
          followState === "confirming-unfollow"
            ? "follow-btn--confirm"
            : isFollowingState
            ? "follow-btn--following"
            : "follow-btn--follow"
        }`}
        aria-label={
          followState === "confirming-unfollow"
            ? `Confirm unfollow ${displayName}`
            : isFollowingState
            ? `Unfollow ${displayName}`
            : `Follow ${displayName}`
        }
        aria-pressed={isFollowingState}
      >
        {label}
      </button>
    </article>
  );
}

function TickIcon({ className }: { className?: string; "aria-hidden"?: "true" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="2 7 5.5 10.5 12 3.5" />
    </svg>
  );
}
