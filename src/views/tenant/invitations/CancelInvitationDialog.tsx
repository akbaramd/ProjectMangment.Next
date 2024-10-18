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
            onError('Invalid invitation data.');
            return;
        }

        try {
            await apiCancelInvitation(item.id);
            toast.push(
                <Notification title="Success" type="success">
                    Invitation cancelled successfully.
                </Notification>
            );
            onSuccess();
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to cancel invitation.
                </Notification>
            );
            onError('Failed to cancel invitation.');
        }
    };

    return (
        <EnsureConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            confirmValue={item?.phoneNumber || ''}
            title={"Confirm Cancellation"}
            message="Please enter the phone number associated with this invitation to confirm cancellation."
            placeholder="Enter phone number"
            onConfirm={handleConfirm}
            onCancel={onClose}
            errorMessage="Phone number mismatch."
        />
    );
};

export default CancelInvitationDialog;
