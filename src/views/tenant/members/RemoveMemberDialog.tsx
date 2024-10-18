import React from 'react';
import { apiRemoveTenantMember } from '@/services/TenantService';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import EnsureConfirmDialog from '@/components/EnsureConfirmDialog';
import { TenantMember } from '@/@types/tenant'

interface RemoveMemberDialogProps {
    isOpen: boolean;
    onClose: () => void;
    item: TenantMember | null;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const RemoveMemberDialog: React.FC<RemoveMemberDialogProps> = ({
                                                                   isOpen,
                                                                   onClose,
                                                                   item,
                                                                   onSuccess,
                                                                   onError,
                                                               }) => {
    const handleConfirm = async () => {
        if (!item) {
            onError('Invalid member data.');
            return;
        }

        try {
            await apiRemoveTenantMember(item.userId);
            toast.push(
                <Notification title="Success" type="success">
                    Member removed successfully.
                </Notification>
            );
            onSuccess();
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to remove member.
                </Notification>
            );
            onError('Failed to remove member.');
        }
    };

    return (
        <EnsureConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            confirmValue={item?.user.fullName || ''}
            title={"Confirm Member Removal"}
            message="Please enter the full name of the member to confirm removal."
            placeholder="Enter full name"
            onConfirm={handleConfirm}
            onCancel={onClose}
            errorMessage="Full name mismatch."
        />
    );
};

export default RemoveMemberDialog;
