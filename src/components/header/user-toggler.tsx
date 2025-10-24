'use client';

import Link from 'next/link';
import {
  ChevronDownIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/16/solid';
import {
  BookmarkIcon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Info, TrophyIcon, UserStar, Vote } from 'lucide-react';
import { User } from '@/lib/server/constants';
import { SubmitButton } from '../ui/submit-button';
import { useActionState } from 'react';
import { logoutAction } from '@/lib/logout';
import { DOMAIN_URLS } from '@/lib/constants';
import { RankIcon } from '../ranking/rank-icon';
import RanksDialog from '../ranking/ranks-dialog';
import { getCurrentRank } from '../ranking/ranks';
import { Linkify } from '@/lib/utils';

type UserTogglerType = {
  user: User;
};

const initialState = {
  message: '',
};

const getShadowColor = (rankName: string) => {
  if (rankName.startsWith('New Comer')) {
    return 'drop-shadow-[0_0_8px_rgba(13,148,136,0.6)]'; // teal
  } else if (rankName.startsWith('Contributor')) {
    return 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'; // yellow
  } else if (rankName.startsWith('Leader')) {
    return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]'; // red
  } else if (rankName.startsWith('Ambassador')) {
    return 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'; // blue
  } else {
    return 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'; // default
  }
};

export default function UserToggler({ user }: UserTogglerType) {
  const [, action] = useActionState(logoutAction, initialState);

  const rank = getCurrentRank(user.ip);
  const rankProgress = Math.floor((user.ip / rank.maxPoints) * 100);

  return (
    <div className="w-fit">
      <DropdownMenu>
        <DropdownMenuTrigger className="relative inline-flex cursor-pointer items-center gap-2 rounded-md border border-zinc-600 bg-transparent px-2 py-1.5 text-sm/6 text-white hover:bg-zinc-800">
          <Avatar className="h-6 w-6 rounded-full">
            {user.avatar && <AvatarImage src={user.avatar} />}
            <AvatarFallback className="bg-primaryColor text-xs text-yellow-900 uppercase">
              {user.fullName.split(' ')[0][0]}
              {user.fullName.split(' ')[1][0]}
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon className="size-4 fill-white" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="max-w-[280px]" align="end">
          <DropdownMenuLabel className="flex items-center py-2 text-sm text-zinc-600">
            <Info className="mr-2 inline h-4 w-4" />
            <span className="block font-normal">@{user.username}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="mb-2" />
          <RanksDialog>
            <div className="mb-2 block w-full cursor-pointer rounded-sm bg-gradient-to-br from-zinc-900 to-zinc-700 py-2">
              <div className="flex min-w-[250px] items-center justify-between px-2 text-white">
                <div className="flex items-center gap-2">
                  <div className={getShadowColor(rank.name)}>
                    <RankIcon id={Linkify(rank.name)} height={32} width={32} />
                  </div>
                  <div className="text-xs">
                    {rank.name} ({rankProgress}%)
                  </div>
                </div>
                <QuestionMarkCircleIcon className="size-4 text-white" />
              </div>
            </div>
          </RanksDialog>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link
                href={`/${user.username}/saved-articles`}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 data-[focus]:bg-zinc-100"
              >
                <BookmarkIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
                Saved Articles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/${user.username}/achievements`}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 data-[focus]:bg-zinc-100"
              >
                <TrophyIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
                Achievements
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/${user.username}/comments`}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 data-[focus]:bg-zinc-100"
              >
                <ChatBubbleBottomCenterTextIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
                My Comments
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/${user.username}/reviews`}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 data-[focus]:bg-zinc-100"
              >
                <UserStar className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
                My Reviews
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/${user.username}/votes`}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 data-[focus]:bg-zinc-100"
              >
                <Vote className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4" />
                My Votes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={DOMAIN_URLS.ACCOUNT()}
                target="_blank"
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 data-[focus]:bg-zinc-100"
              >
                <Cog6ToothIcon className="group-hover:text-primaryColor group-hover:fill-primaryColor size-4 text-black" />
                Account Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <div className="my-2 w-full border-b border-zinc-200" />
          <DropdownMenuGroup className="pb-2">
            <form action={action} className="flex justify-end">
              <SubmitButton
                variant="outline"
                className="cursor-pointer text-sm"
              >
                Logout
              </SubmitButton>
            </form>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
