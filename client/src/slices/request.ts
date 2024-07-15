import { RootState } from '@/store';
import { TFullRequest } from '@/types/request';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

interface TInilitialState {
  request: TFullRequest | null
  originalRequest: TFullRequest | null
  isLoading: boolean,
  error: string | null,
  parklotRequests: TFullRequest[] | null
  parklotStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  parklotError: string | null
  parklotDate: Date | null
}

const initialState = {
  request: null,
  originalRequest: null,
  isLoading: false,
  error: null,
  parklotRequests: null,
  parklotStatus: 'idle',
  parklotError: null,
  parklotDate: null
} as TInilitialState


export const fetchRequestsByDate = createAsyncThunk(
  'requests/fetchRequestsByDate',
  async (date: Date | undefined) => {
    if (!date) return []
    // await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await fetch(`/api/v1/trucks/requests/${date}`);
    const data = await response.json();
    return data;
  }
);


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
      const newRequest = { ...state.request, ...action.payload }
      state.request = newRequest

      const requestExists = state.parklotRequests?.find(req => req.id === newRequest.id);

      if (requestExists && state.parklotRequests) {
        state.parklotRequests = state.parklotRequests?.map(req => {
          if (req.id === newRequest.id) {
            return newRequest
          }
          return req
        })
      } else {
        state.parklotRequests?.push(newRequest)
      }
    },
    setOriginalRequest(state, action) {
      state.originalRequest = { ...state.originalRequest, ...action.payload }
    },
    clearRequest(state) {
      state.request = null
      state.originalRequest = null
      state.parklotRequests = null
    },
    setParklot(state, action) {
      state.parklotRequests = action.payload
    },
    parklotFailure(state, action) {
      state.parklotStatus = 'failed';
      state.parklotError = action.payload;
    },
    setParklotDate(state, action) {
      state.parklotDate = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestsByDate.pending, (state) => {
        state.parklotStatus = 'loading';
      })
      .addCase(fetchRequestsByDate.fulfilled, (state, action) => {
        state.parklotStatus = 'succeeded';
        state.parklotRequests = [...action.payload, state.request];
      })
      .addCase(fetchRequestsByDate.rejected, (state, action) => {
        state.parklotStatus = 'failed';
        state.parklotError = action.error.message || null;
      })

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
  setParklotDate,
  setParklot
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
      dispatch(slice.actions.setParklotDate(requestData.moving_date));
      // dispatch(fetchRequestsByDate(requestData.moving_date));


      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // const parklotResponse = await fetch(`/api/v1/trucks/requests/${requestData.moving_date}`);
      // const parklotData = await parklotResponse.json();
      // if (parklotData.error) {
      //   dispatch(slice.actions.parklotFailure(parklotData.error));
      //   throw new Error(parklotData.error);
      // } else {
      //   dispatch(slice.actions.setParklot(parklotData));
      // }

    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(slice.actions.requestFailure(error.message));
    }
  }
};

