import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
// import { BookFormSchema } from "@/lib/schema";
import { BookFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon } from "lucide-react";
import ClientInfoStep from "./ClientInfoStep";
import DateTimeStep from "./DateTimeStep";
import DetailsStep from "./DetailsStep";
// import supabase from "@/utils/supabase";
// import { TFullRequest } from "@/types/supabase";

export type Inputs = z.infer<typeof BookFormSchema>;
type FieldName = keyof Inputs;

const steps = [
  {
    id: "Step 1",
    title: "Get instant online quote",
    action: "Continue",
    fields: [
      "deliveryDate",
      "movingDate",
      "startTime",
      "service",
      "origin.zip",
      "destination.zip",
    ],
  },
  {
    id: "Step 2",
    title: "Move Details",
    action: "Continue",
    fields: ["moveSize", "origin.floor", "destination.floor"],
  },
  {
    id: "Step 3",
    title: "Client details",
    action: "Continue",
    fields: [
      "customer.firstName",
      "customer.lastName",
      "customer.email",
      "customer.phone",
      "additionalInfo",
    ],
  },
  // {
  //   id: "Step 4",
  //   name: "Next step",
  //   fields: ["dasdasd", "dropoffTime", "pickupDate", "pickupTime"],
  // },
  // {
  //   id: "Step 5",
  //   name: "Review Order",
  //   fields: [
  //     "customer.firstName",
  //     "customer.lastName",
  //     "customer.email",
  //     "customer.phone",
  //   ],
  // },
  // { id: "Step 6", name: "Checkout & Submit" },
];

export default function BookForm() {
  // const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  // const isLastStep = currentStep === steps.length - 1;
  // const delta = currentStep - previousStep;

  const form = useForm<Inputs>({
    resolver: zodResolver(BookFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      origin: {
        street: "",
        city: "",
        state: "",
        zip: "",
        apt: "",
        floor: "",
      },
      destination: {
        street: "",
        city: "",
        state: "",
        zip: "",
        apt: "",
        floor: "",
      },
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      status: "Pending",
      movingDate: undefined,
      deliveryDate: undefined,
      startTime: "8AM",
      service: "",
      moveSize: "",
      additionalInfo: "",
    },
  });

  // function onSubmit(data: any) {
  //   console.log(data);
  // }

  const processForm = async (newData: any) => {
    // console.log(e);
    console.log(newData);

    // const req = {
    //   movingDate: newData.movingDate,
    //   startTime: newData.startTime,
    //   service: newData.service,
    //   moveSize: newData.moveSize,
    //   origin: {
    //     ...newData.origin,
    //   },
    //   destination: {
    //     ...newData.destination,
    //   },
    //   details: null,
    // }

    // if (newData) {
    //   const { data, error } = await supabase
    //     .from("requests")
    //     .insert([{ ...req }])
    //     .select();
    // }
    // createOrder.mutate(data);
    // reset();
  };

  async function next() {
    const fields = steps[currentStep]!.fields;
    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    // console.log('output', output);

    if (!output) return;

    if (currentStep === steps.length - 1) {
      await form.handleSubmit(processForm)();
    } else {
      // setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  }

  function prev() {
    if (currentStep > 0) {
      // setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  }

  // console.log(form.watch());
  console.log(form.formState.errors);

  return (
    <div>
      <Form {...form}>
        <form autoComplete={"off"}>
          {currentStep === 0 && (
            <FormCard
              currentStep={currentStep}
              action={steps[currentStep].action!}
              next={next}
              prev={prev}
              title={steps[currentStep].title!}
            >
              <DateTimeStep form={form} />
            </FormCard>
          )}

          {currentStep === 1 && (
            <FormCard
              currentStep={currentStep}
              action={steps[currentStep].action!}
              next={next}
              prev={prev}
              title={steps[currentStep].title!}
            >
              <DetailsStep form={form} />
            </FormCard>
          )}
          {currentStep === 2 && (
            <FormCard
              currentStep={currentStep}
              action={steps[currentStep].action!}
              next={next}
              prev={prev}
              title={steps[currentStep].title!}
            >
              <ClientInfoStep form={form} />
            </FormCard>
          )}
          {currentStep === 3 && <div>{/* <DateTime form={form} /> */}</div>}
          {currentStep === 4 && <div>{/* <ContactInfo form={form} /> */}</div>}
          {currentStep === 5 && <div>{/* <OrderSummary form={form} /> */}</div>}
          {currentStep === 6 && (
            <div>
              <div>success</div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

function FormCard({
  title,
  currentStep,
  action,
  prev,
  next,
  children,
}: {
  title: string;
  currentStep: number;
  action: string;
  prev: () => void;
  next: () => void;
  children: ReactNode;
}) {
  return (
    <Card className="relative w-full shadow-lg sm:w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-20">{children}</CardContent>
      <CardFooter className="flex items-center justify-evenly">
        {currentStep > 0 && (
          <Button
            disabled={currentStep === 0}
            variant="outline"
            onClick={prev}
            type="button"
            size="lg"
            className="rounded-full"
          >
            <ChevronLeftIcon className="mr-1 h-5 w-5" />
            Go back
          </Button>
        )}

        <Button
          type="button"
          onClick={next}
          size="lg"
          className="rounded-full"
          // disabled={currentStep === steps.length - 1}
          // disabled={createOrder.isLoading}
        >
          {/* {createOrder.isLoading
                  ? "Loading..."
                  : steps[currentStep]!.name} */}
          {action}
        </Button>
      </CardFooter>
    </Card>
  );
}
