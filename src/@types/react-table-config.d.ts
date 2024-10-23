// react-table-config.d.ts
import { ColumnMeta, AccessorFnColumnDef } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // Extend the ColumnMeta interface to include your custom properties
  interface ColumnMeta<TData, TValue> {
    responsive?: boolean;
  }

  // Ensure that AccessorFnColumnDef uses your extended ColumnMeta
  interface AccessorFnColumnDef<TData, TValue> {
    meta?: ColumnMeta<TData, TValue>;
  }
}
