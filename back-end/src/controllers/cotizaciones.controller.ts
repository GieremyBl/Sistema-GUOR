import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { handleHttp } from '../utils/error.handle';

export class CotizacionesController {
  async getAll(req: Request, res: Response) {
    try {
      const cotizaciones = await prisma.cotizacion.findMany({
        include: {
          cliente: true,
          usuario: true,
          items: {
            include: {
              variante: {
                include: {
                  producto: true
                }
              }
            }
          }
        }
      });
      res.json(cotizaciones);
    } catch (error) {
      handleHttp(res, 'ERROR_GET_COTIZACIONES');
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cotizacion = await prisma.cotizacion.findUnique({
        where: { id: BigInt(id) },
        include: {
          cliente: true,
          usuario: true,
          items: {
            include: {
              variante: {
                include: {
                  producto: true
                }
              }
            }
          }
        }
      });
      
      if (!cotizacion) {
        return res.status(404).json({ error: 'Cotización no encontrada' });
      }
      
      res.json(cotizacion);
    } catch (error) {
      handleHttp(res, 'ERROR_GET_COTIZACION');
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { clienteId, items, usuarioId } = req.body;
      
      // Calcular el total de la cotización
      let total = 0;
      const itemsData = items.map((item: any) => {
        const subtotal = item.cantidad * item.precioUnitario;
        total += subtotal;
        return {
          varianteId: BigInt(item.varianteId),
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          subtotal
        };
      });

      const cotizacion = await prisma.cotizacion.create({
        data: {
          clienteId: BigInt(clienteId),
          usuarioId: BigInt(usuarioId),
          total,
          items: {
            create: itemsData
          }
        },
        include: {
          items: true,
          cliente: true,
          usuario: true
        }
      });
      
      res.status(201).json(cotizacion);
    } catch (error) {
      handleHttp(res, 'ERROR_CREATE_COTIZACION');
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      const cotizacion = await prisma.cotizacion.update({
        where: { id: BigInt(id) },
        data: { estado },
        include: {
          items: true,
          cliente: true,
          usuario: true
        }
      });
      
      res.json(cotizacion);
    } catch (error) {
      handleHttp(res, 'ERROR_UPDATE_COTIZACION_STATUS');
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await prisma.cotizacion.delete({
        where: { id: BigInt(id) }
      });
      
      res.status(204).send();
    } catch (error) {
      handleHttp(res, 'ERROR_DELETE_COTIZACION');
    }
  }

  // Obtener cotizaciones por cliente
  async getByCliente(req: Request, res: Response) {
    try {
      const { clienteId } = req.params;
      
      const cotizaciones = await prisma.cotizacion.findMany({
        where: { clienteId: BigInt(clienteId) },
        include: {
          items: {
            include: {
              variante: {
                include: {
                  producto: true
                }
              }
            }
          },
          usuario: true
        }
      });
      
      res.json(cotizaciones);
    } catch (error) {
      handleHttp(res, 'ERROR_GET_COTIZACIONES_CLIENTE');
    }
  }
}

export const cotizacionesController = new CotizacionesController();