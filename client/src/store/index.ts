import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { reducer as authReducer, verifyAuth } from 'slices/auth';
import { reducer as requestsReducer } from 'slices/requests';
import { reducer as requestReducer } from 'slices/request';
import { reducer as globalSettingsReducer, setGlobalSettings } from 'slices/globalSetting';
import { reducer as modalReducer } from 'slices/modal';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    globalSettings: globalSettingsReducer,
    requests: requestsReducer,
    request: requestReducer,
    modal: modalReducer,
  },
});

store.dispatch(verifyAuth());
store.dispatch(setGlobalSettings());

export type RootState = ReturnType<typeof store.getState>

export type AppSelector = typeof store.getState

export const useSelector = useReduxSelector.withTypes<RootState>()

export type AppDispatch = typeof store.dispatch

export const useDispatch = useReduxDispatch.withTypes<AppDispatch>()

