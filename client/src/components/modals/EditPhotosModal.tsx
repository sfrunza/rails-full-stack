import { Trash2Icon } from "lucide-react";
// import { useState } from 'react';

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModal";
import useUpdateRequest from "@/hooks/useUpdateRequest";

const images = [
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713769931183-1537d9a8126b?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1713813091291-ba9b947b8803?q=80&w=2978&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

// type TFile = File & { preview: string };

export function EditPhotosModal() {
  const { isModalOpen, closeModal } = useModal();
  const { isSaving } = useUpdateRequest();

  // const { photos } = getModalData("editTime");

  // const photos = [] as any[];

  // const [files, setFiles] = useState<TFile[]>([]);
  // const [images, setImages] = useState<any[]>(photos);

  // function handleSetFiles(newFiles: File[]) {
  //   setFiles((prev) => [
  //     ...prev,
  //     ...newFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     ),
  //   ]);
  // }

  // function hideUploadButton() {
  //   // if (!file) {
  //   //   return false;
  //   // } else if (uploaded) {
  //   //   return false;
  //   // }
  //   // return true;
  // }

  // function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   // const file = e.target.files?.[0];
  //   // if (!file) return;
  //   // if (fileURL) {
  //   //   URL.revokeObjectURL(fileURL);
  //   // }
  //   // setFile(file);
  //   // const url = URL.createObjectURL(file);
  //   // setFileURL(url);
  // }

  // async function handleImageUpload() {
  //   // if (!file) return;
  //   // setLoading(true);
  //   // const uuid = crypto.randomUUID();
  //   // const { data, error } = await supabase.storage
  //   //   .from("photos")
  //   //   .upload(`${requestId}/${uuid}`, file, {
  //   //     cacheControl: "3600",
  //   //     upsert: false,
  //   //   });
  //   // if (error) {
  //   //   console.error("Error uploading image", error);
  //   //   return;
  //   // }
  //   // if (data) {
  //   //   getImages();
  //   // }
  //   // setLoading(false);
  //   // setFile(undefined);
  //   // setFileURL("");
  // }

  // async function getImages() {
  //   // const { data, error } = await supabase.storage
  //   //   .from("photos")
  //   //   .list(requestId, {
  //   //     limit: 100,
  //   //     sortBy: { column: "created_at", order: "desc" },
  //   //   });
  //   // if (error) {
  //   //   console.error("Error fetching images", error);
  //   //   return;
  //   // }
  //   // if (data) {
  //   //   setImages(data);
  //   //   setRequest({
  //   //     ...request,
  //   //     photos: data,
  //   //   } as TFullRequest);
  //   //   return;
  //   // }

  //   return [];
  // }

  const handleClose = () => {
    closeModal("editPhotos");
  };

  return (
    <Dialog open={isModalOpen("editPhotos")} onOpenChange={handleClose}>
      <DialogContent
        // className="flex h-full flex-col overflow-hidden p-0 sm:h-auto"
        className="flex h-full flex-col overflow-hidden p-0 sm:h-[90vh]"
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Gallery</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 flex-col justify-between overflow-hidden">
          <ScrollArea className="h-full w-full px-2 pb-4 sm:px-4">
            <FileUpload />
            <Separator />
            {/* <PhotoGallery photos={images} /> */}
            <div className="grid grid-cols-12 gap-2 p-4">
              {images?.map((image, i) => (
                <div
                  key={i}
                  className="col-span-6 flex max-w-sm flex-col flex-wrap items-center justify-between gap-1 border pb-2 sm:col-span-4"
                >
                  <div>
                    <img
                      src={image}
                      alt="placeholder"
                      className="h-16 w-full object-cover"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-fit w-fit p-0 text-muted-foreground transition-colors hover:text-destructive"
                    onClick={() => {
                      console.log("delete");
                    }}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter className="flex justify-end bg-muted p-6">
            <Button disabled={isSaving}>Save changes</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
