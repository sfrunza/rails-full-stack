import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BackButton({
  to,
  label,
  className,
}: {
  to: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn('flex w-fit items-center gap-2 text-blue-600', className)}
    >
      <ChevronLeftIcon className="size-4" />
      {label}
    </Link>
  );
}
