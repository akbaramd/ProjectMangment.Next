import { useState } from 'react';
import MemberTable from './MemberTable';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { TenantMember, TenantMemberStatus } from '@/@types/tenant';
import DebouncedInput from '@/views/tenant/invitations/DebouncedInput';
import RemoveMemberDialog from './RemoveMemberDialog';
import ModifyRoleDialog from '@/views/tenant/members/ModifyMemberDialog'; // Import the new dialog

const MembersPage = () => {
    const [searchFilter, setSearchFilter] = useState<string | number>(''); // پیگیری فیلتر جستجو
    const [reload, setReload] = useState(false); // پیگیری وضعیت رفرش جدول
    const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
    const [isModifyRoleDialogOpen, setModifyRoleDialogOpen] = useState(false);
    const [memberToBeRemoved, setMemberToBeRemoved] = useState<TenantMember | null>(null); // پیگیری عضوی که قرار است حذف شود
    const [memberToModifyRole, setMemberToModifyRole] = useState<TenantMember | null>(null); // پیگیری عضوی که قرار است نقش آن تغییر کند
    const navigate = useNavigate();

    const triggerTableReload = () => {
        setReload((prev) => !prev); // تغییر وضعیت رفرش برای به‌روزرسانی جدول
    };

    const handleActionError = (message: string) => {
        toast.push(
            <Notification title="خطا" type="danger">
                {message}
            </Notification>
        );
    };

    const handleRemoveSuccess = () => {
        toast.push(
            <Notification title="موفقیت" type="success">
                عضو با موفقیت حذف شد.
            </Notification>
        );
        triggerTableReload(); // رفرش جدول بعد از حذف عضو
        setRemoveDialogOpen(false); // بستن دیالوگ
    };

    const handleModifyRoleSuccess = () => {
        toast.push(
            <Notification title="موفقیت" type="success">
                نقش عضو با موفقیت به‌روزرسانی شد.
            </Notification>
        );
        triggerTableReload(); // رفرش جدول بعد از تغییر نقش عضو
        setModifyRoleDialogOpen(false); // بستن دیالوگ
    };

    // تعریف ستون‌های جدول اعضا
    const memberColumns: ColumnDef<TenantMember>[] = [
        { header: 'نام کامل', accessorKey: 'user.fullName' },
        { header: 'ایمیل', accessorKey: 'user.email' },
        { header: 'موبایل', accessorKey: 'user.phoneNumber' },
        {
            header: 'نقش',
            accessorKey: 'roles',
            cell: ({ row }: { row: { original: TenantMember } }) => {
                const { roles } = row.original;
              
                return (
                    <span className={`px-2 py-1 rounded bg-blue-100`}>
                        {roles.map(x => x.title).join(' | ')}
                    </span>
                );
            },
        },
        {
            header: 'وضعیت',
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
            header: 'عملیات',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: TenantMember } }) => {
                const { roles } = row.original;

                // اطمینان از اینکه نقش 'Owner' قابل ویرایش نیست
                if (roles.find(x => x.title === 'Owner') === undefined) {
                    return (
                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                size="sm"
                                onClick={() => {
                                    setMemberToModifyRole(row.original); // تنظیم عضو برای تغییر نقش
                                    setModifyRoleDialogOpen(true); // باز کردن دیالوگ تغییر نقش
                                }}
                            >
                                ویرایش
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                    setMemberToBeRemoved(row.original); // تنظیم عضو برای حذف
                                    setRemoveDialogOpen(true); // باز کردن دیالوگ حذف
                                }}
                            >
                                حذف
                            </Button>
                        </div>
                    );
                } else {
                    return <small>نقش مالک قابل ویرایش نیست</small>;
                }
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
                    placeholder="جستجوی عضو..."
                />
            </div>

            <MemberTable
                columns={memberColumns}
                searchFilter={searchFilter}
                reload={reload} // ارسال وضعیت رفرش به جدول
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
