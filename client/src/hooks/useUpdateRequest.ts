import { updateRequest } from '@/actions/requests';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from '@/store';
import { TNewData } from '@/types/request';


export default function useUpdateRequest() {
  const { request } = useSelector((state) => state.request);
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  function updateRequestHandler(newData: TNewData, handleClose: () => void) {
    setIsSaving(true)

    updateRequest(request?.id!, newData).then((res) => {
      console.log(res)
      if (res?.error) {
        setError(res.error)
        toast.error(res.error)
        return
      }
      setIsSaving(false)
      handleClose()
    }).finally(() => setIsSaving(false))
  }

  return { isSaving, error, updateRequestHandler }
}
