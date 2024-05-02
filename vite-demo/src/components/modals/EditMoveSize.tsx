import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModal } from '@/hooks/useModal';
import useUpdateRequest from '@/hooks/useUpdateRequest';

const sizes = [
  'Room or less (partial move)',
  'Studio apartment',
  'Small 1 Bedroom apartment',
  'Large 1 Bedroom apartment',
  'Small 2 Bedroom apartment',
  'Large 2 Bedroom apartment',
  '3 Bedroom apartment',
  '2 Bedroom House/Townhouse',
  '3 Bedroom House/Townhouse',
  '4 Bedroom House/Townhouse',
  'Commercial Move',
];

const FormDataSchema = z.object({
  size: z.string(),
});
type Inputs = z.infer<typeof FormDataSchema>;

export const EditMoveSizeModal = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { isSaving, updateRequestHandler } = useUpdateRequest();

  const { size } = getModalData('editMoveSize');

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      size: size,
    },
  });

  async function onSubmit(newData: Inputs) {
    updateRequestHandler(newData, handleClose);
  }

  const handleClose = () => {
    form.reset();
    closeModal('editMoveSize');
  };

  return (
    <Dialog open={isModalOpen('editMoveSize')} onOpenChange={handleClose}>
      <DialogContent className="flex h-full flex-col overflow-hidden p-0 sm:h-auto">
        <DialogHeader className="p-6">
          <DialogTitle>Select move date</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col justify-between overflow-hidden"
          >
            <div className="px-6 pb-10">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Move Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={size}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select move size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((item, i) => (
                          <SelectItem
                            key={i}
                            value={item}
                            className="hover:cursor-pointer"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="flex justify-end bg-slate-100 p-6">
              <Button disabled={isSaving}>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
