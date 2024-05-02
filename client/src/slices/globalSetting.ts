import { createSlice } from '@reduxjs/toolkit';
import { getPackings } from 'actions/packings';
import { getServices } from 'actions/services';
import { TPacking } from 'types/packing';
import { TService } from 'types/service';

const initialState = {
  services: [] as TService[],
  packings: [] as TPacking[],
};

const slice = createSlice({
  name: 'globalSettings',
  initialState,
  reducers: {
    setServices(state, action) {
      state.services = action.payload;
    },
    setPackings(state, action) {
      state.packings = action.payload;
    },
  },
});

export const setGlobalSettings = () => async (dispatch: any) => {
  getServices().then((data) => {
    if (data) {
      dispatch(slice.actions.setServices(data));
    }
  })
  getPackings().then((data) => {
    if (data) {
      dispatch(slice.actions.setPackings(data));
    }
  })
};

export const { reducer } = slice;
export const { setServices, setPackings } = slice.actions