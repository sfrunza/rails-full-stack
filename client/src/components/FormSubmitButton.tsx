"use client";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { PulseLoader } from "react-spinners";

type FormSubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isPending?: boolean;
  clasName?: string;
  label: string;
  disabled?: boolean;
};

export default function FormSubmitButton({
  type = "submit",
  isPending,
  label,
  clasName,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  return (
    <Button
      type={type}
      disabled={isPending || disabled}
      className={cn("", clasName)}
      {...props}
    >
      {isPending ? <PulseLoader color="#fff" size={6} /> : label}
    </Button>
  );
}
