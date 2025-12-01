import { ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onRowClick?: (row: any) => void;
}

const DataTable = ({ columns, data, onRowClick }: DataTableProps) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-primary text-white">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-sm font-semibold ${column.sortable ? 'cursor-pointer select-none hover:bg-sky-600/80' : ''
                                        }`}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable && sortConfig?.key === column.key && (
                                            sortConfig.direction === 'asc'
                                                ? <ArrowUp className="w-4 h-4" />
                                                : <ArrowDown className="w-4 h-4" />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, idx) => (
                            <tr
                                key={idx}
                                onClick={() => onRowClick?.(row)}
                                className={`border-b border-slate-100 transition-all duration-200 ${onRowClick ? 'cursor-pointer hover:bg-slate-50 hover:shadow-md' : ''
                                    } ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="px-6 py-4 text-sm text-slate-700">
                                        {row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    No data available
                </div>
            )}
        </div>
    );
};

export default DataTable;
