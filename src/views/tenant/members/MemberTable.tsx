import { useState, useEffect } from 'react';
import { ColumnDef, SortingState, OnChangeFn } from '@tanstack/react-table';
import { apiGetTenantMembers } from '@/services/TenantService';
import { TenantMember } from '@/@types/tenant';
import DynamicTable from '@/components/DynamicTable';
import { Button } from '@/components/ui';
import { FaUsers } from 'react-icons/fa';
import { PiPlusDuotone } from 'react-icons/pi';

interface MemberTableProps {
    reload?: boolean;
}

const columns: ColumnDef<TenantMember>[] = [
    {
        accessorKey: 'user.fullName',
        id: 'fullName',
        header: 'Full Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
    },
    {
        accessorKey: 'user.email',
        id: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
        enableSorting: true,
    },
    {
        accessorKey: 'user.phoneNumber',
        id: 'phoneNumber',
        header: 'Phone Number',
        cell: (info) => info.getValue(),
        enableSorting: true,
    },
    // Add more columns as needed
];

const MemberTable = ({ reload }: MemberTableProps) => {
    const [data, setData] = useState<TenantMember[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [searchFilter, setSearchFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);

    const fetchMembers = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const response = await apiGetTenantMembers(rowsPerPage, (currentPage - 1) * rowsPerPage, searchFilter);

            setData(response.results); // Adjust based on your API response structure
            setTotalRecords(response.totalCount); // Adjust based on your API response structure
        } catch (error: any) {
            setFetchError('Error fetching members.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [currentPage, searchFilter, sorting, reload]);

    const handlePaginationChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (filter: string) => {
        setSearchFilter(filter);
        setCurrentPage(1);
    };

    const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
        setSorting((old) => {
            const newSorting =
                typeof updaterOrValue === 'function' ? updaterOrValue(old) : updaterOrValue;
            return newSorting;
        });
        setCurrentPage(1);
    };

    return (
        <DynamicTable<TenantMember>
            title="Members List"
            columns={columns}
            data={data}
            totalRecords={totalRecords}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            isLoading={isLoading}
            fetchError={fetchError}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            onPaginationChange={handlePaginationChange}
            onFilterChange={handleFilterChange}
            sortableColumns={[
                { id: 'fullName', label: 'Full Name' },
                { id: 'email', label: 'Email' },
                { id: 'phoneNumber', label: 'Phone Number' },
                // Add other sortable columns as needed
            ]}
            additionalElements={
                <Button variant="solid" onClick={() => { /* Add member logic */ }}>
                    <PiPlusDuotone/>
                </Button>
            }
            searchPlaceholder="Search members..."
        />
    );
};

export default MemberTable;
