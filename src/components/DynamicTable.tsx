import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Spinner,
  Input,
  Drawer,
  Button,
  Select,
} from '@/components/ui';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  OnChangeFn,
  RowData,
} from '@tanstack/react-table';
import Notification from '@/components/ui/Notification';
import Pagination from '@/components/ui/Pagination';
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaMinus,
  FaFilter,
} from 'react-icons/fa';

const { Tr, Th, Td, THead, TBody } = Table;

interface OptionType {
  value: string;
  label: string;
}

interface DynamicTableProps<TData extends RowData> {
  title: string;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  totalRecords: number;
  currentPage: number;
  rowsPerPage: number;
  isLoading: boolean;
  fetchError: string | null;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onPaginationChange: (page: number) => void;
  onFilterChange: (filter: string) => void;
  onSortFieldChange: (sortField: string, sortOrder: 'asc' | 'desc') => void;
  additionalElements?: React.ReactNode;
  additionalFilterElements?: React.ReactNode;
  searchPlaceholder?: string;
  className?: string;
}

function DynamicTable<TData extends RowData>({
  title,
  columns,
  data,
  totalRecords,
  currentPage,
  rowsPerPage,
  isLoading,
  fetchError,
  sorting,
  onSortingChange,
  onPaginationChange,
  onFilterChange,
  onSortFieldChange,
  additionalElements,
  additionalFilterElements,
  searchPlaceholder = 'جستجو...',
  className = '',
}: DynamicTableProps<TData>) {
  // Generate sortableFields from columns
  const sortableFields: OptionType[] = columns
    .filter((column) => column.enableSorting)
    .map((column) => ({
      value: column.id || '',
      label:
        (typeof column.header === 'string'
          ? column.header
          : String(column.id)) || '',
    }));

  const sortOrderOptions: OptionType[] = [
    { value: 'asc', label: 'صعودی' },
    { value: 'desc', label: 'نزولی' },
  ];

  const [searchFilter, setSearchFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [localSortField, setLocalSortField] = useState<OptionType | null>(null);
  const [localSortOrder, setLocalSortOrder] = useState<OptionType>(
    sortOrderOptions[0]
  );

  // Initialize localSortField and localSortOrder when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      if (sorting.length > 0) {
        const selectedField =
          sortableFields.find((option) => option.value === sorting[0].id) ||
          sortableFields[0] ||
          null;
        setLocalSortField(selectedField);
        const selectedOrder = sorting[0].desc
          ? sortOrderOptions.find((option) => option.value === 'desc')
          : sortOrderOptions.find((option) => option.value === 'asc');
        setLocalSortOrder(selectedOrder || sortOrderOptions[0]);
      } else {
        setLocalSortField(sortableFields[0] || null);
        setLocalSortOrder(sortOrderOptions[0]);
      }
      // Optionally set the search filter if you want to keep it
      // setSearchFilter(currentSearchFilter);
    }
  }, [isDrawerOpen]); // Removed sorting and sortableFields from dependencies

  // Close drawer when loading is completed after applying filters
  useEffect(() => {
    if (!isLoading && isApplyingFilters) {
      setIsApplyingFilters(false);
      setIsDrawerOpen(false);
    }
  }, [isLoading, isApplyingFilters]);

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  // Check if any column has responsive metadata
  const hasResponsiveColumns = columns.some((col) => col.meta?.responsive);

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchFilter(value);
  };

  const applyFilters = () => {
    const sortFieldToUse =
      localSortField?.value ||
      (sortableFields.length > 0 ? sortableFields[0].value : '');
    const sortOrderToUse = localSortOrder?.value || 'asc';
    onFilterChange(searchFilter);
    onSortFieldChange(sortFieldToUse, sortOrderToUse as 'asc' | 'desc');
    setIsApplyingFilters(true);
    // The drawer will close in useEffect when loading is completed
  };

  const resetFilters = () => {
    setSearchFilter('');
    setLocalSortField(sortableFields[0] || null);
    setLocalSortOrder(sortOrderOptions[0]);
    onFilterChange('');
    onSortFieldChange(
      sortableFields[0]?.value || '',
      sortOrderOptions[0].value as 'asc' | 'desc'
    );
    setIsApplyingFilters(true);
    // The drawer will close in useEffect when loading is completed
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <>
      <Card
        bodyClass="p-0"
        className={`overflow-hidden ${className}`}
        header={{
          content: (
            <div className="flex items-center justify-between">
              {/* Title */}
              <h2 className="text-lg font-semibold">{title}</h2>

              {/* Right Side (Filter Button and Additional Elements) */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {additionalElements}

                {/* Filter button */}
                <Button
                  onClick={() => setIsDrawerOpen(true)}
                  icon={<FaFilter />}
                >
                  {/* Optional button text */}
                </Button>
              </div>
            </div>
          ),
        }}
        footer={{
          content: (
            <div className="flex items-center justify-between">
              <span>
                صفحه <strong>{currentPage}</strong> از{' '}
                <strong>{totalPages}</strong>
              </span>
              <Pagination
                pageSize={rowsPerPage}
                currentPage={currentPage}
                total={totalRecords}
                onChange={onPaginationChange}
              />
            </div>
          ),
        }}
      >
        {/* Responsive table container */}
        <div className="overflow-x-auto">
          <Table>
            {isLoading || data.length === 0 || fetchError ? null : (
              <THead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {/* Empty header for the plus icon */}
                    {hasResponsiveColumns && <Th className="lg:hidden"></Th>}
                    {headerGroup.headers.map((header) => {
                      const isResponsive =
                        header.column.columnDef.meta?.responsive;
                      const headerClasses = isResponsive
                        ? 'hidden lg:table-cell'
                        : '';
                      return (
                        <Th
                          key={header.id}
                          colSpan={header.colSpan}
                          className={headerClasses}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                header.column.getCanSort()
                                  ? ' flex items-center gap-2'
                                  : ''
                              }
                            >
                              {header.column.getIsSorted() && (
                                <span className="ml-1">
                                  {header.column.getIsSorted() === 'desc' ? (
                                    <FaChevronDown />
                                  ) : (
                                    <FaChevronUp />
                                  )}
                                </span>
                              )}
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                          )}
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </THead>
            )}
            <TBody>
              {isLoading ? (
                <Tr>
                  <Td
                    colSpan={columns.length + (hasResponsiveColumns ? 1 : 0)}
                    className="text-center py-4"
                  >
                    <Spinner className="mx-auto mb-4" size="30px" />
                    <p className="font-medium">در حال بارگذاری...</p>
                  </Td>
                </Tr>
              ) : fetchError ? (
                <Tr>
                  <Td
                    colSpan={columns.length + (hasResponsiveColumns ? 1 : 0)}
                    className="text-center py-4"
                  >
                    <Notification title="خطا" type="danger">
                      {fetchError}
                    </Notification>
                  </Td>
                </Tr>
              ) : data.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={columns.length + (hasResponsiveColumns ? 1 : 0)}
                    className="text-center py-4"
                  >
                    داده‌ای یافت نشد
                  </Td>
                </Tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <Tr className="hover:bg-gray-50">
                      {/* Plus icon cell */}
                      {hasResponsiveColumns && (
                        <Td className="px-4 py-2 text-sm text-gray-700 lg:hidden">
                          <button onClick={() => toggleRowExpansion(row.id)}>
                            {expandedRows[row.id] ? (
                              <FaMinus />
                            ) : (
                              <FaPlus />
                            )}
                          </button>
                        </Td>
                      )}
                      {row.getVisibleCells().map((cell) => {
                        const isResponsive =
                          cell.column.columnDef.meta?.responsive;
                        const cellClasses = isResponsive
                          ? 'hidden lg:table-cell'
                          : '';
                        return (
                          <Td
                            key={cell.id}
                            className={`px-4 py-2 text-sm text-gray-700 ${cellClasses}`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                    {/* Expanded row content for responsive columns */}
                    {expandedRows[row.id] && (
                      <Tr className="lg:hidden">
                        <Td
                          colSpan={columns.length + 1}
                          className="px-4 py-2"
                        >
                          <div className="bg-gray-50 p-2">
                            {row.getAllCells().map((cell) => {
                              const isResponsive =
                                cell.column.columnDef.meta?.responsive;
                              if (isResponsive) {
                                return (
                                  <div
                                    key={cell.id}
                                    className="flex justify-between py-1"
                                  >
                                    <span className="font-medium">
                                      {cell.column.columnDef.header as string}
                                    </span>
                                    <span>
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </Card>

      {/* Drawer for Filters */}
      <Drawer
        title="فیلتر"
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block font-medium mb-1">جستجو</label>
            <Input
              value={searchFilter}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">فیلتر با</label>
            <Select
              placeholder="انتخاب کنید"
              options={sortableFields}
              value={localSortField || sortableFields[0]}
              onChange={(option) => setLocalSortField(option)}
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">نوع فیلتر</label>
            <Select
              placeholder="انتخاب کنید"
              options={sortOrderOptions}
              value={localSortOrder}
              onChange={(option) => setLocalSortOrder(option as OptionType)}
            />
          </div>

          {/* Additional Filters */}
          {additionalFilterElements && (
            <div className="mb-4">{additionalFilterElements}</div>
          )}

          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button
              variant="solid"
              onClick={applyFilters}
              loading={isApplyingFilters}
            >
              اعمال فیلتر
            </Button>
            <Button onClick={resetFilters}>
              بازنشانی فیلترها
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default DynamicTable;
