'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
import EditProductoDialog from '@/components/productos/EditProductoDialog';

interface EditProductoClientProps {
  producto: any;
  categorias: any[];
  categoriasError: string | null;
} 

export default function EditProductoClient({ 
  producto, 
  categorias, 
  categoriasError 
}: EditProductoClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push('/Panel-Administrativo/productos');
    }
  };

  return (
    <EditProductoDialog
      producto={producto}
      categorias={categorias}
      categoriasError={categoriasError}
      open={true}
      onOpenChange={handleOpenChange}
    />
  );
}