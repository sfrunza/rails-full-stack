// RequestChannelSubscription.js
import cable from 'api/WebSocketConnection';
import { useEffect, useState } from 'react';

const RequestChannelSubscription = ({ requestId, onUpdateRequest }: {
  requestId: number;
  onUpdateRequest?: (request: any) => void;

}) => {
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const channel = cable.subscriptions.create({ channel: 'RequestChannel', request_id: requestId }, {
      connected() {
        console.log('Connected to RequestChannel');
      },
      disconnected() {
        console.log('Disconnected from RequestChannel');
      },
      received(data) {
        console.log('Received data from RequestChannel:', data);
        if (data.action === 'update' && data.request.id === requestId) {
          setRequest(data.request);
          onUpdateRequest && onUpdateRequest(data.request);
        }
      },
    });

    return () => {
      channel.unsubscribe();
    };
  }, [requestId, onUpdateRequest]);

  return null;
};

export default RequestChannelSubscription;
