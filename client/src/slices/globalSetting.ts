import { createSlice } from '@reduxjs/toolkit';
import { getPackings } from '@/actions/packings';
import { getServices } from '@/actions/services';
import { getParklotTrucks, getTrucks } from '@/actions/trucks';

import { type TPacking } from '@/types/packing';
import { type TService } from '@/types/service';
import { type TTruck } from '@/types/truck';

type TInilitialState = {
  services: TService[] | [],
  packings: TPacking[] | [],
  trucks: TTruck[] | [],
  parklotTruks: TTruck[] | [],
}


const initialState = {
  services: [],
  packings: [],
  trucks: [],
  parklotTruks: []
} as TInilitialState;

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
    setTrucks(state, action) {
      state.trucks = action.payload;
    },
    setParklotTrucks(state, action) {
      state.parklotTruks = action.payload;
    },
  },
});

export const setGlobalSettings = () => async (dispatch: any) => {
  getParklotTrucks().then((data) => {
    if (data) {
      dispatch(slice.actions.setParklotTrucks(data));
    }
  })
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
  getTrucks().then((data) => {
    if (data) {
      dispatch(slice.actions.setTrucks(data));
    }
  })
};

export const { reducer } = slice;
export const { setServices, setPackings, setTrucks, setParklotTrucks } = slice.actions