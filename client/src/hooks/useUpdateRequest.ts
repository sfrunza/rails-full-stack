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
      if (res?.error) {
        setError(res.error)
        toast.error(res.error)
        return
      }
      toast.success("Request saved!")
      setIsSaving(false)
      if (callbackFunction) {
        callbackFunction()
      }
    }).finally(() => setIsSaving(false))
  }

  return { isSaving, error, updateRequestHandler }
}
