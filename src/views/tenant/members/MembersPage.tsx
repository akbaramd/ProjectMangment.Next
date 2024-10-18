import { useState } from 'react';
import MemberTable from './MemberTable';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { TenantMember, TenantMemberRole, TenantMemberStatus } from '@/@types/tenant';
import DebouncedInput from '@/views/tenant/invitations/DebouncedInput';
import RemoveMemberDialog from './RemoveMemberDialog';
import ModifyRoleDialog from '@/views/tenant/members/ModifyMemberDialog' // Import the new dialog

const MembersPage = () => {
    const [searchFilter, setSearchFilter] = useState<string | number>(''); // Track search filter
    const [reload, setReload] = useState(false); // Track reload state for the table
    const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
    const [isModifyRoleDialogOpen, setModifyRoleDialogOpen] = useState(false);
    const [memberToBeRemoved, setMemberToBeRemoved] = useState<TenantMember | null>(null); // Track the member to be removed
    const [memberToModifyRole, setMemberToModifyRole] = useState<TenantMember | null>(null); // Track the member to modify role
    const navigate = useNavigate();

    const triggerTableReload = () => {
        setReload((prev) => !prev); // Toggle reload to trigger table refresh
    };

    const handleActionError = (message: string) => {
        toast.push(
            <Notification title="Error" type="danger">
                {message}
            </Notification>
        );
    };

    const handleRemoveSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                Member removed successfully.
            </Notification>
        );
        triggerTableReload(); // Reload the table after removing the member
        setRemoveDialogOpen(false); // Close the dialog
    };

    const handleModifyRoleSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                Member role updated successfully.
            </Notification>
        );
        triggerTableReload(); // Reload the table after modifying the member role
        setModifyRoleDialogOpen(false); // Close the dialog
    };

    // Define columns for the MemberTable
    const memberColumns: ColumnDef<TenantMember>[] = [
        { header: 'FullName', accessorKey: 'user.fullName' },
        { header: 'Email', accessorKey: 'user.email' },
        { header: 'Mobile', accessorKey: 'user.phoneNumber' },
        {
            header: 'Role',
            accessorKey: 'memberRole',
            cell: ({ row }: { row: { original: TenantMember } }) => {
                const { memberRole } = row.original;
                const name = TenantMemberRole[memberRole];
                return (
                    <span className={`px-2 py-1 rounded bg-blue-100`}>
                        {name}
                    </span>
                );
            },
        },
        {
            header: 'Status',
            accessorKey: 'memberStatus',
            cell: ({ row }: { row: { original: TenantMember } }) => {
                const { memberStatus } = row.original;
                const name = TenantMemberStatus[memberStatus];
                return (
                    <span className={`px-2 py-1 rounded bg-green-100`}>
                        {name}
                    </span>
                );
            },
        },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: TenantMember } }) => {
                const { memberRole } = row.original;

                // Owner cannot be removed or modified
                if (memberRole === TenantMemberRole.Owner) {
                    return null;
                }

                return (
                    <div className="flex gap-2">
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => {
                                setMemberToModifyRole(row.original); // Set the member to modify role
                                setModifyRoleDialogOpen(true); // Open the modify role dialog
                            }}
                        >
                            Modify
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={() => {
                                setMemberToBeRemoved(row.original); // Set the member to be removed
                                setRemoveDialogOpen(true); // Open the dialog
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <div className="flex gap-4 justify-between items-center mb-4">
                <DebouncedInput
                    className="border-gray-200 bg-white focus:bg-white"
                    value={searchFilter}
                    onChange={(value) => setSearchFilter(value)} // Update search filter
                    placeholder="Search members..."
                />
            </div>

            <MemberTable
                columns={memberColumns}
                searchFilter={searchFilter}
                reload={reload} // Pass reload state to table
            />

            <RemoveMemberDialog
                isOpen={isRemoveDialogOpen}
                onClose={() => setRemoveDialogOpen(false)}
                item={memberToBeRemoved}
                onSuccess={handleRemoveSuccess}
                onError={handleActionError}
            />

            <ModifyRoleDialog
                isOpen={isModifyRoleDialogOpen}
                onClose={() => setModifyRoleDialogOpen(false)}
                member={memberToModifyRole}
                onSuccess={handleModifyRoleSuccess}
                onError={handleActionError}
            />
        </div>
    );
};

export default MembersPage;
