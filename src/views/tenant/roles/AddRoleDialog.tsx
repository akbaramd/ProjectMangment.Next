import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { CreateRoleDto, PermissionDto } from '@/@types/auth';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { Dialog } from '@/components/ui';
import { apiAddRole } from '@/services/TenantRoleService';

interface AddRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
    permissionOptions: PermissionDto[]; // Pass permission options
}

const AddRoleDialog: React.FC<AddRoleDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onError,
    permissionOptions,
}) => {
    const [roleName, setRoleName] = useState<string>('');
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddRole = async () => {
        if (!roleName) {
            onError('وارد کردن نام نقش ضروری است.');
            return;
        }

        setIsAdding(true);
        const roleData: CreateRoleDto = { roleName, permissionKeys: permissions };

        try {
            await apiAddRole(roleData);
            toast.push(
                <Notification title="موفقیت" type="success">
                    نقش با موفقیت اضافه شد.
                </Notification>
            );
            onSuccess();
            setRoleName(''); // Clear role name input
            setPermissions([]); // Clear permissions
            onClose();
        } catch (error) {
            onError('خطا در افزودن نقش.');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h5 className="mb-4">افزودن نقش</h5>
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
                <Button variant="solid" onClick={handleAddRole} disabled={isAdding}>
                    {isAdding ? 'در حال افزودن...' : 'افزودن نقش'}
                </Button>
            </div>
        </Dialog>
    );
};

export default AddRoleDialog;
