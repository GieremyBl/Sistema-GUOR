"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
  name: string;
  description: string;
  price: number;
  category: string;
}

export default function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          {...register("name", { required: true })}
          placeholder="Nombre del producto"
        />
        {errors.name && <span className="text-red-500">Este campo es requerido</span>}
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          {...register("description", { required: true })}
          placeholder="Descripción del producto"
        />
        {errors.description && <span className="text-red-500">Este campo es requerido</span>}
      </div>
      <div>
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          type="number"
          {...register("price", { required: true })}
          placeholder="Precio del producto"
        />
        {errors.price && <span className="text-red-500">Este campo es requerido</span>}
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Input
          id="category"
          {...register("category", { required: true })}
          placeholder="Categoría del producto"
        />
        {errors.category && <span className="text-red-500">Este campo es requerido</span>}
      </div>
      <Button type="submit">Agregar Producto</Button>
    </form>
  );
}
