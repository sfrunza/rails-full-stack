import { XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <div>
      <XIcon
        className="size-6 cursor-pointer text-muted-foreground hover:text-slate-900"
        onClick={() => {
          navigate("/crm/requests");
        }}
      />
    </div>
  );
}
