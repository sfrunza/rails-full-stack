import FormSubmitButton from "@/components/FormSubmitButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth";
import { LogOutIcon } from "lucide-react";

export default function UserButton() {
  const { user, isLoading, logout } = useAuth();

  function getInitials(
    firstName: string | undefined,
    lastName: string | undefined,
  ) {
    if (!firstName || !lastName) return "";
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
          <p className="font-semibold">
            {user?.first_name} {user?.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <FormSubmitButton
          variant="outline"
          type="button"
          className="flex w-full cursor-pointer items-center"
          onClick={logout}
          disabled={isLoading}
          isPending={isLoading}
          label={
            <>
              {!isLoading && <LogOutIcon className="mr-2 size-4" />}
              Log out
            </>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
