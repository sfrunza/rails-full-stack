import { createSlice } from '@reduxjs/toolkit';
import { TFullRequest, TStatus } from '@/types/request';

interface InitialState {
  requests: TFullRequest[];
  status: TStatus;
  page: number;
}

const initialState = {
  requests: [],
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
    setStatus(state, action) {
      state.status = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
});

export const { reducer } = slice;
export const { setRequests, setStatus, setPage } = slice.actions