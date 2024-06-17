import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TAddress } from '@/types/request';

export type ModalType = "editTime" | "editDate" | "editMoveSize" | "editPacking" | "editDetails" | "editLocations" | "editStop" | "editPhotos" | "editDeposit" | "openMapModal";

export interface ModalData {
  time?: {
    start_time?: string;
    delivery_time?: string;
    field: "start_time" | "delivery_time";
  }
  date?: {
    moving_date?: Date;
    delivery_date?: Date;
    field: "moving_date" | "delivery_date";
  }
  details?: {
    delicate_items_question_answer: string,
    bulky_items_question_answer: string,
    disassemble_items_question_answer: string,
    comments: string,
  },
  canEditRequest?: boolean;
  locations?: {
    origin: TAddress;
    destination: TAddress
  },
  tab?: "origin" | "destination";
  stop?: TAddress & { isOrigin?: boolean, isDestination?: boolean } | null;
  size?: string;
  packing_id?: number;
  requestId?: number;
  photos?: any[];
  deposit?: number;
}

interface ModalState {
  modals: {
    [key: string]: {
      isOpen: boolean;
      data: any;
    };
  };
}

const initialState: ModalState = {
  modals: {},
};

export const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    _openModal: (state, action: PayloadAction<{ modalType: ModalType; modalData: ModalData }>) => {
      const { modalType, modalData } = action.payload;
      state.modals[modalType] = { isOpen: true, data: modalData };
    },
    _closeModal: (state, action: PayloadAction<{ modalType: ModalType }>) => {
      const { modalType } = action.payload;
      state.modals[modalType] = { isOpen: false, data: null };
    },
    // openModal(state, action) {
    //   state.modals = action.payload;
    // },
    // closeModal(state, action) {
    //   state.modals = action.payload;
    // },
  },
});

export const { reducer } = slice;

export const { _openModal, _closeModal } = slice.actions;

