import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountMain() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4">
          <div className="col-span-4 space-y-2 sm:col-span-2">
            <h4 className="text-sm font-medium">Your lates move</h4>
            {/* <JobItem {...job} /> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
