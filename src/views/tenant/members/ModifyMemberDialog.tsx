import React, { useState, useEffect } from 'react';
import Dialog from '@/components/ui/Dialog';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { TenantMember } from '@/@types/tenant';
import { apiUpdateTenantMemberRole } from '@/services/TenantService';
import { apiGetRolesForTenant } from '@/services/TenantRoleService';

interface ModifyRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    member: TenantMember | null;
    onSuccess: () => void;
    onError: (message: string) => void;
}

interface RoleOption {
    value: string;
    label: string;
}

const ModifyRoleDialog: React.FC<ModifyRoleDialogProps> = ({
    isOpen,
    onClose,
    member,
    onSuccess,
    onError,
}) => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [updatingRole, setUpdatingRole] = useState(false);
    const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    // Set the current member role when the dialog opens
    useEffect(() => {
        if (member && member.roles.length > 0) {
            setSelectedRole(member.roles[0]?.id || null);
        }
    }, [member, isOpen]);

    // Fetch roles from the API when the dialog is opened
    useEffect(() => {
        if (isOpen) {
            setLoadingRoles(true);
            apiGetRolesForTenant()
                .then((roles) => {
                    const formattedRoles = roles.map((role) => ({
                        value: role.id,
                        label: role.title,
                    }));
                    setRoleOptions(formattedRoles);
                })
                .catch(() => {
                    onError('خطا در دریافت نقش‌ها.');
                })
                .finally(() => {
                    setLoadingRoles(false);
                });
        }
    }, [isOpen, onError]);

    const handleUpdateRole = async () => {
        if (!member || !selectedRole) {
            onError('انتخاب کاربر یا نقش معتبر نیست.');
            return;
        }

        setUpdatingRole(true);
        try {
            await apiUpdateTenantMemberRole(member.userId, selectedRole);
            toast.push(
                <Notification title="موفقیت" type="success">
                    نقش با موفقیت به‌روزرسانی شد.
                </Notification>
            );
            onSuccess();
            onClose();
        } catch (error) {
            onError('خطا در به‌روزرسانی نقش کاربر.');
        } finally {
            setUpdatingRole(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h5 className="mb-4">تغییر نقش کاربر</h5>
            <div className="mb-4">
                <label className="block mb-1">نقش مورد نظر را انتخاب کنید:</label>
                <Select
                    placeholder={loadingRoles ? 'در حال بارگذاری نقش‌ها...' : 'انتخاب نقش'}
                    options={roleOptions}
                    value={roleOptions.find((option) => option.value === selectedRole)}
                    onChange={(option) => setSelectedRole(option?.value ?? null)}
                    isDisabled={loadingRoles || updatingRole}
                />
            </div>
            <div className="text-right mt-6">
                <Button className="ltr:mr-2" variant="plain" onClick={onClose}>
                    لغو
                </Button>
                <Button variant="solid" onClick={handleUpdateRole} disabled={updatingRole || loadingRoles}>
                    {updatingRole ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی نقش'}
                </Button>
            </div>
        </Dialog>
    );
};

export default ModifyRoleDialog;
