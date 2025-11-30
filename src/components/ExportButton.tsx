import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, FileJson, Settings } from 'lucide-react';
import { Button, Dialog, Checkbox, Select } from './UI';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface ExportButtonProps {
    data: any[];
    filename?: string;
    label?: string;
    columns?: { key: string; label: string }[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({
    data,
    filename = 'export',
    label = 'Exportar',
    columns
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [availableColumns, setAvailableColumns] = useState<{ key: string; label: string }[]>([]);

    useEffect(() => {
        if (data && data.length > 0) {
            let cols = columns;
            if (!cols) {
                // Infer columns from first data item
                const firstItem = data[0];
                cols = Object.keys(firstItem).map(key => ({
                    key,
                    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
                }));
            }
            setAvailableColumns(cols);
            // Default select all
            setSelectedColumns(cols.map(c => c.key));
        }
    }, [data, columns]);

    const toggleColumn = (key: string) => {
        setSelectedColumns(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    const handleExport = () => {
        if (!data || data.length === 0) {
            toast.warning('Não há dados para exportar.');
            return;
        }

        if (selectedColumns.length === 0) {
            toast.warning('Selecione pelo menos uma coluna.');
            return;
        }

        const filteredData = data.map(item => {
            const newItem: any = {};
            selectedColumns.forEach(key => {
                // Find label for header
                const col = availableColumns.find(c => c.key === key);
                const header = col ? col.label : key;
                newItem[header] = item[key];
            });
            return newItem;
        });

        const timestamp = new Date().toISOString().split('T')[0];
        const finalFilename = `${filename}_${timestamp}`;

        try {
            if (format === 'csv') {
                exportCSV(filteredData, finalFilename);
            } else if (format === 'excel') {
                exportExcel(filteredData, finalFilename);
            } else if (format === 'pdf') {
                exportPDF(filteredData, finalFilename);
            }
            setIsOpen(false);
            toast.success(`Exportação para ${format.toUpperCase()} concluída!`);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao exportar dados.');
        }
    };

    const exportCSV = (data: any[], filename: string) => {
        const headers = Object.keys(data[0]);
        let csvContent = headers.join(',') + '\r\n';

        data.forEach(row => {
            const line = headers.map(header => {
                let cell = row[header];
                if (cell === null || cell === undefined) cell = '';
                cell = String(cell);
                if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                    cell = `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(',');
            csvContent += line + '\r\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportExcel = (data: any[], filename: string) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    const exportPDF = (data: any[], filename: string) => {
        const doc = new jsPDF();
        const headers = Object.keys(data[0]);
        const rows = data.map(obj => Object.values(obj));

        doc.text(label || 'Relatório', 14, 15);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 22);

        autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 25,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [41, 128, 185] }
        });

        doc.save(`${filename}.pdf`);
    };

    return (
        <>
            <Button
                variant="secondary"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2"
            >
                <Download size={16} />
                {label}
            </Button>

            <Dialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Configurar Exportação"
            >
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">Formato do Arquivo</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setFormat('excel')}
                                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${format === 'excel' ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'}`}
                            >
                                <FileSpreadsheet className="h-6 w-6 mb-2" />
                                <span className="text-xs font-medium">Excel</span>
                            </button>
                            <button
                                onClick={() => setFormat('pdf')}
                                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${format === 'pdf' ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'}`}
                            >
                                <FileText className="h-6 w-6 mb-2" />
                                <span className="text-xs font-medium">PDF</span>
                            </button>
                            <button
                                onClick={() => setFormat('csv')}
                                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${format === 'csv' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'}`}
                            >
                                <FileJson className="h-6 w-6 mb-2" />
                                <span className="text-xs font-medium">CSV</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Colunas Selecionadas</label>
                            <button
                                onClick={() => setSelectedColumns(selectedColumns.length === availableColumns.length ? [] : availableColumns.map(c => c.key))}
                                className="text-xs text-davus-primary hover:underline"
                            >
                                {selectedColumns.length === availableColumns.length ? 'Desmarcar Todas' : 'Marcar Todas'}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto p-1">
                            {availableColumns.map((col) => (
                                <Checkbox
                                    key={col.key}
                                    label={col.label}
                                    checked={selectedColumns.includes(col.key)}
                                    onChange={() => toggleColumn(col.key)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar Arquivo
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
