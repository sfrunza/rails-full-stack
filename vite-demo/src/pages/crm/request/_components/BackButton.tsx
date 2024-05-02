import { XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <div className="absolute right-4 top-0">
      {/* <Button variant="outline" size="icon" onClick={() => navigate(-1)}> */}
      <XIcon
        className="size-6 cursor-pointer text-muted-foreground hover:text-slate-900"
        onClick={() => navigate(-1)}
      />
      {/* <span className="sr-only">Close</span> */}
      {/* </Button> */}
    </div>
  );
}
