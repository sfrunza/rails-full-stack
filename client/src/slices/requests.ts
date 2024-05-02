import { createSlice } from '@reduxjs/toolkit';
import { TFullRequest, TStatus } from '@/types/request';

interface InitialState {
  requests: TFullRequest[];
  request: TFullRequest | null;
  status: TStatus;
  page: number;
}

const initialState = {
  requests: [],
  request: null,
  status: "Pending" as TStatus,
  page: 1,
} as InitialState;

const slice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests(state, action) {
      state.requests = action.payload;
    },
    setRequest(state, action) {
      state.request = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const { reducer } = slice;
export const { setRequests, setRequest, setStatus, setPage } = slice.actions