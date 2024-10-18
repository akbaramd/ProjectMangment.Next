import React, { useState, useEffect } from 'react';
import Dialog from '@/components/ui/Dialog';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { TenantMember, TenantMemberRole } from '@/@types/tenant';
import { apiUpdateTenantMemberRole } from '@/services/TenantService';

interface ModifyRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    member: TenantMember | null;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const roleOptions = [
    { value: TenantMemberRole.Manager, label: 'Manager' },
    { value: TenantMemberRole.Employee, label: 'Employee' },
    { value: TenantMemberRole.Guest, label: 'Guest' },
];

const ModifyRoleDialog: React.FC<ModifyRoleDialogProps> = ({
                                                               isOpen,
                                                               onClose,
                                                               member,
                                                               onSuccess,
                                                               onError,
                                                           }) => {
    const [selectedRole, setSelectedRole] = useState<TenantMemberRole | null>(null);
    const [updatingRole, setUpdatingRole] = useState(false);

    // Set the current member role when the dialog opens
    useEffect(() => {
        if (member && member.memberRole !== undefined) {
            setSelectedRole(member.memberRole);
        }
    }, [member, isOpen]);

    const handleUpdateRole = async () => {
        if (!member || selectedRole === null) {
            onError('Invalid member or role selection.');
            return;
        }

        setUpdatingRole(true);
        try {
            await apiUpdateTenantMemberRole(member.userId, selectedRole);
            toast.push(
                <Notification title="Success" type="success">
                    Role updated successfully.
                </Notification>
            );
            onSuccess();
            onClose();
        } catch (error) {
            onError('Failed to update member role.');
        } finally {
            setUpdatingRole(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h5 className="mb-4">Modify Member Role</h5>
            <div className="mb-4">
                <label className="block mb-1">Select Role:</label>
                <Select
                    placeholder="Select role"
                    options={roleOptions}
                    value={roleOptions.find((option) => option.value === selectedRole)}
                    onChange={(option) => setSelectedRole(option?.value ?? null)}
                />
            </div>
            <div className="text-right mt-6">
                <Button className="ltr:mr-2" variant="plain" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="solid" onClick={handleUpdateRole} disabled={updatingRole}>
                    {updatingRole ? 'Updating...' : 'Update Role'}
                </Button>
            </div>
        </Dialog>
    );
};

export default ModifyRoleDialog;
