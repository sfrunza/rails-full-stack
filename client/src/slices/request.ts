import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TFullRequest } from '@/types/request';
import { RootState } from '@/store';

type TInilitialState = {
  request: TFullRequest | null
  originalRequest: TFullRequest | null
  isLoading: boolean,
  error: string | null
}

const initialState = {
  request: null,
  originalRequest: null,
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
    setOriginalRequest(state, action) {
      state.originalRequest = { ...state.originalRequest, ...action.payload }
    },
    clearRequest(state) {
      state.request = null
      state.originalRequest = null
    },
  },
});

// Selector to get the original and current requests
const selectOriginalRequest = (state: RootState) => state.request.request;
const selectCurrentRequest = (state: RootState) => state.request.originalRequest;


export const selectIsRequestChanged = createSelector(
  [selectOriginalRequest, selectCurrentRequest],
  (originalRequest, currentRequest) => {
    if (!originalRequest || !currentRequest) return false;
    return JSON.stringify(originalRequest) !== JSON.stringify(currentRequest);
  }
);

export const { reducer } = slice;
export const {
  setRequest,
  setOriginalRequest,
  clearRequest,
} = slice.actions


export const fetchClientRequest = (requestId: string) => async (dispatch: any) => {
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

export const fetchAdminRequest = (requestId: string) => async (dispatch: any) => {
  if (!requestId) return;
  dispatch(slice.actions.requestStart());

  try {
    const response = await fetch(
      `/api/v1/requests/${requestId}`,
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
      dispatch(slice.actions.setOriginalRequest(requestData));
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(slice.actions.requestFailure(error.message));
    }
  }
};

