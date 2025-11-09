import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { handleHttp } from '../utils/error.handle';
import { AuthenticatedRequestHandler } from '../types/handler.types';

import { BaseController } from '../types/controller.types';

export class CategoriasController implements BaseController {
  async getAll(req: Request, res: Response) {
    try {
      const categorias = await prisma.categoria.findMany({
        where: { estado: true },
        include: {
          productos: true
        }
      });
      res.json(categorias);
    } catch (error) {
      handleHttp(res, 'ERROR_GET_CATEGORIAS', error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const categoria = await prisma.categoria.findUnique({
        where: { id: BigInt(id) },
        include: {
          productos: true
        }
      });
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      res.json(categoria);
    } catch (error) {
      handleHttp(res, 'ERROR_GET_CATEGORIA', error);
    }
  }

  create: AuthenticatedRequestHandler = async (req, res) => {
    try {
      const { nombre, descripcion } = req.body;
      
      const categoria = await prisma.categoria.create({
        data: {
          nombre,
          descripcion
        }
      });
      
      res.status(201).json(categoria);
    } catch (error) {
      handleHttp(res, 'ERROR_CREATE_CATEGORIA', error);
    }
  }

  update: AuthenticatedRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, estado } = req.body;
      
      const categoria = await prisma.categoria.update({
        where: { id: BigInt(id) },
        data: {
          nombre,
          descripcion,
          estado
        }
      });
      
      res.json(categoria);
    } catch (error) {
      handleHttp(res, 'ERROR_UPDATE_CATEGORIA', error);
    }
  }

  delete: AuthenticatedRequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      
      await prisma.categoria.update({
        where: { id: BigInt(id) },
        data: { estado: false }
      });
      
      res.status(204).send();
    } catch (error) {
      handleHttp(res, 'ERROR_DELETE_CATEGORIA', error);
    }
  }
}

export const categoriasController = new CategoriasController();