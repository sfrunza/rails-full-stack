import { createSlice } from '@reduxjs/toolkit';
import { TFullRequest } from '@/types/request';

type TInilitialState = {
  request: TFullRequest | null
  isLoading: boolean,
  error: string | null
}

const initialState = {
  request: null,
  isLoading: false,
  error: null
} as TInilitialState

const slice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    requestStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    requestSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.request = action.payload
    },
    requestFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setRequest(state, action) {
      state.request = { ...state.request, ...action.payload }
    },
    updateStoreRequest(state, action) {
      if (state.request) {
        state.request = { ...state.request, ...action.payload }
      }
    }
  },
});

export const { reducer } = slice;
export const {
  setRequest,
  updateStoreRequest
} = slice.actions


export const fetchRequest = (requestId: string) => async (dispatch: any) => {
  if (!requestId) return;
  dispatch(slice.actions.requestStart());

  try {
    const response = await fetch(
      `/api/v1/client_requests/${requestId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: localStorage.token,
        },
      },
    );
    if (!response.ok) {
      dispatch(slice.actions.requestFailure(response.statusText));
      throw new Error(response.statusText);
    }
    const requestData = await response.json();

    if (requestData.error) {
      dispatch(slice.actions.requestFailure(requestData.error));
      throw new Error(requestData.error);
    } else {
      dispatch(slice.actions.requestSuccess(requestData));
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(slice.actions.requestFailure(error.message));
    }
  }
};