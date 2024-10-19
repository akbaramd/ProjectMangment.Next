import { useState, useEffect } from 'react';
import { Table, Card, Spinner } from '@/components/ui';
import { useReactTable, flexRender, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import { apiGetTenantMembers } from '@/services/TenantService';
import Notification from '@/components/ui/Notification';
import { TenantMember } from '@/@types/tenant';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

interface MemberTableProps {
    columns: ColumnDef<TenantMember>[];
    searchFilter: string | number; // Add searchFilter as a prop for client-side filtering
    reload: boolean; // Prop to control when to reload the data
}

const MemberTable = ({ columns, searchFilter, reload }: MemberTableProps) => {
    const [membersList, setMembersList] = useState<TenantMember[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<TenantMember[]>([]); // For client-side filtering
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembersList = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await apiGetTenantMembers(); // Fetch all members without pagination
                setMembersList(response);
                setFilteredMembers(response); // Initially, show all members
            } catch (err: any) {
                if (err.response?.status === 403) {
                    setFetchError('You do not have permission to view members.');
                } else if (err.message === 'Network Error') {
                    setFetchError('Network error. Please check your connection.');
                } else {
                    setFetchError('Error fetching members.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembersList();
    }, [reload]); // Reload data whenever reload changes

    useEffect(() => {
        // Apply client-side filtering based on searchFilter
        const filtered = membersList.filter((member) => {
            const search = searchFilter.toString().toLowerCase();
            return (
                member.user.phoneNumber.toLowerCase().includes(search) ||
                member.user.email.toLowerCase().includes(search) ||
                member.user.fullName.toLowerCase().includes(search)
            );
        });
        setFilteredMembers(filtered);
    }, [searchFilter, membersList]);

    const table = useReactTable({
        data: filteredMembers, // Use filtered members for table display
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <Card className="flex justify-center items-center text-center">
                <div>
                    <Spinner className="mx-auto mb-4" size="30px" />
                    <p className="font-medium">Loading data, please wait...</p>
                </div>
            </Card>
        );
    }

    if (fetchError) {
        return (
            <Notification title="Error" type="danger">
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

export default MemberTable;
