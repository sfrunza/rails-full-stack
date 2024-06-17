import { useModal } from "@/hooks/useModal";
import Map from "../Map/Map";
import { Dialog, DialogContent } from "../ui/dialog";

export default function MapModal() {
  const { isModalOpen, closeModal } = useModal();

  const handleClose = () => {
    closeModal("openMapModal");
  };
  return (
    <Dialog open={isModalOpen("openMapModal")} onOpenChange={handleClose}>
      <DialogContent className="flex h-full max-w-screen-xl flex-col overflow-hidden p-0 sm:h-[98vh]">
        <div className="h-full w-full flex-1">
          {isModalOpen("openMapModal") && <Map className="h-full" />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
