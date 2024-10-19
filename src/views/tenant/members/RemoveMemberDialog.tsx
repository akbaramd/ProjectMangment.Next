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
            onError('اطلاعات عضو نامعتبر است.');
            return;
        }

        try {
            await apiRemoveTenantMember(item.userId);
            toast.push(
                <Notification title="موفقیت" type="success">
                    عضو با موفقیت حذف شد.
                </Notification>
            );
            onSuccess();
        } catch (error) {
            toast.push(
                <Notification title="خطا" type="danger">
                    حذف عضو با شکست مواجه شد.
                </Notification>
            );
            onError('حذف عضو با شکست مواجه شد.');
        }
    };

    return (
        <EnsureConfirmDialog
            isOpen={isOpen}
            onClose={onClose}
            confirmValue={item?.user.fullName || ''}
            title={"تأیید حذف عضو"}
            message="لطفاً برای تأیید حذف، نام کامل عضو را وارد کنید."
            placeholder="نام کامل را وارد کنید"
            onConfirm={handleConfirm}
            onCancel={onClose}
            errorMessage="نام وارد شده نادرست است."
        />
    );
};

export default RemoveMemberDialog;
