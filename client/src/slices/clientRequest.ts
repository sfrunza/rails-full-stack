import { createSlice } from '@reduxjs/toolkit';
import { TFullRequest } from 'types/request';

const initialState: { request: TFullRequest | null } = {
  request: null,
}

const slice = createSlice({
  name: 'clientRequest',
  initialState,
  reducers: {
    setStoreRequest(state, action) {
      state.request = action.payload
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
  setStoreRequest,
  updateStoreRequest
} = slice.actions