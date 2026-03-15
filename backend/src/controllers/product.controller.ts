import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const getProducts = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const products = await prisma.producto.findMany({
            where: { empresaId },
            include: { categoria: true }
        });

        // Aggregate movements for all products of this company
        const stockAggregations = await prisma.movimientoInventario.groupBy({
            by: ['productoId', 'tipoMovimiento'],
            where: { empresaId },
            _sum: { cantidad: true }
        });

        // Map aggregated stock into products
        const productsWithStock = products.map(product => {
            const productAggregations = stockAggregations.filter(agg => agg.productoId === product.id);
            const sumEntradas = productAggregations.filter(agg => ['ENTRADA', 'AJUSTE_POSITIVO'].includes(agg.tipoMovimiento))
                                                   .reduce((acc, curr) => acc + (curr._sum.cantidad || 0), 0);
            const sumSalidas = productAggregations.filter(agg => ['SALIDA', 'AJUSTE_NEGATIVO'].includes(agg.tipoMovimiento))
                                                  .reduce((acc, curr) => acc + (curr._sum.cantidad || 0), 0);
            
            return {
                ...product,
                stock: sumEntradas - sumSalidas
            };
        });

        res.json(productsWithStock);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const id = req.params.id as string;

        const product = await prisma.producto.findFirst({
            where: { id, empresaId },
            include: { categoria: true }
        });

        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const { nombre, sku, categoriaId, unidad, precioCompra, precioVenta, stockMinimo } = req.body;

        const product = await prisma.producto.create({
            data: {
                empresaId,
                nombre,
                sku,
                categoriaId, // Ensure category belongs to the tenant before creating in a real scenario
                unidad,
                precioCompra,
                precioVenta,
                stockMinimo
            }
        });

        res.status(201).json(product);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'SKU must be unique per company' });
        }
        res.status(500).json({ error: 'Error creating product' });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const id = req.params.id as string;
        const { nombre, sku, categoriaId, unidad, precioCompra, precioVenta, stockMinimo } = req.body;

        const product = await prisma.producto.update({
            where: { id, empresaId },
            data: {
                nombre, sku, categoriaId, unidad, precioCompra, precioVenta, stockMinimo
            }
        });

        res.json(product);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'SKU must be unique per company' });
        }
        res.status(500).json({ error: 'Error updating product' });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const empresaId = req.user!.empresaId;
        const id = req.params.id as string;

        await prisma.producto.delete({
            where: { id, empresaId }
        });

        res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        // Handle constraint errors if the product is being referenced in movements
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Cannot delete product because it has associated inventory movements.' });
        }
        res.status(500).json({ error: 'Error deleting product' });
    }
};
