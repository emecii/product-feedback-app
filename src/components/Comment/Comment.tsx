import { useState } from "react";
import { Comment } from "src/interfaces/Feedback";
import AvatarTestImage from "@assets/avatar-test.png";
import CommentReply from "./CommentReply";
import CommentHeader from "./CommentHeader";
import AddComment from "@components/AddComment";
import styles from "./comment.module.css";

interface CommentProps {
  comment: Comment;
  feedbackId: string;
  className?: string;
}

function Comment({ comment, feedbackId, className = "" }: CommentProps) {
  const { user, content, replies = [] } = comment;
  const [replyFormVisible, setReplyFormVisible] = useState(false);

  function toggleReply() {
    setReplyFormVisible(!replyFormVisible);
  }

  return (
    <>
      <div className={`${styles.comment} ${className}`}>
        <img src={AvatarTestImage} alt={user.name} />
        <CommentHeader user={user} onClickReply={toggleReply} />
        <p>{content}</p>
        <div
          className={styles.replyForm}
          style={{ display: replyFormVisible ? "block" : "none" }}
        >
          <AddComment
            feedbackId={feedbackId}
            commentId={comment.id}
            onCommentSubmitted={() => setReplyFormVisible(false)}
          />
        </div>
      </div>
      {replies.length > 0 ? (
        <div className={styles.replies}>
          {replies.map((reply) => {
            return (
              <CommentReply
                key={reply.id}
                reply={reply}
                feedbackId={feedbackId}
                commentId={comment.id}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
}

export default Comment;
