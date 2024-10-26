import React, { useState } from 'react';
import InvitationTable from './InvitationTable';
import SendInvitationDialog from './SendInvitationDialog';
import CancelInvitationDialog from './CancelInvitationDialog';
import { Button } from '@/components/ui';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { ColumnDef } from '@tanstack/react-table';
import { Invitation, InvitationStatus } from '@/@types/invitations';
import { useNavigate } from 'react-router-dom';
import { fetchInvitations } from '@/store/invitation/invitationActions';
import { useAppDispatch } from '@/store/configureStore';

const InvitationsPage = () => {
  const [isSendDialogOpen, setSendDialogOpen] = useState(false);
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [invitationToBeCancelled, setInvitationToBeCancelled] = useState<Invitation | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const triggerTableReload = () => {
    dispatch(fetchInvitations());
  };

  const handleSendSuccess = () => {
    toast.push(
      <Notification title="موفقیت" type="success">
        دعوت‌نامه با موفقیت ارسال شد.
      </Notification>
    );
    triggerTableReload();
    setSendDialogOpen(false);
  };

  const handleSendError = (message: string) => {
    toast.push(
      <Notification title="خطا" type="danger">
        {message}
      </Notification>
    );
  };

  const handleCancelSuccess = () => {
    toast.push(
      <Notification title="موفقیت" type="success">
        دعوت‌نامه با موفقیت لغو شد.
      </Notification>
    );
    triggerTableReload();
    setCancelDialogOpen(false);
  };

  const handleCancelError = (message: string) => {
    toast.push(
      <Notification title="خطا" type="danger">
        {message}
      </Notification>
    );
  };

  // Define columns for InvitationTable
  const invitationColumns: ColumnDef<Invitation, any>[] = [
    {
      header: 'شماره تلفن',
      id: 'phoneNumber',
      accessorKey: 'phoneNumber',
      enableSorting: true,
    },
    {
      header: 'تاریخ ایجاد',
      id: 'createdAt',
      accessorKey: 'createdAt',
      enableSorting: true,
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString();
      },
    },
    {
      header: 'تاریخ انقضا',
      id: 'expirationDate',
      accessorKey: 'expirationDate',
      enableSorting: true,
      cell: ({ row }) => {
        return new Date(row.original.expirationDate).toLocaleString();
      },
    },
    {
      header: 'وضعیت',
      id: 'status',
      accessorKey: 'status',
      enableSorting: true,
      cell: ({ row }) => {
        const { status } = row.original;


        return <span className={`px-2 py-1 rounded`}>{status.name}</span>;
      },
    },
    {
      header: 'عملیات',
      accessorKey: 'action',
      enableSorting: false,
      cell: ({ row }) => {
        const { id, status } = row.original;
        if (status.name === "") {
          return (
            <div className="flex gap-2">
              <Button
                color="danger"
                size="sm"
                onClick={() => {
                  setInvitationToBeCancelled(row.original);
                  setCancelDialogOpen(true);
                }}
                disabled={invitationToBeCancelled?.id === id}
              >
                {invitationToBeCancelled?.id === id ? 'در حال لغو...' : 'لغو'}
              </Button>
              <Button
                color="primary"
                size="sm"
                onClick={() => {
                  navigate(`/invitations/detail/${row.original.id}`);
                }}
              >
                لینک
              </Button>
            </div>
          );
        }
        return null;
      },
    },
  ];

  // Additional elements to be passed to DynamicTable
  const additionalElements = (
    <Button variant="solid" onClick={() => setSendDialogOpen(true)}>
      ارسال دعوت‌نامه
    </Button>
  );

  return (
    <div>
      <InvitationTable
        columns={invitationColumns}
        searchPlaceholder="جستجوی دعوت‌نامه‌ها..."
        additionalElements={additionalElements}
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
          setCancelDialogOpen(false);
          setInvitationToBeCancelled(null);
        }}
        item={invitationToBeCancelled}
        onSuccess={handleCancelSuccess}
        onError={handleCancelError}
      />
    </div>
  );
};

export default InvitationsPage;
