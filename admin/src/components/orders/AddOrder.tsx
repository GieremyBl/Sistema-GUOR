"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderFormData {
  productId: string;
  quantity: number;
  notes?: string;
}

export default function AddOrder() {
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>();

  const onSubmit = (data: OrderFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="productId">Producto</Label>
        <Input
          id="productId"
          {...register("productId", { required: true })}
          placeholder="ID del producto"
        />
        {errors.productId && <span className="text-red-500">Este campo es requerido</span>}
      </div>

      <div>
        <Label htmlFor="quantity">Cantidad</Label>
        <Input
          id="quantity"
          type="number"
          {...register("quantity", { required: true })}
          placeholder="Cantidad"
        />
        {errors.quantity && <span className="text-red-500">Este campo es requerido</span>}
      </div>

      <Button type="submit">Crear Orden</Button>
    </form>
  );
}
