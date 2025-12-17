'use client';

import { Avatar } from '@/src/atoms';
import { generateInitials } from '@/src/utils';
import { useUser } from '@/src/hooks';

interface UserAvatarProps {
  onClick?: () => void;
  className?: string;
}

export function UserAvatar({ onClick, className = '' }: UserAvatarProps) {
  const user = useUser();

  const initials = user
    ? generateInitials(user.firstName, user.lastName)
    : '??';

  return (
    <button onClick={onClick} className={`cursor-pointer ${className}`}>
      <Avatar initials={initials} size="md" />
    </button>
  );
}
