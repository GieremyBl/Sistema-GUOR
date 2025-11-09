import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { handleHttp } from '../utils/error.handle';

export class VariantesController {
  async getAll(req: Request, res: Response) {
    try {
      const { productoId } = req.query;
      
      const where = productoId ? { productoId: BigInt(productoId.toString()) } : {};
      
      const variantes = await prisma.varianteProducto.findMany({
        where,
        include: {
          producto: true
        }
      });
      res.json(variantes);
    } catch (error) {
      handleHttp(res, 'ERROR_GET_VARIANTES', error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const variante = await prisma.varianteProducto.findUnique({
        where: { id: BigInt(id) },
        include: {
          producto: true
        }
      });
      
      if (!variante) {
        return res.status(404).json({ error: 'Variante no encontrada' });
      }
      
      res.json(variante);
    } catch (error) {
      handleHttp(res, 'ERROR_GET_VARIANTE', error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { productoId, nombre, valor, stockAdicional, precioAdicional } = req.body;
      
      const variante = await prisma.varianteProducto.create({
        data: {
          productoId: BigInt(productoId),
          nombre,
          valor,
          stockAdicional,
          precioAdicional
        },
        include: {
          producto: true
        }
      });
      
      res.status(201).json(variante);
    } catch (error) {
      handleHttp(res, 'ERROR_CREATE_VARIANTE', error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, valor, stockAdicional, precioAdicional } = req.body;
      
      const variante = await prisma.varianteProducto.update({
        where: { id: BigInt(id) },
        data: {
          nombre,
          valor,
          stockAdicional,
          precioAdicional
        },
        include: {
          producto: true
        }
      });
      
      res.json(variante);
    } catch (error) {
      handleHttp(res, 'ERROR_UPDATE_VARIANTE', error);
    }
  }

  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      
      const variante = await prisma.varianteProducto.findUnique({
        where: { id: BigInt(id) }
      });

      if (!variante) {
        return res.status(404).json({ error: 'Variante no encontrada' });
      }

      const newStock = variante.stockAdicional + cantidad;
      
      const updatedVariante = await prisma.varianteProducto.update({
        where: { id: BigInt(id) },
        data: {
          stockAdicional: newStock
        },
        include: {
          producto: true
        }
      });
      
      res.json(updatedVariante);
    } catch (error) {
      handleHttp(res, 'ERROR_UPDATE_STOCK_VARIANTE', error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await prisma.varianteProducto.delete({
        where: { id: BigInt(id) }
      });
      
      res.status(204).send();
    } catch (error) {
      handleHttp(res, 'ERROR_DELETE_VARIANTE', error);
    }
  }
}

export const variantesController = new VariantesController();