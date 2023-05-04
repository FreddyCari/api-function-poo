import { Router } from 'express';
import { ProductoControllers } from '../controllers';

export const productRoutes = Router();
const productControllers = new ProductoControllers();

productRoutes.post('/producto', productControllers.createProducto);
productRoutes.get('/productos', (req, res) => {
  // const pc = new ProductoControllers();
  // pc.getProductos(req, res);

  console.log('PARAMS:', req.params);

  productControllers.getProductos(req, res);
});
