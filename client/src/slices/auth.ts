import { createSlice } from '@reduxjs/toolkit';


type TInilitialState = {
  isVerifying: boolean;
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
  isVerifying: false,
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
    loginSuccess(state, action) {
      state.user = action.payload;
    },
    logoutSuccess(state) {
      state.user = null;
    },
    updateSuccess(state, action) {
      state.user = action.payload;
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

  },
});

export const { reducer } = slice;
export const { loginSuccess, logoutSuccess, updateSuccess } = slice.actions


export const verifyAuth = () => async (dispatch: any) => {
  dispatch(slice.actions.verifyRequest());

  // await new Promise((resolve) => setTimeout(resolve, 2000));

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
