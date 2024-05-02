// import { TStatus, TStatusCounts } from "actions/requests";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Suspense } from 'react';
import { setPage, setStatus } from '@/slices/requests';
import { useDispatch, useSelector } from '@/store';
import useSWR from 'swr';
import { TStatus, TStatusCounts } from '@/types/request';

const statusColors = {
  'All Requests': 'text-slate-800',
  Confirmed: 'text-green-600',
  Pending: 'text-amber-500',
  Canceled: 'text-red-500',
  Expired: 'text-slate-800',
  Completed: 'text-[deepskyblue]',
  'Not Confirmed': 'text-indigo-600',
  'Not Available': 'text-slate-800',
  Spam: 'text-slate-800',
};

const statusBgColors = {
  'All Requests': 'bg-slate-800',
  Confirmed: 'bg-green-600',
  Pending: 'bg-amber-500',
  Canceled: 'bg-red-500',
  Expired: 'bg-slate-800',
  Completed: 'bg-[deepskyblue]',
  'Not Confirmed': 'bg-indigo-600',
  'Not Available': 'bg-slate-800',
  Spam: 'bg-slate-800',
};

type TValue = keyof TStatus & 'all';
type TLabel = keyof TStatus & 'All Requests';

type TStatusOption = {
  label: TLabel;
  value: TValue;
};

const statuses = [
  {
    label: 'All Requests',
    value: 'all',
  },
  {
    label: 'Pending',
    value: 'Pending',
  },
  {
    label: 'Not Confirmed',
    value: 'Not Confirmed',
  },
  {
    label: 'Confirmed',
    value: 'Confirmed',
  },
  {
    label: 'Expired',
    value: 'Expired',
  },
  {
    label: 'Not Available',
    value: 'Not Available',
  },
  {
    label: 'Canceled',
    value: 'Canceled',
  },
  {
    label: 'Completed',
    value: 'Completed',
  },
  {
    label: 'Spam',
    value: 'Spam',
  },
] as TStatusOption[];

export function StatusTabs() {
  const { status } = useSelector((state) => state.requests);
  const dispatch = useDispatch();
  const { data } = useSWR<TStatusCounts>(`/requests/status_counts`);

  return (
    <Tabs
      defaultValue={status}
      onValueChange={(val) => {
        dispatch(setStatus(val));
        dispatch(setPage(1));
      }}
    >
      <ScrollArea className="whitespace-nowrap pb-1">
        <TabsList className="h-12 w-full justify-start gap-1">
          {statuses.map((st, i) => (
            <TabItem
              key={i}
              value={st.value}
              label={st.label}
              statusCounts={data?.[st.value]}
            />
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" className="mt-2" />
      </ScrollArea>
    </Tabs>
  );
}

function TabItem({
  value,
  label,
  statusCounts,
}: {
  value: TValue;
  label: TLabel;
  statusCounts: number | undefined;
}) {
  return (
    <TabsTrigger
      value={value}
      className={`${statusColors[label]} data-[state=active]:${statusColors[label]} flex h-full w-[190px] gap-2`}
    >
      {label}
      <div
        className={`${statusBgColors[label]} flex items-center justify-center rounded-full px-2 py-0.5 text-xs text-white`}
      >
        <Suspense fallback={'loading...'}>{statusCounts ?? 0}</Suspense>
      </div>
    </TabsTrigger>
  );
}
