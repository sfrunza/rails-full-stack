import FormSubmitButton from "components/FormSubmitButton";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "slices/auth";
import { useDispatch, useSelector } from "store";

export default function Calendar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggingOut } = useSelector((state) => state.auth);

  function logOutUser() {
    dispatch(logoutUser());
  }

  return (
    <div>
      <h1>Calendar</h1>

      <FormSubmitButton
        onClick={logOutUser}
        isPending={isLoggingOut}
        label="Log out"
      />
    </div>
  );
}
