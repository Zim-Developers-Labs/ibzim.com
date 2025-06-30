'use client';

import cn from 'clsx';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';

export interface Props {
  question: string;
  isActive?: boolean;
  children: ReactNode;
}

const Question: React.FC<Props> = ({ question, children }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleAnswer = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      className={'faq-item overflow-hidden rounded-md border border-zinc-200'}
    >
      <h3
        onClick={toggleAnswer}
        className={`flex w-full cursor-pointer flex-row items-center justify-between p-2 sm:p-3 ${
          isActive
            ? 'bg-primaryColor text-zinc-900'
            : 'bg-zinc-100 hover:bg-zinc-200'
        }`}
      >
        <span className="text-left">{question}</span>
        <span className={`block ${isActive && 'rotate-180'}`}>
          <ChevronDown className="w-4" />
        </span>
      </h3>
      <div className={cn('answer', { hidden: !isActive })}>{children}</div>
    </div>
  );
};

export default Question;
