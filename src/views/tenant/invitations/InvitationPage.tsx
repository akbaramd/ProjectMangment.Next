import React, { useState } from 'react'
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
    const [searchFilter, setSearchFilter] = useState<string | number>(''); // پیگیری فیلتر جستجو
    const [isSendDialogOpen, setSendDialogOpen] = useState(false);
    const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [invitationToBeCancelled, setInvitationToBeCancelled] = useState<Invitation | null>(null);
    const [reload, setReload] = useState(false); // پیگیری حالت بارگذاری مجدد برای جدول
    const navigate = useNavigate();

    const triggerTableReload = () => {
        setReload((prev) => !prev); // تغییر حالت بارگذاری مجدد برای تازه‌سازی جدول
    };

    const handleSendSuccess = () => {
        toast.push(
            <Notification title="موفقیت" type="success">
                دعوت‌نامه با موفقیت ارسال شد.
            </Notification>
        );
        triggerTableReload(); // تازه‌سازی جدول پس از ارسال دعوت‌نامه
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
        triggerTableReload(); // تازه‌سازی جدول پس از لغو دعوت‌نامه
        setCancelDialogOpen(false);
    };

    const handleCancelError = (message: string) => {
        toast.push(
            <Notification title="خطا" type="danger">
                {message}
            </Notification>
        );
    };

    // تعریف ستون‌ها برای InvitationTable
    const invitationColumns: ColumnDef<Invitation>[] = [
        { header: 'شماره تلفن', accessorKey: 'phoneNumber' },
        {
            header: 'تاریخ ایجاد',
            accessorKey: 'createdAt',
            cell: ({ row }: { row: { original: Invitation } }) => {
                return new Date(row.original.createdAt).toLocaleString();
            },
        },
        {
            header: 'تاریخ انقضا',
            accessorKey: 'expirationDate',
            cell: ({ row }: { row: { original: Invitation } }) => {
                return new Date(row.original.expirationDate).toLocaleString();
            },
        },
        {
            header: 'وضعیت',
            accessorKey: 'status',
            cell: ({ row }: { row: { original: Invitation } }) => {
                const { status } = row.original;

                // نگاشت وضعیت به برچسب و رنگ پس‌زمینه
                const statusMap = {
                    [InvitationStatus.Pending]: { label: 'در انتظار', color: 'bg-yellow-100' },
                    [InvitationStatus.Accepted]: { label: 'پذیرفته شده', color: 'bg-green-100' },
                    [InvitationStatus.Rejected]: { label: 'رد شده', color: 'bg-red-100' },
                    [InvitationStatus.Cancel]: { label: 'لغو شده', color: 'bg-blue-100' },
                };

                const { label, color } = statusMap[status] || { label: 'نامشخص', color: 'bg-gray-100' };

                return (
                    <span className={`px-2 py-1 rounded ${color}`}>
                {label}
            </span>
                );
            },
        },
        {
            header: 'عملیات',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: Invitation } }) => {
                const { id, status } = row.original;
                if (status == InvitationStatus.Pending) {
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
                                {invitationToBeCancelled?.id === id ? 'در حال لغو...' : 'لغو'}
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                    navigate(`/invitations/detail/${row.original.id}`)
                                }}
                                disabled={invitationToBeCancelled?.id === id}
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

    return (
        <div>
            <div className="flex gap-4 justify-between items-center mb-4">
                <DebouncedInput
                    className="border-gray-200 bg-white focus:bg-white"
                    value={searchFilter}
                    onChange={(value) => setSearchFilter(value)} // به‌روزرسانی فیلتر جستجو
                    placeholder="جستجوی دعوت‌نامه‌ها..."
                />
                <Button variant="solid" onClick={() => setSendDialogOpen(true)}>
                    ارسال دعوت‌نامه
                </Button>
            </div>

            <InvitationTable
                columns={invitationColumns}
                searchFilter={searchFilter}
                reload={reload} // انتقال حالت بارگذاری مجدد به جدول
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
