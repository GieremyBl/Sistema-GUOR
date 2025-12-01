'use client';

import { useState, useEffect } from 'react';
import CategoriasTable from '@/components/categorias/CategoriasTable'; 
import CreateCategoriaDialog from '@/components/categorias/CreateCategoriaDialog';
import EditCategoriaDialog from '@/components/categorias/EditCategoriaDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download, Upload, FileSpreadsheet, FileText } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, 
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Categoria, CategoriaCreateInput, CategoriaUpdateInput, CategoriaConConteo, CategoriaFiltersState} from '@/lib/types/categoria.types';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '@/lib/actions/categorias.actions';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import CategoriaFilters from '@/components/categorias/CategoriaFilters'; 

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => void;
    }
}

export default function CategoriasPage() {
    const { toast } = useToast();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState(''); 
    const [filters, setFilters] = useState<CategoriaFiltersState>({ busqueda: '', estado: '' }); 

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [categoriaToEdit, setCategoriaToEdit] = useState<Categoria | null>(null);
    const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        setLoading(true);
        try {
            const result = await getCategorias();
            if (result.success && result.data) {
                setCategorias(result.data);
            } else {
                throw new Error(result.error || 'Error al cargar categorías');
            }
        } catch (error: any) {
            console.error('Error cargando categorías:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'No se pudieron cargar las categorías',
            });
        } finally {
            setLoading(false);
        }
    };
    

    const handleCreate = async (data: CategoriaCreateInput) => {
        try {
            const result = await createCategoria(data);
            if (result.success) {
                toast({ title: 'Éxito', description: 'Categoría creada correctamente' });
                setShowCreateDialog(false);
                await loadCategorias();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleEdit = (id: string) => {
        const categoria = categorias.find((c) => c.id.toString() === id);
        if (categoria) {
            setCategoriaToEdit(categoria);
        }
    };

    const handleUpdate = async (id: string, data: CategoriaUpdateInput) => {
        try {
            const result = await updateCategoria(Number(id), data);
            if (result.success) {
                toast({ title: 'Éxito', description: 'Categoría actualizada correctamente' });
                setCategoriaToEdit(null);
                await loadCategorias();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    const handleDelete = (categoria: CategoriaConConteo) => {
        const categoriaApi: Categoria = {
            id: Number(categoria.id),
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || null,
            activo: categoria.activo,
            created_at: categoria.created_at,
        };
        setCategoriaToDelete(categoriaApi);
    };

    const confirmDelete = async () => {
        if (!categoriaToDelete) return;
        try {
            const result = await deleteCategoria(categoriaToDelete.id);
            if (result.success) {
                toast({ title: 'Éxito', description: 'Categoría eliminada correctamente' });
                await loadCategorias();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setCategoriaToDelete(null);
        }
    };

    const handleToggleActivo = async (categoria: CategoriaConConteo) => {
        try {
            const result = await updateCategoria(Number(categoria.id), { 
                activo: !categoria.activo 
            });
            if (result.success) {
                toast({ title: 'Éxito', description: `Estado actualizado` });
                await loadCategorias();
            } else {
                throw new Error(result.error);
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        }
    };

    // --- EXPORTACIÓN ---
    const exportToExcel = () => {
        try {
            const data = categorias.map(cat => ({
                'ID': cat.id,
                'Nombre': cat.nombre,
                'Descripción': cat.descripcion || 'N/A',
                // @ts-ignore
                'Productos': cat.productos ? cat.productos[0]?.count : 0, 
                'Estado': cat.activo ? 'Activo' : 'Inactivo',
                'Fecha Creación': cat.created_at ? new Date(cat.created_at).toLocaleDateString('es-PE') : 'N/A',
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Categorías');
            const maxWidth = data.reduce((w, r) => Math.max(w, r['Nombre'].length), 10);
            worksheet['!cols'] = [{ wch: 8 }, { wch: maxWidth }, { wch: 40 }, { wch: 10 }, { wch: 15 }, { wch: 20 }];
            XLSX.writeFile(workbook, `categorias_${new Date().toISOString().split('T')[0]}.xlsx`);
            toast({ title: 'Éxito', description: 'Exportado a Excel' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Falló la exportación' });
        }
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.text('Lista de Categorías', 14, 20);
            doc.setFontSize(10);
            doc.text(`Generado: ${new Date().toLocaleDateString('es-PE')}`, 14, 28);

            const tableData = categorias.map(cat => [
                cat.nombre,
                cat.descripcion || '-',
                // @ts-ignore
                cat.productos ? cat.productos[0]?.count : 0,
                cat.activo ? 'Activo' : 'Inactivo',
            ]);

            (doc as any).autoTable({
                head: [['Nombre', 'Descripción', 'Prod.', 'Estado']],
                body: tableData,
                startY: 35,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [59, 130, 246] },
            });
            doc.save(`categorias_${new Date().toISOString().split('T')[0]}.pdf`);
            toast({ title: 'Éxito', description: 'Exportado a PDF' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Falló la exportación' });
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const jsonData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                
                let count = 0;
                for (const row of jsonData) {
                    await createCategoria({
                        nombre: row.Nombre || row.nombre,
                        descripcion: row.Descripción || row.descripcion || null,
                        activo: true
                    });
                    count++;
                }
                toast({ title: 'Éxito', description: `Se importaron ${count} categorías` });
                await loadCategorias();
            } catch (error) {
                toast({ variant: 'destructive', title: 'Error', description: 'Error al importar' });
            }
        };
        reader.readAsArrayBuffer(file);
        event.target.value = '';
    };

    const categoriasFiltradas = categorias.filter((cat) =>
        cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const categoriasTransformadas: CategoriaConConteo[] = categoriasFiltradas.map((cat) => ({
        id: cat.id, 
        nombre: cat.nombre,
        descripcion: cat.descripcion || undefined,
        activo: cat.activo,
        created_at: cat.created_at || '',
        updated_at: cat.updated_at,
        _count: { 
            // @ts-ignore
            productos: (cat as any).productos ? (cat as any).productos[0]?.count : 0 
        },
    }));

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
                    <p className="text-gray-600 mt-1">Organiza tus productos ({categorias.length} total)</p>
                </div>
                
                <div className="flex gap-2">
                    <input
                        type="file"
                        id="import-file"
                        accept=".xlsx,.xls"
                        onChange={handleImport}
                        className="hidden"
                    />
                    <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('import-file')?.click()}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Importar
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer">
                                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                                Excel (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
                                <FileText className="h-4 w-4 mr-2 text-red-600" />
                                PDF (.pdf)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Categoría
                    </Button>
                </div>
            </div>

            <CategoriaFilters
                filters={filters}
                onFiltersChange={setFilters}
            />

            <div className="mb-6 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar categorías..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)} 
                        className="pl-10"
                    />
                </div>
            </div>

            <CategoriasTable
                categorias={categoriasTransformadas}
                loading={loading}
                onEdit={handleEdit} 
                onDelete={handleDelete}
                onToggleActivo={handleToggleActivo}
            />

            <CreateCategoriaDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onSubmit={handleCreate}
            />

            {categoriaToEdit && (
                <EditCategoriaDialog
                    open={!!categoriaToEdit}
                    onOpenChange={(open) => !open && setCategoriaToEdit(null)}
                    categoria={{
                        id: categoriaToEdit.id.toString(),
                        nombre: categoriaToEdit.nombre,
                        descripcion: categoriaToEdit.descripcion || undefined,
                        activo: categoriaToEdit.activo,
                    }}
                    onSubmit={handleUpdate}
                />
            )}

            <AlertDialog open={!!categoriaToDelete} onOpenChange={() => setCategoriaToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la categoría{' '}
                            <strong>{categoriaToDelete?.nombre}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}