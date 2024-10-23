// src/components/MemberTable.tsx

import { useEffect } from 'react';
import { ColumnDef, SortingState, OnChangeFn } from '@tanstack/react-table';
import { TenantMember } from '@/@types/tenant';
import DynamicTable from '@/components/DynamicTable';
import { Button } from '@/components/ui';
import { FaPlus } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/store/configureStore';
import { setCurrentPage, setSearchFilter, setSorting } from '@/store/invitation/invitationSlice';
import { fetchTenantMembers } from '@/store/tenant-member/tenantMemberActions';
import { selectTenantMembers, selectTenantMembersIsLoading, selectTenantMembersError, selectTenantMembersTotalRecords, selectTenantMembersCurrentPage, selectTenantMembersRowsPerPage, selectTenantMembersSortField, selectTenantMembersSortOrder, selectTenantMembersSearchFilter } from '@/store/tenant-member/tenantMemberSelectors';

interface MemberTableProps {
  columns: ColumnDef<TenantMember>[];
  additionalElements?: React.ReactNode;
}

const MemberTable = ({ columns, additionalElements }: MemberTableProps) => {
  const dispatch = useAppDispatch();

  // Selectors
  const data = useAppSelector(selectTenantMembers);
  const isLoading = useAppSelector(selectTenantMembersIsLoading);
  const error = useAppSelector(selectTenantMembersError);
  const totalRecords = useAppSelector(selectTenantMembersTotalRecords);
  const currentPage = useAppSelector(selectTenantMembersCurrentPage);
  const rowsPerPage = useAppSelector(selectTenantMembersRowsPerPage);
  const sortField = useAppSelector(selectTenantMembersSortField);
  const sortOrder = useAppSelector(selectTenantMembersSortOrder);
  const searchFilter = useAppSelector(selectTenantMembersSearchFilter);

  useEffect(() => {
    dispatch(fetchTenantMembers());
  }, [dispatch, currentPage, searchFilter, sortField, sortOrder]);

  const handlePaginationChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleFilterChange = (filter: string) => {
    dispatch(setSearchFilter(filter));
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    if (Array.isArray(updaterOrValue) && updaterOrValue.length > 0) {
      const { id, desc } = updaterOrValue[0];
      dispatch(
        setSorting({
          field: id,
          order: desc ? 'desc' : 'asc',
        })
      );
    }
  };

  const handleSortFieldChange = (field: string, order: 'asc' | 'desc') => {
    dispatch(
      setSorting({
        field,
        order,
      })
    );
  };

  return (
    <DynamicTable<TenantMember>
      title="لیست اعضا"
      columns={columns}
      data={data}
      totalRecords={totalRecords}
      currentPage={currentPage}
      rowsPerPage={rowsPerPage}
      isLoading={isLoading}
      fetchError={error}
      sorting={[
        {
          id: sortField,
          desc: sortOrder === 'desc',
        },
      ]}
      onSortingChange={handleSortingChange}
      onPaginationChange={handlePaginationChange}
      onFilterChange={handleFilterChange}
      onSortFieldChange={handleSortFieldChange}
      additionalElements={additionalElements}
      searchPlaceholder="جستجوی اعضا ..."
    />
  );
};

export default MemberTable;
