import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOutIcon } from 'lucide-react';
import { logoutUser } from '@/slices/auth';
import { useDispatch, useSelector } from '@/store';

export default function UserButton() {
  const dispatch = useDispatch();
  const { isLoggingOut, user } = useSelector((state) => state.auth);

  function logOutUser() {
    dispatch(logoutUser());
  }

  function getInitials(
    firstName: string | undefined,
    lastName: string | undefined
  ) {
    if (!firstName || !lastName) return '';
    return `${firstName[0]}${lastName[0]}`;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="hover:cursor-pointer">
          <AvatarImage src="" alt="Avatar" />
          <AvatarFallback>
            {getInitials(user?.first_name, user?.last_name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-3">
        <div className="mb-2">
          <p className="font-bold">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button
          onClick={logOutUser}
          className="flex w-full cursor-pointer items-center"
          disabled={isLoggingOut}
          variant="outline"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
