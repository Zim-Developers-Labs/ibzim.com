'use client';

import { useState } from 'react';
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

export default function ToolFAQs({
  tool,
  user,
}: {
  tool: string;
  user: User | null;
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

  const allToolAnswers: Answer[] = [...ibZimAnswers, ...demoAnswers];

  const handleAddAnswer = () => {
    if (!selectedQuestionId || !newAnswer.trim()) {
      return;
    }

    const newAnswerObj: Answer = {
      id: `answer-${Date.now()}`,
      content: newAnswer.trim(),
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user!.id,
      questionId: selectedQuestionId,
    };

    setFaqQuestions((prev) =>
      prev.map((question) =>
        question.id === selectedQuestionId
          ? {
              ...question,
              answers: [
                ...allToolAnswers.filter(
                  (answer) => answer.questionId === question.id,
                ),
                newAnswerObj,
              ],
            }
          : question,
      ),
    );

    // Reset form
    setNewAnswer('');
    setIsAddAnswerDialogOpen(false);
    setSelectedQuestionId(null);
  };

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

  return (
    <section>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Frequently Asked Questions</CardTitle>
          <CardDescription>
            Get answers to common travel and fuel-related questions from our
            community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqQuestions.map((question) => {
            const visibleCount = getVisibleAnswerCount(question.id);
            const questionAnswers = allToolAnswers.filter(
              (answer) => answer.questionId === question.id,
            );
            const visibleAnswers = questionAnswers.slice(0, visibleCount);
            const hasMoreAnswers = questionAnswers.length > visibleCount;

            return (
              <div key={question.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="pr-4 text-base leading-relaxed font-semibold">
                    {question.question}
                  </h3>
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
                      <Button variant="outline" size="sm" className="shrink-0">
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
                        <Button onClick={handleAddAnswer}>Submit Answer</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Answers - Horizontal Scroll */}
                <div className="relative" data-question-id={question.id}>
                  <div
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {visibleAnswers.map((answer, index) => (
                      <Card
                        key={answer.id}
                        className={`w-80 flex-shrink-0 ${
                          answer.isVerified
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Author and Verification */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {answer.userId}
                                </span>
                                {answer.isVerified && (
                                  <div className="flex items-center gap-1">
                                    <Verified className="h-4 w-4 text-green-600" />
                                    <span className="text-xs text-green-600">
                                      Verified
                                    </span>
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                              >
                                <ThumbsUp className="mr-1 h-3 w-3" />
                                <span className="text-xs">0</span>
                              </Button>
                              {index === 0 && answer.isVerified && (
                                <span className="text-xs font-medium text-green-600">
                                  Official Answer
                                </span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
