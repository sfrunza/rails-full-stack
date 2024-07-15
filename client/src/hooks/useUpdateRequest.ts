import { updateRequestAction } from '@/actions/requests';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from '@/store';
import { TNewRequestData } from '@/types/request';


export default function useUpdateRequest() {
  const { request } = useSelector((state) => state.request);
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  function updateRequestHandler(newData: TNewRequestData, callbackFunction?: () => void) {
    if (!request) return
    setIsSaving(true)

    updateRequestAction(request.id, newData).then((res) => {
      if ('error' in res) {
        setError(res.error)
        toast.error(res.error)
        return
      } else if ('success' in res) {
        setError(null)
        toast.success(res.success)
      }
      if (callbackFunction) {
        callbackFunction()
      }
    }).finally(() => setIsSaving(false))
  }

  return { isSaving, error, updateRequestHandler }
}
