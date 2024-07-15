import { useModal } from "@/hooks/useModal";
import Map from "@/components/Map/Map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MapModal() {
  const { isModalOpen, closeModal } = useModal();

  const handleClose = () => {
    closeModal("openMapModal");
  };
  return (
    <Dialog open={isModalOpen("openMapModal")} onOpenChange={handleClose}>
      <DialogContent className="flex h-full max-w-screen-xl flex-col overflow-hidden p-0 sm:h-[98vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>Map</DialogTitle>
          <DialogDescription>map</DialogDescription>
        </DialogHeader>
        <div className="h-full w-full flex-1">
          {isModalOpen("openMapModal") && <Map className="h-full" />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
