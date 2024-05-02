import { ScrollArea } from '@/components/ui/scroll-area';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@/store';

export default function RequestLayout() {
  let location = useLocation();
  const { user } = useSelector((state) => state.auth);

  if (!localStorage.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="fixed left-[50%] top-[50%] z-50 grid h-full w-full max-w-[1300px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background bg-slate-100 p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-xl lg:mt-10">
        <ScrollArea className="h-full lg:h-[calc(100%-40px)]" type="auto">
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}
