import { useState } from 'react'
import DebouncedInput from './DebouncedInput'
import InvitationTable from './InvitationTable'
import SendInvitationDialog from './SendInvitationDialog'
import CancelInvitationDialog from './CancelInvitationDialog'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { ColumnDef } from '@tanstack/react-table'
import { Invitation, InvitationStatus } from '@/@types/invitations'
import { useNavigate } from 'react-router-dom'

const InvitationsPage = () => {
    const [searchFilter, setSearchFilter] = useState<string | number>(''); // Track search filter
    const [isSendDialogOpen, setSendDialogOpen] = useState(false);
    const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [invitationToBeCancelled, setInvitationToBeCancelled] = useState<Invitation | null>(null);
    const [reload, setReload] = useState(false); // Track reload state for the table
    const navigate = useNavigate();

    const triggerTableReload = () => {
        setReload((prev) => !prev); // Toggle reload to trigger table refresh
    };

    const handleSendSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                Invitation sent successfully.
            </Notification>
        );
        triggerTableReload(); // Reload the table after sending invitation
        setSendDialogOpen(false);
    };

    const handleSendError = (message: string) => {
        toast.push(
            <Notification title="Error" type="danger">
                {message}
            </Notification>
        );
    };

    const handleCancelSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                Invitation cancelled successfully.
            </Notification>
        );
        triggerTableReload(); // Reload the table after canceling invitation
        setCancelDialogOpen(false);
    };

    const handleCancelError = (message: string) => {
        toast.push(
            <Notification title="Error" type="danger">
                {message}
            </Notification>
        );
    };

    // Define columns for the InvitationTable
    const invitationColumns: ColumnDef<Invitation>[] = [
        { header: 'Phone Number', accessorKey: 'phoneNumber' },
        {
            header: 'Created At',
            accessorKey: 'createdAt',
            cell: ({ row }: { row: { original: Invitation } }) => {
                return new Date(row.original.createdAt).toLocaleString();
            },
        },
        {
            header: 'Expiration Date',
            accessorKey: 'expirationDate',
            cell: ({ row }: { row: { original: Invitation } }) => {
                return new Date(row.original.expirationDate).toLocaleString();
            },
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }: { row: { original: Invitation } }) => {
                const { status } = row.original;

                // Mapping status to label and background color
                const statusMap = {
                    [InvitationStatus.Pending]: { label: 'Pending', color: 'bg-yellow-100' },
                    [InvitationStatus.Accepted]: { label: 'Accepted', color: 'bg-green-100' },
                    [InvitationStatus.Rejected]: { label: 'Rejected', color: 'bg-red-100' },
                    [InvitationStatus.Cancel]: { label: 'Cancel', color: 'bg-blue-100' },
                };

                const { label, color } = statusMap[status] || { label: 'Unknown', color: 'bg-gray-100' };

                return (
                    <span className={`px-2 py-1 rounded ${color}`}>
                {label}
            </span>
                );
            },
        },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: Invitation } }) => {
                const {  id,status } = row.original;
                if (status==InvitationStatus.Pending) {
                    return (
                        <div className={"flex gap-2"}>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                    setInvitationToBeCancelled(row.original);
                                    setCancelDialogOpen(true);
                                }}
                                disabled={invitationToBeCancelled?.id === id}
                            >
                                {invitationToBeCancelled?.id === id ? 'Canceling...' : 'Cancel'}
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                    navigate(`/invitations/detail/${row.original.id}`)
                                }}
                                disabled={invitationToBeCancelled?.id === id}
                            >
                                Link
                            </Button>
                        </div>

                    );
                }

                return null;
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
                    placeholder="Search invitations..."
                />
                <Button variant="solid" onClick={() => setSendDialogOpen(true)}>
                    Send Invitation
                </Button>
            </div>

            <InvitationTable
                columns={invitationColumns}
                searchFilter={searchFilter}
                reload={reload} // Pass reload state to table
            />

            <SendInvitationDialog
                isOpen={isSendDialogOpen}
                onClose={() => setSendDialogOpen(false)}
                onSuccess={handleSendSuccess}
                onError={handleSendError}
            />

            <CancelInvitationDialog
                isOpen={isCancelDialogOpen}
                onClose={() => {
                    setCancelDialogOpen(false)
                    setInvitationToBeCancelled(null)
                }}
                item={invitationToBeCancelled}
                onSuccess={handleCancelSuccess}
                onError={handleCancelError}
            />
        </div>
    );
};

export default InvitationsPage;
