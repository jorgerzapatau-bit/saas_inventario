import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller';
import { getProveedores, createProveedor } from '../controllers/supplier.controller';
import { registrarCompra, getCompras } from '../controllers/purchase.controller';
import { registrarSalida, getSalidas } from '../controllers/sales.controller';
import { getKardex, getProductoStock, registerMovement, getAllMovements } from '../controllers/inventory.controller';
import { authenticate } from '../middlewares/auth';
import { requireTenant } from '../middlewares/tenant';

import { getCompanyBySlug, updateCompany, getMyCompany } from '../controllers/company.controller';

const router = Router();

// Public Settings route
router.get('/company/:slug', getCompanyBySlug);

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected routes context
router.use(authenticate, requireTenant);

// Company settings
router.get('/company', getMyCompany);
router.put('/company', updateCompany);

// Products
router.get('/products', getProducts);
router.post('/products', createProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Suppliers
router.get('/suppliers', getProveedores);
router.post('/suppliers', createProveedor);

// Purchases (Entradas)
router.get('/purchases', getCompras);
router.post('/purchases', registrarCompra);

// Sales (Salidas)
router.get('/sales', getSalidas);
router.post('/sales', registrarSalida);

// Inventory & Kardex
router.get('/inventory/stock/:productoId', getProductoStock);
router.get('/inventory/kardex/:productoId', getKardex);
router.get('/inventory/movements', getAllMovements);
router.post('/inventory/movements', registerMovement);

export default router;
