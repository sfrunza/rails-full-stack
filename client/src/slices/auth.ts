import { createSlice } from '@reduxjs/toolkit';


type TInilitialState = {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isVerifying: boolean;
  loginError: boolean;
  logoutError: boolean;
  isAuthenticated: boolean;
  verifyingError: boolean;
  isUpdating: boolean;
  updateError: boolean;
  user: {
    id: number;
    email: string;
    password_digest: string;
    phone: string;
    add_phone?: string;
    role: string;
    first_name: string;
    last_name: string;
  } | null;
  uError: string;
  error: string;
};

const initialState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isVerifying: false,
  loginError: false,
  logoutError: false,
  isAuthenticated: false,
  verifyingError: false,
  isUpdating: false,
  updateError: false,
  user: null,
  uError: '',
  error: '',
} as TInilitialState;

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest(state) {
      state.isLoggingIn = true;
      state.loginError = false;
    },
    loginSuccess(state, action) {
      state.isLoggingIn = false;
      state.isAuthenticated = true;
      state.error = '';
      state.user = action.payload;
    },
    loginFailure(state, action) {
      state.isLoggingIn = false;
      state.isAuthenticated = false;
      state.loginError = true;
      state.error = action.payload;
    },
    logoutRequest(state) {
      state.isLoggingOut = true;
      state.logoutError = false;
    },
    logoutSuccess(state) {
      state.isLoggingOut = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    logoutFailure(state) {
      state.isLoggingOut = false;
      state.logoutError = true;
    },
    verifyRequest(state) {
      state.isVerifying = true;
      state.verifyingError = false;
    },
    verifySuccess(state) {
      state.isVerifying = false;
    },
    verifyError(state, action) {
      state.isVerifying = false;
      state.error = action.payload;
      state.user = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    updateRequest(state) {
      state.isUpdating = true;
      state.updateError = false;
    },
    updateSuccess(state, action) {
      state.isUpdating = false;
      state.user = action.payload;
    },
    updateFailure(state, action) {
      state.isUpdating = false;
      state.updateError = true;
      state.uError = action.payload;
    },
  },
});

export const { reducer } = slice;

export const loginUser = (user: {
  email: string;
  password: string;
}) => async (dispatch: any) => {
  dispatch(slice.actions.loginRequest());

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
    // console.log(data);
    if (data.user && data.jwt) {
      localStorage.setItem('token', data.jwt);
      dispatch(slice.actions.loginSuccess(data.user));
    } else {
      dispatch(slice.actions.loginFailure(data.error));
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(slice.actions.loginFailure(error.message));
    }
    console.error('Login failed:', error);
  }
};

export const logoutUser = () => async (dispatch: any) => {
  dispatch(slice.actions.logoutRequest());
  // await new Promise((resolve) => setTimeout(resolve, 2000));

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
      dispatch(slice.actions.logoutSuccess());
    } else {
      dispatch(slice.actions.logoutFailure());
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(slice.actions.logoutFailure());
    }
    console.error('Logout failed:', error);
  }
};

export const updateUser = (userId: number, update: any) => async (dispatch: any) => {
  dispatch(slice.actions.updateRequest());
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    let response = await fetch(`/api/v1/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.token,
      },
      body: JSON.stringify(update),
    });
    const data = await response.json();
    if (data.error) {
      dispatch(slice.actions.updateFailure("Update failed!"));
      return { error: "update failed!" }
    } else {
      dispatch(slice.actions.updateSuccess(data));
      return { success: "update success!" }
    }

  } catch (error) {
    if (error instanceof Error) {
      dispatch(slice.actions.updateFailure(error.message));
    }
    console.error('Verify failed:', error);
    return { error: "update failed!" }
  }
};

export const verifyAuth = () => async (dispatch: any) => {
  dispatch(slice.actions.verifyRequest());

  // await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await fetch('/auth/authorized', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: localStorage.token,
      },
    })

    const data = await response.json();

    if (data.error) {
      localStorage.removeItem('token');
    } else {
      dispatch(slice.actions.loginSuccess(data));
    }
    dispatch(slice.actions.verifySuccess());

  } catch (error) {
    if (error instanceof Error) {
      dispatch(slice.actions.verifyError(error.message));
    }
    console.error('Verify failed:', error);
  }
};

export const uploadProfilePicture = (formData: any, userId: string) => async (dispatch: any) => {
  const configurationObject = {
    method: 'PUT',
    body: formData,
  };
  await fetch(`/api/v1/users/${userId}`, configurationObject)
    .then((r) => {
      return r.json();
    })
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        dispatch(slice.actions.updateSuccess(data));
      }
    })
    .catch((error) => dispatch(slice.actions.updateFailure(error.message)));
};
export default slice;
