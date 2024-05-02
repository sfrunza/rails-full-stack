import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      {/* <ClientLogin /> */}
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/account">Accoint</Link>
        </li>
        <li>
          <Link to="/crm/requests">Crm/request</Link>
        </li>
        <li>
          <Link to="/crm/calendar">crm/calendar</Link>
        </li>
      </ul>
    </div>
  );
}
