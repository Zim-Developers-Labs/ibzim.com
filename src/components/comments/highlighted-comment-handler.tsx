"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CommentModal from "./comment-modal";
import { getCommentById } from "./action";

export default function HighlightedCommentHandler({
  article,
  dislikesCount,
  handleReaction,
  isLoading,
  likesCount,
  userReaction,
}: {
  article: any;
  handleReaction: any;
  isLoading: boolean;
  userReaction: any;
  likesCount: any;
  dislikesCount: any;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams: any = useSearchParams();
  const highlightedCommentId = searchParams.get("highlight_comment_id");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment]: any = useState();

  useEffect(() => {
    if (highlightedCommentId) {
      fetchComment(highlightedCommentId);
    }
  }, [highlightedCommentId]);

  const fetchComment = async (commentId: string) => {
    const result = await getCommentById(commentId);
    if (result.error) {
      setError(result.error);
    } else {
      setComment(result.comment);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Remove the highlight_comment_id parameter from the URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("highlight_comment_id");

    // Use replace to update the URL without adding a new history entry
    router.replace(
      `${window.location.pathname}?${newSearchParams.toString()}`,
      { scroll: false }
    );
  };

  if (highlightedCommentId) {
    return (
      <CommentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        comment={comment}
        error={error}
        article={article}
        dislikesCount={dislikesCount}
        handleReaction={handleReaction}
        isLoading={isLoading}
        likesCount={likesCount}
        userReaction={userReaction}
      />
    );
  }

  return null;
}
