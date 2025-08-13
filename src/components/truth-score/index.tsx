import './styles.css';
import { Lock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Icons } from '../icons';

export default function ProfileTruthScore({
  score,
}: {
  score: number;
  type?: 'article' | 'profile';
}) {
  const getScoreClass = () => {
    if (score > 75) return 'text-green-600';
    if (score > 0) return 'text-yellow-600';
    return 'text-zinc-900';
  };

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <div className="cursor-pointer">
            <div className={` ${getScoreClass()} flex items-center gap-2`}>
              <span className="text-xs">Truth Score</span>
              {score < 75 && (
                <Icons.shieldExclamationSolid
                  strokeWidth={1.5}
                  className="size-5"
                />
              )}
              {score > 74 && (
                <Icons.shieldCheckSolid strokeWidth={1.5} className="size-5" />
              )}
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[350px]">
          <DialogTitle className="sr-only">Truth Score Overview</DialogTitle>
          <div>
            <div className="mb-4 text-lg font-medium">Profile Truth Score</div>
            <div className="mb-4 flex items-center gap-2">
              {score < 75 && (
                <ShieldAlert
                  strokeWidth={1.5}
                  className={`size-12 ${getScoreClass()}`}
                />
              )}
              {score > 74 && (
                <ShieldCheck
                  strokeWidth={1.5}
                  className={`size-12 ${getScoreClass()}`}
                />
              )}
              {score > 74 ? (
                <div>
                  <span className={`text-sm ${getScoreClass()}`}>{score}%</span>{' '}
                  of information on this page has been verified.
                </div>
              ) : score > 0 ? (
                <div className="text-sm">
                  We are in the process of verifying information in this
                  article.
                </div>
              ) : (
                <div className="text-sm">
                  We have not yet started information verfication in this
                  article.
                </div>
              )}
            </div>
            <div className="mb-4 rounded-md bg-green-600 p-2 text-sm text-white">
              Soon you will be able to rate truth scores.
            </div>
            {/* <form className="truth-score-input-container">
                  <div className="truth-score-input-wrapper">
                    <input
                      className="truth-score-input"
                      placeholder="Your email ..."
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <button className="truth-score-submit-button">
                    Join&nbsp;Waitlist
                  </button>
                </form> */}
            <div className="inline-flex gap-2 text-xs text-zinc-700">
              <Lock className="inline size-5" />
              <span>
                Providing true and verified information is the core of our{' '}
                <a
                  href="/policies/terms"
                  className="inline underline"
                  target="_blank"
                >
                  principals
                </a>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
