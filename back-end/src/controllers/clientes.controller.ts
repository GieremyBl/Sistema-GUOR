import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { handleHttp } from '../utils/error.handle';
import { BaseController } from '../types/controller.types';
import { AuthenticatedRequestHandler } from '../types/handler.types';

class ClientesController implements BaseController {
    getAll = async (req: Request, res: Response) => {
        try {
            const clientes = await prisma.cliente.findMany({
                where: { estado: true }
            });
            res.json(clientes);
        } catch (error) {
            handleHttp(res, 'ERROR_GET_CLIENTES');
        }
    }

    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const cliente = await prisma.cliente.findUnique({
                where: { id: BigInt(id) }
            });

            if (!cliente) {
                return res.status(404).json({ error: 'Cliente no encontrado' });
            }

            res.json(cliente);
        } catch (error) {
            handleHttp(res, 'ERROR_GET_CLIENTE');
        }
    }

    create: AuthenticatedRequestHandler = async (req, res) => {
        try {
            const { nombre, apellido, email, telefono, direccion } = req.body;
            const cliente = await prisma.cliente.create({
                data: {
                    nombre,
                    apellido,
                    email,
                    telefono,
                    direccion
                }
            });
            res.status(201).json(cliente);
        } catch (error) {
            handleHttp(res, 'ERROR_CREATE_CLIENTE');
        }
    }

    update: AuthenticatedRequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, apellido, email, telefono, direccion } = req.body;
            const cliente = await prisma.cliente.update({
                where: { id: BigInt(id) },
                data: {
                    nombre,
                    apellido,
                    email,
                    telefono,
                    direccion
                }
            });
            res.json(cliente);
        } catch (error) {
            handleHttp(res, 'ERROR_UPDATE_CLIENTE');
        }
    }

    delete: AuthenticatedRequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.cliente.update({
                where: { id: BigInt(id) },
                data: { estado: false }
            });
            res.status(204).send();
        } catch (error) {
            handleHttp(res, 'ERROR_DELETE_CLIENTE');
        }
    }
}

const clientesController = new ClientesController();
export { clientesController };