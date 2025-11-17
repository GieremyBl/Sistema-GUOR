"use client";
import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import AddProduct from "@/components/products/AddProduct";

interface Product {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string;
  estado: boolean;
}

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      codigo: 'PROD-001',
      nombre: 'Laptop HP',
      descripcion: 'Laptop HP 15.6" Intel Core i5',
      precio: 599.99,
      categoria: 'Electrónica',
      stock: 15,
      imagen: '/placeholder.jpg',
      estado: true
    },
    {
      id: '2',
      codigo: 'PROD-002',
      nombre: 'Mouse Logitech',
      descripcion: 'Mouse inalámbrico',
      precio: 25.99,
      categoria: 'Accesorios',
      stock: 0,
      imagen: '/placeholder.jpg',
      estado: false
    }
  ]);
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(search.toLowerCase()) ||
    product.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Productos</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de productos</p>
        </div>
        
        {/* Sheet para Agregar Producto */}
        <Sheet>
          <SheetTrigger asChild>
            <Button>Agregar Producto</Button>
          </SheetTrigger>
          <AddProduct />
        </Sheet>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por nombre o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative w-10 h-10">
                      <Image
                        src={product.imagen}
                        alt={product.nombre}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{product.codigo}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.nombre}</p>
                      <p className="text-sm text-muted-foreground">{product.descripcion}</p>
                    </div>
                  </TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>${product.precio.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.estado ? 'default' : 'destructive'}>
                      {product.estado ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No se encontraron productos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}