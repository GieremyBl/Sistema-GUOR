'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ItemCarrito {
  producto_id: number;
  nombre: string;
  imagen: string;
  precio: number;
  cantidad: number;
  talla: string;
  color?: string;
  stock: number;
}

interface CarritoContextType {
  items: ItemCarrito[];
  agregarItem: (item: ItemCarrito) => void;
  eliminarItem: (producto_id: number, talla: string) => void;
  actualizarCantidad: (producto_id: number, talla: string, cantidad: number) => void;
  limpiarCarrito: () => void;
  total: number;
  cantidadItems: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  // Cargar carrito del localStorage
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      setItems(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarItem = (item: ItemCarrito) => {
    setItems(prev => {
      const existe = prev.find(
        i => i.producto_id === item.producto_id && i.talla === item.talla
      );

      if (existe) {
        return prev.map(i =>
          i.producto_id === item.producto_id && i.talla === item.talla
            ? { ...i, cantidad: i.cantidad + item.cantidad }
            : i
        );
      }

      return [...prev, item];
    });
  };

  const eliminarItem = (producto_id: number, talla: string) => {
    setItems(prev => prev.filter(
      i => !(i.producto_id === producto_id && i.talla === talla)
    ));
  };

  const actualizarCantidad = (producto_id: number, talla: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarItem(producto_id, talla);
      return;
    }

    setItems(prev =>
      prev.map(i =>
        i.producto_id === producto_id && i.talla === talla
          ? { ...i, cantidad }
          : i
      )
    );
  };

  const limpiarCarrito = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const cantidadItems = items.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarItem,
        eliminarItem,
        actualizarCantidad,
        limpiarCarrito,
        total,
        cantidadItems
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return context;
};