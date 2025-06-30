'use client';

import {
  Ellipsis,
  Eye,
  Info,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  SquarePen,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import { ArticleType } from '@/types';
import { MArticleType } from '@/data/m-articles';

export function ArticleDropdownMenu({
  article,
}: {
  article: ArticleType;
  mArticle?: MArticleType;
}) {
  const { isMobile } = useSidebar();

  function generateAricleLink(): string {
    const domain = {
      article:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5001'
          : 'https://www.ibzim.com',
      'sa.article':
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5002'
          : 'https://www.iblogsa.com',
      'ng.article':
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5003'
          : 'https://www.iblogng.com',
      'afr.article':
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5004'
          : 'https://www.iblogafrica.com',
      'gh.article':
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5005'
          : 'https://www.ibgan.com',
      'ke.article':
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5006'
          : 'https://www.ibnya.com',
      'uk.article':
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5007'
          : 'https://www.ibloguk.com',
    }[article._type];

    if (article) {
      return `${domain}/${article.industry.slug}/${article.type}/${article.slug.current}`;
    }
    return '#';
  }

  function generateStudioLink(): string {
    const articleGroup = {
      article: 'articlesZimbabwe',
      'sa.article': 'articlesSouthAfrica',
      'ng.article': 'articlesNigeria',
      'afr.article': 'articlesAfrica',
      'gh.article': 'articlesGhana',
      'ke.article': 'articlesKenya',
      'uk.article': 'articlesUnitedKingdom',
    }[article._type];

    const baseUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : 'https://www.ibglobal.org';
    if (article) {
      return `${baseUrl}/studio/structure/articles;${articleGroup};${article._id}`;
    }
    return '#';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        side={isMobile ? 'bottom' : 'right'}
        align={isMobile ? 'end' : 'start'}
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`${generateAricleLink()}`} target="_blank">
            <DropdownMenuItem>
              <Eye />
              <span>Read</span>
            </DropdownMenuItem>
          </Link>
          <Link href={`${generateStudioLink()}`} target="_blank">
            <DropdownMenuItem>
              <SquarePen />
              <span>Edit</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Info />
            <span>Details</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus />
              <span>Share article</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare />
                  <span>Whatsapp</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle />
                  <span>Copy Link</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <LogOut />
          <span>Delete Article</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
