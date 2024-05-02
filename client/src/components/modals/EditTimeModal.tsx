import { zodResolver } from '@hookform/resolvers/zod';
import { Clock8Icon } from 'lucide-react';
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
import { Form, FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useModal } from '@/hooks/useModal';
import useUpdateRequest from '@/hooks/useUpdateRequest';
import { cn } from '@/lib/utils';
// import { start } from "repl";

// const timeWindows = ["Any time", "8AM", "11AM-2PM", "1PM-4PM", "3PM-6PM"];

const timeWindows = [
  {
    id: 1,
    label: 'Any time',
    min: null,
    max: null,
  },
  {
    id: 2,
    label: '8AM',
    min: '08:00 AM',
    max: null,
  },
  {
    id: 3,
    label: '11AM-2PM',
    min: '11:00 AM',
    max: '02:00 PM',
  },
  {
    id: 4,
    label: '1PM-4PM',
    min: '01:00 PM',
    max: '04:00 PM',
  },
  {
    id: 5,
    label: '3PM-6PM',
    min: '03:00 PM',
    max: '06:00 PM',
  },
];

const FormDataSchema = z.object({
  start_time: z.string(),
});

type Inputs = z.infer<typeof FormDataSchema>;

export const EditTimeModal = () => {
  const { isModalOpen, closeModal, getModalData } = useModal();
  const { isSaving } = useUpdateRequest();

  const { time } = getModalData('editTime');

  const form = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      start_time: '',
    },
  });

  async function onSubmit(newData: Inputs) {
    const selectedTime = timeWindows.find(
      (timeWindow) => timeWindow.id === parseInt(newData.start_time)
    );
    console.log(selectedTime);
  }

  const handleClose = () => {
    form.reset();
    closeModal('editTime');
  };

  return (
    <Dialog open={isModalOpen('editTime')} onOpenChange={handleClose}>
      <DialogContent className="flex h-full flex-col overflow-hidden p-0 sm:h-auto">
        <DialogHeader className="p-6">
          <DialogTitle>Select time window</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col justify-between"
          >
            <div>
              <FormField
                control={form.control}
                name={time!.field}
                render={({ field }) => (
                  <RadioGroup
                    defaultValue={time[field.name]!}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    className="grid flex-1 grid-cols-2 gap-4 p-4 sm:p-6"
                  >
                    {timeWindows.map((timeWindow) => {
                      return (
                        <div
                          key={timeWindow.id}
                          className={cn(
                            form.watch(time.field) === timeWindow.id.toString()
                              ? 'border-primary bg-primary/5 ring-2 ring-primary'
                              : 'border-slate-300 text-muted-foreground',
                            'relative col-span-1 h-20 cursor-pointer rounded-lg border-input shadow-button focus:outline-none sm:min-h-20'
                          )}
                        >
                          <Label
                            htmlFor={timeWindow.id.toString()}
                            className="absolute h-full w-full p-4 hover:cursor-pointer"
                          >
                            <div className="space-y-2">
                              <Clock8Icon
                                className={cn(
                                  'size-6 text-muted-foreground',
                                  form.watch(time.field) === timeWindow &&
                                    'text-primary'
                                )}
                              />
                              <p className="font-medium">{timeWindow.label}</p>
                            </div>
                          </Label>
                          <RadioGroupItem
                            value={timeWindow.id.toString()}
                            id={timeWindow.id.toString()}
                            className="absolute right-4 top-4"
                          />
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}
              />
            </div>
            <DialogFooter className="flex justify-end bg-muted p-6">
              <Button disabled={isSaving}>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
