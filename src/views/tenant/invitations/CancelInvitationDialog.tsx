// src/components/CancelInvitationDialog.tsx
import React, { useState } from 'react';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import EnsureConfirmDialog from '@/components/EnsureConfirmDialog';
import { cancelInvitation } from '@/store/invitation/invitationActions';
import { useAppDispatch } from '@/store/configureStore';

interface CancelInvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: { id: string; phoneNumber: string } | null;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const CancelInvitationDialog: React.FC<CancelInvitationDialogProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
  onError,
}) => {
  const dispatch = useAppDispatch();
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const handleConfirm = async () => {
    if (!item) {
      onError('اطلاعات دعوت‌نامه نامعتبر است.');
      return;
    }

    setIsCancelling(true);
    try {
      const resultAction = await dispatch(cancelInvitation(item.id));
      if (cancelInvitation.fulfilled.match(resultAction)) {
        toast.push(
          <Notification title="موفقیت" type="success">
            دعوت‌نامه با موفقیت لغو شد.
          </Notification>
        );
        onSuccess();
        onClose();
      } else {
        if (resultAction.payload) {
          onError(resultAction.payload);
        } else {
          onError('لغو دعوت‌نامه با شکست مواجه شد.');
        }
      }
    } catch (error) {
      toast.push(
        <Notification title="خطا" type="danger">
          لغو دعوت‌نامه با شکست مواجه شد.
        </Notification>
      );
      onError('لغو دعوت‌نامه با شکست مواجه شد.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <EnsureConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      confirmValue={item?.phoneNumber || ''}
      title={'تأیید لغو'}
      message="لطفاً شماره تلفن مرتبط با این دعوت‌نامه را برای تأیید لغو وارد کنید."
      placeholder="شماره تلفن را وارد کنید"
      onConfirm={handleConfirm}
      onCancel={onClose}
      errorMessage="عدم تطابق شماره تلفن."
    />
  );
};

export default CancelInvitationDialog;
