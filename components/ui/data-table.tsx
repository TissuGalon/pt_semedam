"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  filename?: string;
  toolbarChildren?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Cari data...",
  filename = "data-export",
  toolbarChildren,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleExport = () => {
    const exportData = table.getFilteredRowModel().rows.map((row) => {
      const rowData: any = {};
      row.getVisibleCells().forEach((cell) => {
        const columnHeader = cell.column.columnDef.header;
        const columnName = typeof columnHeader === 'string' ? columnHeader : cell.column.id;
        if (columnName !== 'actions' && columnName !== 'Aksi') {
          rowData[columnName] = cell.getValue();
        }
      });
      return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
    <div className="space-y-4">
      {/* Search & Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9 bg-white border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm rounded-md h-9 text-xs"
            />
          </div>
          {toolbarChildren}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-9 px-3 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all rounded-md shadow-sm font-medium text-xs"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Excel</span>
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-200">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-10 px-4 py-2 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-1.5",
                              header.column.getCanSort() && "cursor-pointer select-none"
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className={cn(
                                "h-3 w-3 transition-colors",
                                header.column.getIsSorted() ? "text-emerald-600" : "text-slate-300"
                              )} />
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="group border-slate-200 hover:bg-slate-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3 text-xs text-slate-600">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in duration-300">
                      <Search className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-xs font-semibold">Data tidak ditemukan.</p>
                      <p className="text-[10px] opacity-70">Coba kata kunci pencarian yang berbeda.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination & Stats */}
        <div className="bg-slate-50/50 border-t border-slate-200 p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>Tampilkan</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="bg-white border border-slate-200 rounded-md px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer shadow-sm text-xs"
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span>baris</span>
            </div>
            <div className="h-3 w-px bg-slate-200 hidden sm:block"></div>
            <div className="text-[11px] text-slate-500">
              Menampilkan <span className="text-slate-900 font-bold">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> - <span className="text-slate-900 font-bold">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> dari <span className="text-slate-900 font-bold">{table.getFilteredRowModel().rows.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            
            <div className="flex items-center gap-1 mx-1.5 text-xs">
              <span className="font-semibold text-slate-700">Hal</span>
              <div className="flex items-center justify-center bg-slate-200 text-slate-800 w-5.5 h-5.5 rounded text-[11px] font-bold">
                {table.getState().pagination.pageIndex + 1}
              </div>
              <span className="text-slate-400">/ {table.getPageCount()}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
