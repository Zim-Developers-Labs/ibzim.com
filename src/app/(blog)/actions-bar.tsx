import Container from '@/components/container';
import { Icons } from '@/components/icons';
import { User } from 'lucia';
import { Bookmark, MessageSquareText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ActionsBar({
  user,
  handleClap,
  isClapping,
  userClapped,
  claps,
  allComments,
  handleSaveArticle,
  isSaving,
  isSaved,
  article,
  ProfileTruthScore,
}: {
  user: User | null;
  handleClap: () => Promise<void>;
  isClapping: boolean;
  userClapped: boolean;
  claps: number;
  allComments: any[] | undefined;
  handleSaveArticle: () => void;
  isSaving: boolean;
  isSaved: boolean;
  article: any;
  ProfileTruthScore: any;
}) {
  return (
    <div className="sticky top-0 z-50 mb-8 flex justify-between border border-t border-r-0 border-b border-l-0 border-gray-200 bg-white px-2 py-4">
      <Container className="flex items-center justify-between gap-4">
        <div className="flex items-center text-gray-600 sm:gap-2">
          {user ? (
            <button
              onClick={handleClap}
              disabled={isClapping || !user}
              className={`${!isClapping && 'cursor-pointer hover:-translate-y-1'}`}
            >
              {userClapped ? (
                <Icons.clapHandsSolid className="text-primaryColor h-5 w-fit" />
              ) : (
                <Icons.clapHands className="h-5 w-fit" title="Clap" />
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                toast.error('Login/Signup first to clap for article');
              }}
            >
              <Icons.clapHands className="h-5 w-fit" title="Clap" />
            </button>
          )}
          <span className="text-xs" aria-label="Article Claps Count">
            {isClapping ? (userClapped ? 'removing...' : 'clapping...') : claps}
          </span>
          <Link
            href="#commentSection"
            className="group flex items-center gap-2"
          >
            <MessageSquareText
              strokeWidth={1.5}
              className="ml-4 h-5 w-fit cursor-pointer group-hover:-translate-y-1"
            />
            <span className="text-xs" aria-label="Article Comments Count">
              {allComments ? allComments.length : 0}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="group flex cursor-pointer items-center gap-2 text-gray-600"
            onClick={handleSaveArticle}
          >
            <span className="text-xs">
              {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
            </span>
            {isSaved ? (
              <Bookmark className="fill-primaryColor text-primaryColor h-5 w-fit transition-transform group-hover:-translate-y-1" />
            ) : (
              <Bookmark className="h-5 w-fit transition-transform group-hover:-translate-y-1" />
            )}
          </div>
          <ProfileTruthScore
            score={article.truthScore ? article.truthScore : 0}
            type="article"
          />
        </div>
      </Container>
    </div>
  );
}
