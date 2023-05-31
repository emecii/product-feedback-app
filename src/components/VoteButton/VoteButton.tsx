import { SubmitOptions } from "react-router-dom";
import { ReactComponent as ChevronIcon } from "@assets/chevron-icon.svg";
import styles from "./voteButton.module.css";
import { useFetcher } from "react-router-dom";

interface VoteButtonProps {
  className?: string;
  feedbackId: number;
  count?: number;
  upVoted?: boolean;
}

function VoteButton({
  className = "",
  feedbackId,
  count = 0,
  upVoted = false,
}: VoteButtonProps) {
  const fetcher = useFetcher();
  let checked = upVoted;
  let voteCount = count;

  if (fetcher.formData) {
    const formUpvotes = Number(fetcher.formData.get("upvotes"));
    checked = formUpvotes > count;
    voteCount = formUpvotes;
  }

  return (
    <label className={`${styles.voteButton} ${className}`}>
      <ChevronIcon className={styles.upVoteIcon} />
      <input
        name="upvotes"
        type="checkbox"
        checked={checked}
        value={voteCount}
        onClick={(event) => event.stopPropagation()}
        onChange={() => {
          const upvotes = upVoted ? count - 1 : count + 1;
          // For some reason RR6 requires all form data to be strings
          fetcher.submit(
            {
              upVoted: (upvotes > count).toString(),
              upvotes: upvotes.toString(),
              feedbackId: feedbackId.toString(),
            },
            { method: "put" }
          );
        }}
        aria-checked={checked}
      />
      <b>{voteCount}</b>
    </label>
  );
}

export default VoteButton;
