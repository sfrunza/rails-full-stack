import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { useSelector } from '@/store';
import useSWR from 'swr';
import { TFullRequest } from '@/types/request';
import { RequestsTable } from './_components/RequestsTable';
import { StatusTabs } from './_components/StatusTabs';
import { TablePagination } from './_components/TablePagination';

export default function Requests() {
  const { status, page } = useSelector((state) => state.requests);
  const { data, error } = useSWR<{
    requests: TFullRequest[];
    total_pages: number;
  }>(`/requests?filter=${status}&page=${page}`);

  return (
    <Card className="p-0">
      <CardHeader className="p-1">
        <StatusTabs />
      </CardHeader>
      <CardContent className="p-1">
        {error && <div>{error.message}</div>}
        <RequestsTable requests={data?.requests ?? []} />
      </CardContent>
      <CardFooter className="p-4">
        <TablePagination totalPages={data?.total_pages ?? 0} />
      </CardFooter>
    </Card>
  );
}
