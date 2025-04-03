'use client';

import { ExternalLink, TriangleAlert, Users } from 'lucide-react';
import Container from '../container';
import Comments from './comments';
import MonthlyPageViews from './page-views';

export default function CommentSection() {
  return (
    <Container className="max-w-screen-md py-10 md:py-20">
      <aside id="commentSection">
        <div className="mb-8 flex items-baseline justify-between sm:items-center">
          <h2 className="flex flex-col items-baseline gap-2 text-2xl font-bold sm:flex-row">
            Conversation
            <span className="box text-base font-normal">(0 Comments)</span>
          </h2>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-fit text-green-600" />
            <div className="text-sm">
              <MonthlyPageViews />
            </div>
          </div>
        </div>
        <div className="mb-8 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <TriangleAlert
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <div className="text-sm text-yellow-700">
                IB commenting system is currently being updated, we apologise
                for the inconvenience. Thank you for your patience, you can
                comment{' '}
                <div
                  onClick={() =>
                    window.open('https://wa.me/+263717238876', '_blank')
                  }
                  className="inline cursor-pointer font-medium text-yellow-700 underline hover:text-yellow-600"
                >
                  on Whatsapp.
                  <ExternalLink className="inline h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-start space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0">
            <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
              <svg
                className="h-full w-full text-gray-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </div>
          <div className="w-full min-w-0 flex-1">
            <Comments />
          </div>
        </div>
      </aside>
    </Container>
  );
}
