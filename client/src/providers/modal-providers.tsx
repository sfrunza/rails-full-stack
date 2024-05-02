import { useEffect, useState } from 'react';

import { useModal } from '@/hooks/useModal';
import { EditPackingModal } from '@/components/modals/EditPackingModal';
import { EditDateModal } from '@/components/modals/EditDateModal';
import { EditMoveSizeModal } from '@/components/modals/EditMoveSize';
import { EditTimeModal } from '@/components/modals/EditTimeModal';
import { EditDetailsModal } from '@/components/modals/EditDetailsModal';
import { EditPhotosModal } from '@/components/modals/EditPhotosModal';
import { EditLocationsModal } from '@/components/modals/EditLocationsModal';

// import { EditTimeModal } from "@/components/modals/edit-time-modal";
// import { EditDateModal } from "@/components/modals/edit-date-modal";
// import { EditMoveSizeModal } from "@/components/modals/edit-move-size-modal";
// import { EditPackingModal } from "components/modals/edit-packing-modal";
// import { EditDetailsModal } from "@/components/modals/edit-details-modal";
// import { EditLocationsModal } from "@/components/modals/edit-locations-modal";
// import { EditPhotosModal } from "@/components/modals/edit-photos-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { isModalOpen } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {isModalOpen('editPacking') && <EditPackingModal />}
      {isModalOpen('editDate') && <EditDateModal />}
      {isModalOpen('editMoveSize') && <EditMoveSizeModal />}
      {isModalOpen('editTime') && <EditTimeModal />}
      {isModalOpen('editDetails') && <EditDetailsModal />}
      {isModalOpen('editPhotos') && <EditPhotosModal />}
      {isModalOpen('editLocations') && <EditLocationsModal />}
      {/* <EditTimeModal /> */}
      {/* <EditDateModal /> */}
      {/* <EditMoveSizeModal /> */}
      {/* <EditDetailsModal /> */}
      {/* <EditLocationsModal /> */}
      {/* <EditPhotosModal /> */}
      {/* <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal /> */}
    </>
  );
};
