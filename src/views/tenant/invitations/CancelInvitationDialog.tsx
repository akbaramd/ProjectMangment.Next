import React from 'react';
import { apiCancelInvitation } from '@/services/InvitationService';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import EnsureConfirmDialog from '@/components/EnsureConfirmDialog'

interface CancelInvitationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item: { id: string, phoneNumber: string } | null;
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
    const handleConfirm = async () => {
        if (!item) {
            onError('اطلاعات دعوت‌نامه نامعتبر است.');
            return;
        }

        try {
            await apiCancelInvitation(item.id);
            toast.push(
                <Notification title="موفقیت" type="success">
                    دعوت‌نامه با موفقیت لغو شد.
                </Notification>
            );
            onSuccess();
        } catch (error) {
            toast.push(
                <Notification title="خطا" type="danger">
                    لغو دعوت‌نامه با شکست مواجه شد.
                </Notification>
            );
            onError('لغو دعوت‌نامه با شکست مواجه شد.');
        }
    };

    return (
        <EnsureConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            confirmValue={item?.phoneNumber || ''}
            title={"تأیید لغو"}
            message="لطفاً شماره تلفن مرتبط با این دعوت‌نامه را برای تأیید لغو وارد کنید."
            placeholder="شماره تلفن را وارد کنید"
            onConfirm={handleConfirm}
            onCancel={onClose}
            errorMessage="عدم تطابق شماره تلفن."
        />
    );
};

export default CancelInvitationDialog;
