'use client';

import { ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MainForm } from './forms';
import { useEffect, useState } from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '../ui/command';
import { CommentWithChildren } from './comments-lib';
import { User } from 'lucia';
import Comment from './comment';

export default function Comments({
  comments,
  user,
  onCommentAdded,
  articleId,
  article,
  claps,
  handleClap,
  isClapping,
  userClapped,
}: {
  comments?: CommentWithChildren[];
  user?: User;
  articleId: string;
  onCommentAdded: () => void;
  article: any;
  handleClap: any;
  isClapping: boolean;
  userClapped: boolean;
  claps: any;
}) {
  const [value, setValue] = useState(sortTypes[0].value);
  const [updatedComments, setComments] = useState(comments);
  const [visibleCount, setVisibleCount] = useState(10); // initial count of comments to display

  // Sort comments based on the selected sort type
  useEffect(() => {
    if (comments) {
      const sortedComments = [...comments];
      switch (value) {
        case 'best':
          sortedComments.sort(
            (a, b) => (b.likesCount || 0) - (a.likesCount || 0),
          );
          break;
        case 'recent':
          sortedComments.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case 'older':
          sortedComments.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          break;
      }
      setComments(sortedComments);
    }
  }, [value, comments]);

  // Function to load more comments
  const loadMoreComments = () => {
    setVisibleCount((prev) => prev + 5); // increase the visible count by 5
  };

  const handleCommentDeleted = (deletedCommentId: string) => {
    setComments((prevComments) => {
      const removeCommentRecursively = (
        comments: CommentWithChildren[],
      ): CommentWithChildren[] => {
        return comments.filter((c) =>
          c.commentId !== deletedCommentId
            ? {
                ...c,
                children: c.children
                  ? removeCommentRecursively(c.children)
                  : [],
              }
            : false,
        );
      };

      return removeCommentRecursively(prevComments || []);
    });
  };

  return (
    <div>
      <MainForm
        user={user}
        articleId={articleId}
        setComments={setComments}
        updatedComments={updatedComments}
        onCommentAdded={onCommentAdded}
        claps={claps}
        handleClap={handleClap}
        isClapping={isClapping}
        userClapped={userClapped}
      />
      <div>
        <SortFilter value={value} setValue={setValue} />
      </div>
      <ul>
        {/* Show only the first 'visibleCount' comments */}
        {updatedComments
          ?.slice(0, visibleCount)
          .map((comment, i) => (
            <Comment
              onCommentDeleted={handleCommentDeleted}
              i={i}
              key={comment.commentId}
              comment={comment}
              articleId={articleId}
              parentCommentId={comment.parentCommentId!}
              user={user}
              setComments={setComments}
              updatedComments={updatedComments}
              onCommentAdded={onCommentAdded}
              article={article}
            />
          ))}
      </ul>
      {/* Load more button, visible only if there are more comments to show */}
      {visibleCount < updatedComments!?.length && (
        <button
          onClick={loadMoreComments}
          className="text-primaryColor mt-4 p-2"
        >
          Load more
        </button>
      )}
    </div>
  );
}

const sortTypes = [
  { value: 'recent', label: 'Recent' },
  { value: 'best', label: 'Best' },
  { value: 'older', label: 'Older' },
];

function SortFilter({ value, setValue }: { value: any; setValue: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="mb-4 w-fit">
        <div className="flex items-center gap-2">
          <div className="text-sm text-zinc-700">Sort By:</div>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="text-primaryColor w-fit justify-between"
          >
            {value
              ? sortTypes.find((framework) => framework.value === value)?.label
              : 'Select framework...'}
            <ChevronsUpDown className="text-zinc-800 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" side="bottom">
        <Command>
          <CommandList>
            <CommandGroup>
              {sortTypes.map((sort) => (
                <CommandItem
                  key={sort.value}
                  value={sort.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className={`group relative cursor-default py-2 pr-4 pl-8 text-gray-900 select-none`}
                >
                  <span
                    className={`block w-fit truncate ${sort.value === value && 'font-bold text-white'}`}
                  >
                    {sort.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
