import { AccordionContent } from '@/components/ui/accordion';
import JobItem from './JobItem';

export default function JobsMenu({ requests }: { requests: any[] }) {
  return (
    <AccordionContent className="flex flex-col gap-2 border-none px-1 py-2">
      {requests.map((job) => (
        <JobItem key={job.id} {...job} />
      ))}
    </AccordionContent>
  );
}
