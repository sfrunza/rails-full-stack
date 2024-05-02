import { useDispatch, useSelector } from 'store';
import { _openModal, _closeModal, ModalType, ModalData } from 'slices/modal';


export const useModal = () => {
  const dispatch = useDispatch();
  const modals = useSelector((state) => state.modal.modals);

  const openModal = (modalType: ModalType, modalData: ModalData) => {
    console.log("openModal", modalType, modalData);
    dispatch(_openModal({ modalType, modalData }));
  };

  const closeModal = (modalType: ModalType) => {
    dispatch(_closeModal({ modalType }));
  };
  const isModalOpen = (modalType: ModalType) => {
    return !!modals[modalType]?.isOpen;
  };

  const getModalData = (modalType: ModalType) => {
    return modals[modalType]?.data;
  };

  return { openModal, closeModal, isModalOpen, getModalData };
};