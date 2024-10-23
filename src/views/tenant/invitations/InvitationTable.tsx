// src/components/InvitationTable.tsx
import React, { useEffect } from 'react';

import { ColumnDef, OnChangeFn, SortingState } from '@tanstack/react-table';
import DynamicTable from '@/components/DynamicTable';
import { Invitation } from '@/@types/invitations';
import { fetchInvitations } from '@/store/invitation/invitationActions';
import { useAppDispatch, useAppSelector } from '@/store/configureStore';
import { selectInvitations, selectIsLoading, selectError, selectInvitationState } from '@/store/invitation/invitationSelectors';
import { setCurrentPage, setSearchFilter, setSorting } from '@/store/invitation/invitationSlice';

interface InvitationTableProps {
  columns: ColumnDef<Invitation, any>[];
  searchPlaceholder?: string;
  additionalElements?: React.ReactNode;
}

const InvitationTable = ({ columns, searchPlaceholder, additionalElements }: InvitationTableProps) => {
  const dispatch = useAppDispatch();
  const invitations = useAppSelector(selectInvitations);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const {
    currentPage,
    rowsPerPage,
    totalRecords,
    searchFilter,
    sortField,
    sortOrder,
  } = useAppSelector(selectInvitationState);

  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch, currentPage, searchFilter, sortField, sortOrder]);

  const handlePaginationChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleFilterChange = (filter: string) => {
    dispatch(setSearchFilter(filter));
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    if (Array.isArray(updaterOrValue) && updaterOrValue.length > 0) {
      dispatch(
        setSorting({
          field: updaterOrValue[0].id,
          order: updaterOrValue[0].desc ? 'desc' : 'asc',
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
    <DynamicTable<Invitation>
      title="دعوت‌نامه‌ها"
      columns={columns}
      data={invitations}
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
      searchPlaceholder={searchPlaceholder || 'جستجوی دعوت‌نامه‌ها...'}
      additionalElements={additionalElements}
    />
  );
};

export default InvitationTable;
