export async function loginUserAction(user: {
  email: string;
  password: string;
}) {

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: localStorage.token,
      },
      body: JSON.stringify({ session: user }),
    })
    const data = await response.json();
    if (data.user && data.jwt) {
      localStorage.setItem('token', data.jwt);
      return { user: data.user };
    } else {
      return { error: data.error };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Login failed' };
  }
};

export async function logoutUserAction() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const response = await fetch('/auth/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (response.ok) {
      localStorage.removeItem('token');
      return { success: 'Logout successful' };
    } else {
      return { error: 'Logout failed' };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Logout failed' };
  }
};

export async function updateUserAction(userId: number, newData: any) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    let response = await fetch(`/api/v1/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(newData),
    });
    const data = await response.json();
    if (data.error) {
      return { error: "Update failed!" }
    } else {
      return { user: data, success: "Profile saved!" }
    }

  } catch (error) {
    if (error instanceof Error) {
      return { error: "Update failed!" }
    }
    return { error: "Update failed!" }
  }
};