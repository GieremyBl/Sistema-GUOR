"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, X, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Modelo {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
}

interface NuevaCotizacionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NuevaCotizacionForm({ open, onOpenChange }: NuevaCotizacionFormProps) {
  const [nombreCliente, setNombreCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [notasAdicionales, setNotasAdicionales] = useState("");
  const [modelos, setModelos] = useState<Modelo[]>([
    { id: "1", nombre: "", cantidad: 400, precioUnitario: 0 }
  ]);

  const numeroCotzacion = `COT-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

  const agregarModelo = () => {
    const nuevoModelo: Modelo = {
      id: Date.now().toString(),
      nombre: "",
      cantidad: 400,
      precioUnitario: 0
    };
    setModelos([...modelos, nuevoModelo]);
  };

  const eliminarModelo = (id: string) => {
    if (modelos.length > 1) {
      setModelos(modelos.filter(m => m.id !== id));
    }
  };

  const actualizarModelo = (id: string, campo: keyof Modelo, valor: string | number) => {
    setModelos(modelos.map(m => 
      m.id === id ? { ...m, [campo]: valor } : m
    ));
  };

  const calcularTotales = () => {
    const totalModelos = modelos.length;
    const totalPrendas = modelos.reduce((sum, m) => sum + (m.cantidad || 0), 0);
    const montoTotal = modelos.reduce((sum, m) => 
      sum + ((m.cantidad || 0) * (m.precioUnitario || 0)), 0
    );
    return { totalModelos, totalPrendas, montoTotal };
  };

  const { totalModelos, totalPrendas, montoTotal } = calcularTotales();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la cotización
    console.log({
      numeroCotzacion,
      nombreCliente,
      emailCliente,
      telefonoCliente,
      modelos,
      notasAdicionales,
      totales: { totalModelos, totalPrendas, montoTotal }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Nueva Cotización - {numeroCotzacion}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del Cliente */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Información del Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombreCliente">
                  Nombre del Cliente <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombreCliente"
                  placeholder="Ej: Empresa Textil S.A."
                  value={nombreCliente}
                  onChange={(e) => setNombreCliente(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailCliente">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="emailCliente"
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={emailCliente}
                  onChange={(e) => setEmailCliente(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="telefonoCliente">
                  Teléfono <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="telefonoCliente"
                  placeholder="+51 999 888 777"
                  value={telefonoCliente}
                  onChange={(e) => setTelefonoCliente(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Modelos de Prendas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Modelos de Prendas
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarModelo}
                disabled={modelos.length >= 25}
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar Modelo
              </Button>
            </div>

            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                Cada modelo debe tener un mínimo de 40 prendas para ser cotizado.
                Mínimo 400 prendas por modelo • Máximo 25 modelos
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              {modelos.map((modelo, index) => (
                <div key={modelo.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Modelo {index + 1}
                    </h4>
                    {modelos.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarModelo(modelo.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Nombre del Modelo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ej: Polo Básico"
                        value={modelo.nombre}
                        onChange={(e) => actualizarModelo(modelo.id, 'nombre', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Cantidad <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="Mín. 400"
                        min={400}
                        value={modelo.cantidad || ''}
                        onChange={(e) => actualizarModelo(modelo.id, 'cantidad', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Precio Unitario (S/) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        value={modelo.precioUnitario || ''}
                        onChange={(e) => actualizarModelo(modelo.id, 'precioUnitario', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notas Adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notasAdicionales">
              Notas Adicionales (Opcional)
            </Label>
            <Textarea
              id="notasAdicionales"
              placeholder="Ej: Cliente requiere entrega en dos lotes, colores específicos, etc."
              rows={3}
              value={notasAdicionales}
              onChange={(e) => setNotasAdicionales(e.target.value)}
            />
          </div>

          {/* Totales */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total de Modelos:</span>
              <span className="font-semibold text-gray-900">{totalModelos}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total de Prendas:</span>
              <span className="font-semibold text-gray-900">{totalPrendas}</span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Monto Total:</span>
              <span className="font-bold text-gray-900">
                S/ {montoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              Crear Cotización
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}