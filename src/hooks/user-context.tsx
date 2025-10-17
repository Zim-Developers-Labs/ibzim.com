'use client';

import type React from 'react';

import { createContext, useContext, useState } from 'react';
import type { User } from '@/lib/server/constants';

interface UserContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  dbUser,
  children,
}: {
  dbUser: User | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(dbUser);

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
