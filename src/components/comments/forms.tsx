'use client';

import { toast } from 'sonner';
import { Icons } from '../icons';
import { SignToggler } from '../header/sign-toggler';

export function MainForm() {
  return (
    <form className="relative mb-8">
      <div className="focus-within:ring-primaryColor overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-300 ring-inset focus-within:ring-2">
        <label htmlFor="commentText" className="sr-only">
          Add your comment
        </label>
        <textarea
          rows={1}
          name="commentText"
          id="commentText"
          className="block w-full resize-none border-0 bg-transparent py-2 text-gray-900 placeholder:text-sm placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          placeholder="Add your comment..."
          minLength={2}
          maxLength={500}
          onInput={(e: any) => {
            e.target.style.height = 'auto'; // Reset height
            e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height to content
          }}
        />

        {/* Spacer element to match the height of the toolbar */}
        <div className="py-2" aria-hidden="true">
          {/* Matches height of button in toolbar (1px border + 36px content height) */}
          <div className="py-px">
            <div className="h-12" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toast.info('Login/Signup first to clap for article');
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:-translate-y-1 hover:text-gray-500"
          >
            <Icons.clapHands className="h-5 w-5 text-gray-600" />
            <span className="sr-only">Clap hands for article</span>
          </button>
          <div
            aria-label="Article Claps Count"
            className="text-sm text-gray-500"
          >
            0
          </div>
        </div>
        <div className="flex-shrink-0">
          <SignToggler linkText="Login to comment" />
        </div>
      </div>
    </form>
  );
}
