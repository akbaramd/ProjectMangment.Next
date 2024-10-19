import { useState, useEffect } from 'react';
import { Table, Card, Spinner } from '@/components/ui';
import { useReactTable, flexRender, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import Notification from '@/components/ui/Notification';
import { RoleWithPermissionsDto } from '@/@types/auth';
import { apiGetRolesForTenant } from '@/services/TenantRoleService';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

interface RoleTableProps {
    columns: ColumnDef<RoleWithPermissionsDto>[];  // ستون‌های جدول نقش‌ها
    searchFilter: string | number;  // فیلتر جستجو برای فیلتر کلاینتی
    reload: boolean;  // کنترل زمان بارگذاری مجدد داده‌ها
}

const RoleTable = ({ columns, searchFilter, reload }: RoleTableProps) => {
    const [rolesList, setRolesList] = useState<RoleWithPermissionsDto[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<RoleWithPermissionsDto[]>([]);  // فیلتر کردن در سمت کلاینت
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRolesList = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await apiGetRolesForTenant();  // دریافت لیست نقش‌ها
                setRolesList(response);
                setFilteredRoles(response);  // در ابتدا نمایش تمام نقش‌ها
            } catch (err: any) {
                setFetchError('خطا در دریافت نقش‌ها');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRolesList();
    }, [reload]);  // بارگذاری مجدد داده‌ها هر زمان که reload تغییر کند

    useEffect(() => {
        // اعمال فیلتر کلاینتی بر اساس searchFilter
        const filtered = rolesList.filter(role => {
            const search = searchFilter.toString().toLowerCase();
            return (
                role.title.toLowerCase().includes(search) ||  // فیلتر بر اساس عنوان نقش
                role.permissions.some(permission => permission.name.toLowerCase().includes(search))  // فیلتر بر اساس نام مجوز
            );
        });
        setFilteredRoles(filtered);
    }, [searchFilter, rolesList]);

    const table = useReactTable({
        data: filteredRoles,  // استفاده از نقش‌های فیلتر شده برای نمایش جدول
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <Card className="flex justify-center items-center text-center">
                <div>
                    <Spinner className="mx-auto mb-4" size="30px" />
                    <p className="font-medium">در حال بارگذاری نقش‌ها، لطفاً منتظر بمانید...</p>
                </div>
            </Card>
        );
    }

    if (fetchError) {
        return (
            <Notification title="خطا" type="danger">
                {fetchError}
            </Notification>
        );
    }

    return (
        <Card className="overflow-hidden">
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <Sorter sort={header.column.getIsSorted()} />
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => (
                        <Tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <Td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    );
};

export default RoleTable;
