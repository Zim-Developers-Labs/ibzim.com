'use client';

import { useActionState, useEffect, useState } from 'react';
import { ibZimAnswers, Question, questions } from './data';
import { Answer } from '@/server/db/schema';
import { User } from 'lucia';
import { demoAnswers } from '@/data/demo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  ThumbsUp,
  Verified,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addAnswer, getAnswerLikes, toggleAnswerLike } from './actions';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ToolFAQs({
  tool,
  user,
  dbAnswers,
}: {
  tool: string;
  user: User | null;
  dbAnswers: Answer[] | null;
}) {
  const toolQuestions = questions.filter((q) => q.tool === tool);

  // FAQ state
  const [faqQuestions, setFaqQuestions] = useState<Question[]>(toolQuestions);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [isAddAnswerDialogOpen, setIsAddAnswerDialogOpen] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState<{
    [key: string]: number;
  }>({});
  const [loadingMoreAnswers, setLoadingMoreAnswers] = useState<{
    [key: string]: boolean;
  }>({});

  const allToolAnswers: Answer[] = [
    ...ibZimAnswers,
    ...demoAnswers,
    ...dbAnswers!,
  ];

  const handleShowMoreAnswers = async (questionId: string) => {
    setLoadingMoreAnswers((prev) => ({ ...prev, [questionId]: true }));

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setVisibleAnswers((prev) => ({
      ...prev,
      [questionId]: (prev[questionId] || 3) + 5,
    }));

    setLoadingMoreAnswers((prev) => ({ ...prev, [questionId]: false }));
  };

  const getVisibleAnswerCount = (questionId: string) => {
    return visibleAnswers[questionId] || 3;
  };

  // Add answer

  const [state, formAction] = useActionState(addAnswer, null);

  useEffect(() => {
    if (state?.formError) {
      toast.error(state.formError);
    }

    if (state?.fieldError) {
      Object.values(state.fieldError).forEach((error) => {
        toast.error(error);
      });
    }
  }, [state]);

  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-liked'>(
    'most-liked',
  );

  const sortAnswers = (
    answers: Answer[],
    sortType: 'newest' | 'oldest' | 'most-liked',
  ) => {
    const sorted = [...answers];
    switch (sortType) {
      case 'newest':
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case 'oldest':
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case 'most-liked':
        return sorted.sort((a, b) => b.likesCount - a.likesCount);
      default:
        return sorted;
    }
  };

  return (
    <section>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          <CardDescription className="mb-4">
            Get answers to common travel and fuel-related questions from our
            community
          </CardDescription>
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Sort by:</Label>
            <Select
              value={sortBy}
              onValueChange={(value: 'newest' | 'oldest' | 'most-liked') =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="most-liked">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqQuestions.map((question) => {
            const visibleCount = getVisibleAnswerCount(question.id);
            const questionAnswers = allToolAnswers.filter(
              (answer) => answer.questionId === question.id,
            );
            const sortedAnswers = sortAnswers(questionAnswers, sortBy);
            const visibleAnswers = sortedAnswers.slice(0, visibleCount);
            const hasMoreAnswers = questionAnswers.length > visibleCount;

            if (state?.done) {
              setNewAnswer('');
              state.done = false;

              const newAnswerObj: Answer = state.answer!;

              setFaqQuestions((prev) =>
                prev.map((question) =>
                  question.id === selectedQuestionId
                    ? {
                        ...question,
                        answers: [...questionAnswers, newAnswerObj],
                      }
                    : question,
                ),
              );

              setNewAnswer('');
              setIsAddAnswerDialogOpen(false);
              setSelectedQuestionId(null);
              // setComments([state.comment, ...updatedComments]);
              // onCommentAdded();
            }

            return (
              <div key={question.id} className="space-y-4">
                <div className="flex flex-col items-start justify-between md:flex-row">
                  <h3 className="pr-4 text-base leading-relaxed font-semibold">
                    {question.question}
                  </h3>
                  <div className="my-4 flex items-center gap-2 md:my-0">
                    {user ? (
                      <Dialog
                        open={
                          isAddAnswerDialogOpen &&
                          selectedQuestionId === question.id
                        }
                        onOpenChange={(open) => {
                          setIsAddAnswerDialogOpen(open);
                          if (open) {
                            setSelectedQuestionId(question.id);
                          } else {
                            setSelectedQuestionId(null);
                            setNewAnswer('');
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button className="shrink-0 bg-zinc-900">
                            <Plus className="mr-1 h-3 w-3" />
                            Add Answer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Your Answer</DialogTitle>
                            <DialogDescription>
                              Share your knowledge about: {question.question}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-answer">Your Answer</Label>
                              <Textarea
                                id="new-answer"
                                placeholder="Share your experience, tips, or knowledge..."
                                value={newAnswer}
                                onChange={(e) => setNewAnswer(e.target.value)}
                                className="min-h-[120px]"
                              />
                            </div>
                          </div>
                          <DialogFooter className="flex-col gap-2 sm:flex-row">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsAddAnswerDialogOpen(false);
                                setSelectedQuestionId(null);
                                setNewAnswer('');
                              }}
                            >
                              Cancel
                            </Button>
                            <form action={formAction}>
                              <input
                                type="hidden"
                                name="questionId"
                                value={question.id}
                              />
                              <input
                                type="hidden"
                                name="userName"
                                value={user.fullName}
                              />
                              <input type="hidden" name="tool" value={tool} />
                              <input
                                type="hidden"
                                name="answerText"
                                value={newAnswer.trim()}
                              />

                              <SubmitButton type="submit">
                                Submit Answer
                              </SubmitButton>
                            </form>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        className="group bg-primaryColor shrink-0 text-white"
                        onClick={() => (window.location.href = '/sign-up')}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        <span className="inline group-hover:hidden">
                          Add Answer
                        </span>
                        <span className="hidden group-hover:inline">
                          Login/Signup
                        </span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Answers - Horizontal Scroll */}
                <div className="relative" data-question-id={question.id}>
                  <div
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {visibleAnswers.map((answer, index) => (
                      <FaqAnswer
                        key={answer.id}
                        index={index}
                        answer={answer}
                        user={user}
                      />
                    ))}

                    {/* Show More Button Card */}
                    {hasMoreAnswers && (
                      <Card className="w-80 flex-shrink-0 border-dashed border-gray-300 bg-gray-50">
                        <CardContent className="flex h-full min-h-[200px] items-center justify-center p-4">
                          <div className="space-y-3 text-center">
                            <div className="text-sm text-gray-600">
                              {questionAnswers.length - visibleCount} more
                              answer
                              {questionAnswers.length - visibleCount !== 1
                                ? 's'
                                : ''}
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => handleShowMoreAnswers(question.id)}
                              disabled={loadingMoreAnswers[question.id]}
                              className="w-full"
                            >
                              {loadingMoreAnswers[question.id] ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                'Show More'
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Scroll Indicators */}
                  {visibleAnswers.length > 1 && (
                    <div className="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-between">
                      <div className="pointer-events-auto rounded-full bg-white/80 p-1 shadow-sm">
                        <ChevronLeft className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="pointer-events-auto rounded-full bg-white/80 p-1 shadow-sm">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Answer Count */}
                <div className="text-center text-xs text-gray-500">
                  Showing {visibleCount} of {questionAnswers.length} answer
                  {questionAnswers.length !== 1 ? 's' : ''} • Scroll
                  horizontally to see more
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
}

function FaqAnswer({ index, answer, user }: any) {
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    getAnswerLikes(answer.id, user?.id).then((result: any) => {
      if (result.success) {
        setLikesCount(result.likes);
        setUserLiked(result.userLiked);
      }
    });
  }, [answer.id, user?.id]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const result: any = await toggleAnswerLike(answer.id, user!.id);

    if (result.success) {
      setLikesCount(result.likes);
      setUserLiked(result.userLiked);
    }
    setIsLiking(false);
  };

  return (
    <Card
      key={answer.id}
      className={`w-80 flex-shrink-0 ${
        answer.isVerified ? 'border-green-200 bg-green-50' : 'border-gray-200'
      }`}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Author and Verification */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{answer.userName}</span>
              {answer.isVerified && (
                <div className="flex items-center gap-1">
                  <Verified className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">Verified</span>
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {answer.updatedAt?.toLocaleDateString()}
            </span>
          </div>

          {/* Answer Content */}
          <p className="text-sm leading-relaxed text-gray-700">
            {answer.content}
          </p>

          {/* Like Button */}
          <div className="flex items-center justify-between border-t pt-2">
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={isLiking}
                onClick={handleLike}
                className={`h-8 px-2 ${!isLiking ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed'}`}
              >
                {userLiked ? (
                  <Icons.handThumbUpSolid className="text-primaryColor mr-1 h-3 w-3" />
                ) : (
                  <ThumbsUp className="mr-1 h-3 w-3" />
                )}
                <span className="text-xs">{likesCount}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toast.error('Login/Signup first to like answer');
                }}
                className="h-8 px-2"
              >
                <ThumbsUp className="mr-1 h-3 w-3" />
                <span className="text-xs">{likesCount}</span>
              </Button>
            )}
            {index === 0 && answer.isVerified && (
              <span className="text-xs font-medium text-green-600">
                Official Answer
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
