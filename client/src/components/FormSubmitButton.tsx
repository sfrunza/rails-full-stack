import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";
import { LoaderCircleIcon } from "lucide-react";

export interface FormSubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isPending?: boolean;
  label: React.ReactNode | string;
}

export default function FormSubmitButton({
  type = "submit",
  isPending,
  label,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  return (
    <Button
      className={props.className}
      type={type}
      disabled={disabled || isPending}
      {...props}
    >
      {isPending && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
      {label}
    </Button>
  );
}
