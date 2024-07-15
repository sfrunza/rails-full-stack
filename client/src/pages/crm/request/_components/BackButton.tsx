import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { selectIsRequestChanged } from "@/slices/request";
import { useSelector } from "@/store";
import { AlertTriangleIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const isChanged = useSelector(selectIsRequestChanged);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div>
      <XIcon
        className="size-6 cursor-pointer text-muted-foreground hover:text-slate-900"
        onClick={() => {
          if (isChanged) {
            setOpen(true);
          } else {
            navigate("/crm/requests");
          }
        }}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center">
            <AlertTriangleIcon className="size-12 text-orange-400" />
          </div>
          <DialogHeader className="items-center space-y-4 px-10 py-4">
            <DialogTitle>Warning</DialogTitle>
            <DialogDescription className="text-center">
              Request was not saved. Are you sure you want to leave?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(!open)}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/crm/requests")}
              className="w-full"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
