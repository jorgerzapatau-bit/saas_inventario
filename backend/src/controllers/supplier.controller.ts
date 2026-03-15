import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const getProveedores = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const proveedores = await prisma.proveedor.findMany({ where: { empresaId } });
        res.json(proveedores);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching suppliers' });
    }
};

export const createProveedor = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const { nombre, contacto, telefono, email, direccion } = req.body;

        const proveedor = await prisma.proveedor.create({
            data: { empresaId, nombre, contacto, telefono, email, direccion }
        });

        res.status(201).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: 'Error creating supplier' });
    }
};
