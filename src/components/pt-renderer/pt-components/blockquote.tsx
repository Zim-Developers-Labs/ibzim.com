import React from 'react';

interface BlockquoteProps {
  children: any;
}

const Blockquote: React.FC<BlockquoteProps> = ({ children }) => {
  return (
    <blockquote className="mb-4 border-l-4 border-gray-500 py-2 pl-4">
      <p className="text-lg italic">{children}</p>
    </blockquote>
  );
};

export default Blockquote;
