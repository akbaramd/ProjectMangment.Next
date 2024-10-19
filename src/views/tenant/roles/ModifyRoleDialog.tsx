import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { RoleWithPermissionsDto, UpdateRoleDto, PermissionDto } from '@/@types/auth';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { Dialog } from '@/components/ui';
import { apiUpdateRole } from '@/services/TenantRoleService';

interface ModifyRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    role: RoleWithPermissionsDto | null;
    onSuccess: () => void;
    onError: (message: string) => void;
    permissionOptions: PermissionDto[]; // Pass permission options
}

const ModifyRoleDialog: React.FC<ModifyRoleDialogProps> = ({
    isOpen,
    onClose,
    role,
    onSuccess,
    onError,
    permissionOptions,
}) => {
    const [roleName, setRoleName] = useState<string>(role?.title || '');
    const [permissions, setPermissions] = useState<string[]>(role?.permissions.map(p => p.key) || []);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (role) {
            setRoleName(role.title);
            setPermissions(role.permissions.map(p => p.key));
        }
    }, [role]);

    const handleUpdateRole = async () => {
        if (!role || !roleName) {
            onError('وارد کردن نام نقش ضروری است.');
            return;
        }

        setIsUpdating(true);
        const updatedRole: UpdateRoleDto = { roleName, permissionKeys: permissions };

        try {
            await apiUpdateRole(role.id, updatedRole);
            toast.push(
                <Notification title="موفقیت" type="success">
                    نقش با موفقیت به‌روزرسانی شد.
                </Notification>
            );
            onSuccess();
            setRoleName(''); // Clear role name input
            setPermissions([]); // Clear permissions
            onClose();
        } catch (error) {
            onError('خطا در به‌روزرسانی نقش.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h5 className="mb-4">تغییر نقش</h5>
            <div className="mb-4">
                <label className="block mb-1 font-medium">نام نقش</label>
                <Input
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="نام نقش را وارد کنید"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">مجوزها</label>
                <Select
                    placeholder="مجوزها را انتخاب کنید"
                    isMulti
                    options={permissionOptions.map((p) => ({ value: p.key, label: p.name }))}
                    value={permissions.map((key) => ({ value: key, label: key }))}
                    onChange={(option) => setPermissions(option.map((o) => o.value))}
                />
            </div>
            <div className="text-right">
                <Button variant="plain" onClick={onClose} className="ltr:mr-2">
                    لغو
                </Button>
                <Button variant="solid" onClick={handleUpdateRole} disabled={isUpdating}>
                    {isUpdating ? 'در حال به‌روزرسانی...' : 'به‌روزرسانی نقش'}
                </Button>
            </div>
        </Dialog>
    );
};

export default ModifyRoleDialog;
