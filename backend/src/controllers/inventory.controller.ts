import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const registerMovement = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const usuarioId = req.user!.id;
        const { productoId, almacenId, tipoMovimiento, cantidad, costoUnitario, referencia } = req.body;

        if (!['ENTRADA', 'SALIDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO'].includes(tipoMovimiento)) {
            return res.status(400).json({ error: 'Invalid movement type' });
        }

        if (cantidad <= 0) {
            return res.status(400).json({ error: 'Quantity must be positive' });
        }

        // Optional: Prevent negative stock on SALIDA or AJUSTE_NEGATIVO
        if (['SALIDA', 'AJUSTE_NEGATIVO'].includes(tipoMovimiento)) {
            const currentStock = await calculateStock(empresaId, productoId, almacenId);
            if (currentStock < cantidad) {
                return res.status(400).json({ error: `Insufficient stock. Current: ${currentStock}` });
            }
        }

        const movement = await prisma.movimientoInventario.create({
            data: {
                empresaId,
                productoId,
                almacenId,
                tipoMovimiento,
                cantidad,
                costoUnitario,
                referencia,
                usuarioId
            }
        });

        res.status(201).json(movement);
    } catch (error) {
        res.status(500).json({ error: 'Error registering movement' });
    }
};

export const getAllMovements = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const movements = await prisma.movimientoInventario.findMany({
            where: { empresaId },
            orderBy: { fecha: 'desc' },
            take: 100,
            include: {
                producto: { select: { nombre: true } },
                almacen: { select: { nombre: true } },
                usuario: { select: { nombre: true } }
            }
        });

        res.json(movements.map(m => ({
            ...m,
            motivo: m.referencia || (m.tipoMovimiento === 'ENTRADA' ? 'Compra' : 'Salida')
        })));
    } catch (error) {
        res.status(500).json({ error: 'Error fetching movements' });
    }
};

export const getProductoStock = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const productoId = req.params.productoId as string;
        const almacenId = req.query.almacenId as string | undefined;

        const stock = await calculateStock(empresaId, productoId, almacenId);

        res.json({ productoId, stock, almacenId: almacenId || 'ALL' });
    } catch (error) {
        res.status(500).json({ error: 'Error calculating stock' });
    }
};

export const getKardex = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const productoId = req.params.productoId as string;

        const movements = await prisma.movimientoInventario.findMany({
            where: { empresaId, productoId },
            orderBy: { fecha: 'asc' },
            include: {
                usuario: { select: { nombre: true } },
                almacen: { select: { nombre: true } }
            }
        });

        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching Kardex' });
    }
};

// --- Core Logic: Recalculate Stock on the fly ---
const calculateStock = async (empresaId: string, productoId: string, almacenId?: string): Promise<number> => {
    const whereClause: any = { empresaId, productoId };
    if (almacenId) {
        whereClause.almacenId = almacenId;
    }

    // Aggregate positive movements
    const positive = await prisma.movimientoInventario.aggregate({
        _sum: { cantidad: true },
        where: {
            ...whereClause,
            tipoMovimiento: { in: ['ENTRADA', 'AJUSTE_POSITIVO'] }
        }
    });

    // Aggregate negative movements
    const negative = await prisma.movimientoInventario.aggregate({
        _sum: { cantidad: true },
        where: {
            ...whereClause,
            tipoMovimiento: { in: ['SALIDA', 'AJUSTE_NEGATIVO'] }
        }
    });

    const totalPositive = positive._sum.cantidad || 0;
    const totalNegative = negative._sum.cantidad || 0;

    return totalPositive - totalNegative;
};
