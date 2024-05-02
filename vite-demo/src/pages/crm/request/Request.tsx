import { Card, CardContent } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import AdminPage from './_components/AdminPage';
import BackButton from './_components/BackButton';

export default function Request() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="relative space-y-4 px-4 lg:px-6">
      <BackButton />
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-6 md:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <AdminPage requestId={Number(id)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
