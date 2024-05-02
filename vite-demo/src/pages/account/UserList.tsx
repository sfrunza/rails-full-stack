import { useEffect, useState } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  // Add more properties as needed
}

export default function UserList(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch('/api/v1/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token')!,
            // Add any authentication headers if needed (e.g., JWT token)
          },
        });

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
          console.log('Fetched users:', data);
        } else {
          console.error('Failed to fetch users:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    getUsers();
  }, []);

  console.log(users);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.first_name} {user.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
