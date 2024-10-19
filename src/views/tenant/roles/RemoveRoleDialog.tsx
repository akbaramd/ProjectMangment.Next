import React from 'react';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import EnsureConfirmDialog from '@/components/EnsureConfirmDialog';
import { RoleWithPermissionsDto } from '@/@types/auth';
import { apiDeleteRole } from '@/services/TenantRoleService';

interface RemoveRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    role: RoleWithPermissionsDto | null;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const RemoveRoleDialog: React.FC<RemoveRoleDialogProps> = ({
    isOpen,
    onClose,
    role,
    onSuccess,
    onError,
}) => {
    const handleConfirm = async () => {
        if (!role) {
            onError('اطلاعات نقش نامعتبر است.');
            return;
        }

        try {
            await apiDeleteRole(role.id);
            toast.push(
                <Notification title="موفقیت" type="success">
                    نقش با موفقیت حذف شد.
                </Notification>
            );
            onSuccess();
        } catch (error) {
            toast.push(
                <Notification title="خطا" type="danger">
                    حذف نقش با شکست مواجه شد.
                </Notification>
            );
            onError('خطا در حذف نقش.');
        }
    };

    return (
        <EnsureConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            confirmValue={role?.title || ''}
            title={"تأیید حذف نقش"}
            message="لطفاً برای تأیید حذف نقش، نام آن را وارد کنید."
            placeholder="نام نقش را وارد کنید"
            onConfirm={handleConfirm}
            onCancel={onClose}
            errorMessage="نام نقش اشتباه است."
        />
    );
};

export default RemoveRoleDialog;
