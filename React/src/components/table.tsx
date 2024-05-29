import React, { useEffect, useState } from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import './index.css'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingFn,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { makeData, ExchangeData } from './data'
import { FetchAvailableCurrencies } from './fetches';

export default function Table() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [data, setData] = React.useState<ExchangeData[]>([]);
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(undefined);

  const columns = React.useMemo<ColumnDef<ExchangeData>[]>(
    () => [
      {
        accessorKey: 'base',
        cell: info => info.getValue(),
      },
      {
        accessorFn: row => row.target,
        id: 'target',
        cell: info => info.getValue(),
        header: () => <span>target</span>,
        sortUndefined: 'last',
        sortDescFirst: false,
      },
      {
        accessorKey: 'exchangeRate',
        header: () => 'exchange rate',
      },
    ],
    []
  )

  // const refreshData = async () => {
  //   setSelectedCurrency("USD")
  //   const dataForSelectedCurrency = await makeData(selectedCurrency)
  //     setData(dataForSelectedCurrency)
  // }

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },

  })

  const fetchDataAvailableCurrencies = async () => {
    const dataForAvailableCurrencies = await FetchAvailableCurrencies();
    setAvailableCurrencies(dataForAvailableCurrencies);
    if (selectedCurrency === undefined)
      setSelectedCurrency(dataForAvailableCurrencies[0])
  };

  const fetchData = async () => {
    const dataForSelectedCurrency = await makeData(selectedCurrency)
    setData(dataForSelectedCurrency)
  }

  useEffect(() => {
    fetchDataAvailableCurrencies();
  }, []);

  useEffect(() => {
    // fetchDataAvailableCurrency();
    fetchData()
  }, [selectedCurrency]);

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.value);
  };

  return (
    <>
      <h1>---Exchange Rates---</h1>
      <div>
        <h2>Select a currency to exchange: </h2>
        <Dropdown options={availableCurrencies} value={selectedCurrency} onChange={handleCurrencyChange} />
      </div>
      <div className="p-2">
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort() && header.column.id !== 'base'
                              ? 'cursor-pointer select-none'
                              : ''
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          title={
                            header.column.getCanSort() && header.column.id !== 'base'
                              ? header.column.getNextSortingOrder() === 'asc'
                                ? 'Sort ascending'
                                : header.column.getNextSortingOrder() === 'desc'
                                  ? 'Sort descending'
                                  : 'Clear sort'
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {
                            header.column.id !== 'base' &&
                            (
                              {
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null
                            )
                          }
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
        <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      </div>
    </>
  )
}