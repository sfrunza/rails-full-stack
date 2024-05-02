import { Outlet } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

export default function MainLayout() {
  return (
    <>
      <PageHeader />
      <main className="bg-slate-50">
        <Outlet />
      </main>
    </>
  );
}
