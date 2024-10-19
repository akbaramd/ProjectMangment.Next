import { useState, useEffect } from 'react';
import RoleTable from './RoleTable';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { RoleWithPermissionsDto, PermissionDto } from '@/@types/auth';
import DebouncedInput from '@/views/tenant/invitations/DebouncedInput';
import AddRoleDialog from './AddRoleDialog';
import ModifyRoleDialog from './ModifyRoleDialog';
import RemoveRoleDialog from './RemoveRoleDialog';
import { apiGetPermissionGroups } from '@/services/TenantRoleService';

const RolesPage = () => {
    const [searchFilter, setSearchFilter] = useState<string | number>(''); // پیگیری فیلتر جستجو
    const [reload, setReload] = useState(false); // پیگیری وضعیت رفرش شدن جدول
    const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
    const [isModifyRoleDialogOpen, setModifyRoleDialogOpen] = useState(false);
    const [isAddRoleDialogOpen, setAddRoleDialogOpen] = useState(false);
    const [roleToBeRemoved, setRoleToBeRemoved] = useState<RoleWithPermissionsDto | null>(null); // پیگیری نقش حذف‌شده
    const [roleToModify, setRoleToModify] = useState<RoleWithPermissionsDto | null>(null); // پیگیری نقش ویرایش‌شده
    const [permissionOptions, setPermissionOptions] = useState<PermissionDto[]>([]); // ذخیره داده‌های مجوزها
    const navigate = useNavigate();

    useEffect(() => {
        // گرفتن لیست مجوزها در زمان لود کامپوننت
        const fetchPermissions = async () => {
            try {
                const permissions = await apiGetPermissionGroups();
                const flattenedPermissions = permissions.flatMap(group => 
                    group.permissions.map(permission => ({ key: permission.key, name: permission.name }))
                );
                setPermissionOptions(flattenedPermissions);
            } catch (error) {
                toast.push(
                    <Notification title="خطا" type="danger">
                        بارگذاری مجوزها شکست خورد.
                    </Notification>
                );
            }
        };

        fetchPermissions();
    }, []); // فقط در هنگام بارگذاری کامپوننت

    const triggerTableReload = () => {
        setReload((prev) => !prev); // تغییر وضعیت رفرش برای به‌روز رسانی جدول
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
                نقش با موفقیت حذف شد.
            </Notification>
        );
        triggerTableReload(); // رفرش جدول بعد از حذف نقش
        setRemoveDialogOpen(false); // بستن دیالوگ
    };

    const handleModifyRoleSuccess = () => {
        toast.push(
            <Notification title="موفقیت" type="success">
                نقش با موفقیت به‌روزرسانی شد.
            </Notification>
        );
        triggerTableReload(); // رفرش جدول بعد از ویرایش نقش
        setModifyRoleDialogOpen(false); // بستن دیالوگ
    };

    const handleAddRoleSuccess = () => {
        toast.push(
            <Notification title="موفقیت" type="success">
                نقش با موفقیت اضافه شد.
            </Notification>
        );
        triggerTableReload(); // رفرش جدول بعد از اضافه کردن نقش جدید
        setAddRoleDialogOpen(false); // بستن دیالوگ
    };

    // تعریف ستون‌های جدول نقش‌ها
    const roleColumns: ColumnDef<RoleWithPermissionsDto>[] = [
        { header: 'عنوان نقش', accessorKey: 'title' },
        {
            header: 'مجوزها',
            accessorKey: 'permissions',
            cell: ({ row }: { row: { original: RoleWithPermissionsDto } }) => {
                const { permissions } = row.original;
                return <span className="text-sm">{permissions.length}</span>;
            },
        },
        {
            header: 'عملیات',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: RoleWithPermissionsDto } }) => {
                if (row.original.deletable) {
                    return (
                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                size="sm"
                                onClick={() => {
                                    setRoleToModify(row.original); // تعیین نقش برای ویرایش
                                    setModifyRoleDialogOpen(true); // باز کردن دیالوگ ویرایش نقش
                                }}
                            >
                                ویرایش
                            </Button>
                            <Button
                                color="danger"
                                size="sm"
                                onClick={() => {
                                    setRoleToBeRemoved(row.original); // تعیین نقش برای حذف
                                    setRemoveDialogOpen(true); // باز کردن دیالوگ حذف
                                }}
                            >
                                حذف
                            </Button>
                        </div>
                    );
                } else {
                    return <small>نقش سیستمی</small>;
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
                    onChange={(value) => setSearchFilter(value)} // بروزرسانی فیلتر جستجو
                    placeholder="جستجوی نقش‌ها..."
                />
                <Button
                    color="primary"
                    size="sm"
                    onClick={() => setAddRoleDialogOpen(true)} // باز کردن دیالوگ افزودن نقش
                >
                    افزودن نقش
                </Button>
            </div>

            <RoleTable
                columns={roleColumns}
                searchFilter={searchFilter}
                reload={reload} // ارسال وضعیت رفرش به جدول
            />

            <RemoveRoleDialog
                isOpen={isRemoveDialogOpen}
                onClose={() => setRemoveDialogOpen(false)}
                role={roleToBeRemoved}
                onSuccess={handleRemoveSuccess}
                onError={handleActionError}
            />

            <ModifyRoleDialog
                isOpen={isModifyRoleDialogOpen}
                onClose={() => setModifyRoleDialogOpen(false)}
                role={roleToModify}
                onSuccess={handleModifyRoleSuccess}
                onError={handleActionError}
                permissionOptions={permissionOptions} // ارسال مجوزها به دیالوگ ویرایش
            />

            <AddRoleDialog
                isOpen={isAddRoleDialogOpen}
                onClose={() => setAddRoleDialogOpen(false)}
                onSuccess={handleAddRoleSuccess}
                onError={handleActionError}
                permissionOptions={permissionOptions} // ارسال مجوزها به دیالوگ افزودن
            />
        </div>
    );
};

export default RolesPage;
