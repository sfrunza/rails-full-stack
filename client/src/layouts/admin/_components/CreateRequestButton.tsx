import { createRequestAction } from "@/actions/requests";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "@/store";

export function CreateRequestButton() {
  // const { data: services, isLoading } = useSWR("/services");
  const { services } = useSelector((state) => state.globalSettings);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  function handleCreateRequest(serviceId: number) {
    if (!serviceId) return;
    setIsCreating(true);
    createRequestAction(serviceId)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        navigate(`/crm/requests/${res?.request.id}`);
      })
      .catch((err) => {
        toast.error(err.message || err);
      })
      .finally(() => setIsCreating(false));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isCreating}>
          <PlusIcon className="mr-2 size-5" />
          {isCreating ? "Creating..." : "Create Request"}
          <ChevronDownIcon className="ml-2 size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-0">
        <DropdownMenuGroup>
          {/* {isLoading && (
            <div className="flex h-40 items-center justify-center">
              <Spinner />
            </div>
          )} */}
          {services?.map(
            (service: {
              id: number;
              name: string;
              droppable_index: number;
            }) => (
              <DropdownMenuItem
                key={service.droppable_index}
                className="cursor-pointer rounded-none p-2 px-4 text-sm font-medium"
                onClick={() => handleCreateRequest(service.id)}
              >
                {service.name}
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
