import { Button } from '@/components/ui/button';
import { PhoneCallIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from '@/store';

export default function StatusMessage() {
  const { request } = useSelector((state) => state.request);
  const { services } = useSelector((state) => state.globalSettings);
  if (!request) return null;

  const { id, status, service_id } = request;
  const service = services.find((s) => s.id === service_id);
  const isFlatRate = service?.name === 'Flat Rate';
  return (
    <div className="grid grid-cols-2 gap-4 border-b p-4">
      <div className="col-span-2 flex h-full w-full items-center justify-center lg:col-span-1">
        <div className="flex items-center space-x-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-3xl text-white">
            SA
          </div>
          <div>
            <p className="text-base font-semibold">Sam Adam</p>
            <p className="text-sm text-muted-foreground">Moving Assistant</p>
            <p className="text-sm text-muted-foreground">(617) 991-3552</p>
          </div>
          <Button
            asChild
            size="icon"
            variant="outline"
            className="size-12 rounded-full text-green-600 hover:text-green-700"
          >
            <a href="tel:(617)9913552">
              <PhoneCallIcon className="size-6" />
            </a>
          </Button>
        </div>
      </div>

      <div className="col-span-2 flex w-full gap-2 text-left text-sm lg:col-span-1">
        {isFlatRate && status === 'Pending' && (
          <div className="flex w-full flex-col space-y-2 rounded-e-xl rounded-es-xl bg-muted p-4">
            <p className="font-semibold text-primary">
              This is a Flat Rate request. We need the following information in
              order to start working on your quote.
            </p>
            <ol className="list-decimal space-y-2 px-4">
              <li>
                Choose preferred <b>Pick Up and Delivery dates.</b>
              </li>
              <li>
                Provide full <b>Origin and Destination addresses</b>, including
                additional pick up and drop off stops, if needed.
              </li>
              <li>
                Add <b>Inventory</b> of all items, including approximate number
                of boxes, that you will be moving.
              </li>
            </ol>
          </div>
        )}
        {status === 'Completed' && null}
        {status === 'Confirmed' && (
          <>
            <div className="flex w-full flex-col space-y-2 rounded-e-xl rounded-es-xl bg-muted p-4">
              <p className="font-semibold">
                Your move is now booked and confirmed.
              </p>
              <p>
                Our team will be calling you on the day prior to the move to
                reconfirm the arrival time frame. You will also receive a 30
                minute heads up call from your team on the day of the move.
              </p>
            </div>
          </>
        )}
        {!isFlatRate && status === 'Pending' && (
          <div className="flex w-full flex-col space-y-2 rounded-e-xl rounded-es-xl bg-muted p-4">
            <p className="font-semibold">
              We&apos;re currently checking if we&apos;re available for your
              upcoming move.
            </p>
            <p>
              While we&apos;re working on that, could you please update your
              list of items, addresses, and any special details for your move?
            </p>
          </div>
        )}

        {status === 'Canceled' && (
          <div className="flex w-full flex-col space-y-2 rounded-e-xl rounded-es-xl bg-muted p-4">
            <p className="font-semibold">Your move is now canceled.</p>
            <p>
              Please feel free to give us a call at +1 (617) 991-3552 with any
              questions or concerns you might have.
            </p>
          </div>
        )}
        {status === 'Expired' && (
          <div className="flex w-full flex-col space-y-2 rounded-e-xl rounded-es-xl bg-muted p-4">
            <p className="font-semibold">
              It looks like you move plan has EXPIRED.
            </p>
            <p>This may be for a number of reasons:</p>
            <ul className="list-disc">
              <li className="ml-6">Due to no action taken on time.</li>
              <li className="ml-6">We no longer have the availability.</li>
              <li className="ml-6">
                Someone else booked your spot or the moving date got booked up.
              </li>
            </ul>
            <p>
              Please let us know if your move date is flexible and/or if you are
              still interested in using Brave Movers for your upcoming move and
              we will reactivate your request.
            </p>
          </div>
        )}
        {status === 'Not Confirmed' && (
          <div className="flex w-full flex-col space-y-2 rounded-e-xl rounded-es-xl bg-muted p-4">
            <p className="font-semibold">
              We have checked our schedule and it looks like we can make your
              move happen.
            </p>
            <p>
              Click the{' '}
              <span className="font-semibold">
                Proceed to Confirmation Page
              </span>{' '}
              if you wish to confirm your move.
            </p>
            <p>
              <span className="font-semibold">Note:</span> We have a first come,
              first serve reservation system, so we encourage you to act fast if
              your move date is not flexible.
            </p>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-600/90">
              <Link to={`/account/requests/${id}/confirmation`}>
                Proceed to Confirmation Page
              </Link>
            </Button>
          </div>
        )}
        {status === 'Not Available' && (
          <div className="flex w-full flex-col space-y-2 rounded-e-xl rounded-es-xl bg-muted p-4">
            <p className="font-semibold">
              Sorry... It looks we are not available for this move on this day.
            </p>
            <p>
              Please give us a call at{' '}
              <span className="font-semibold">(617) 991-3552</span> to explore
              alternative dates for your move.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
