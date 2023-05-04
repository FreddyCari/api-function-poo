import { Request, Response } from 'express';
import { Producto } from '../modules/inventory/producto';

export class ProductoControllers {
  private contador: number = 0;
  constructor() {
    console.log(this.contador);
    this.contador = 1;
    console.log(this.contador);
  }
  async createProducto(req: Request, res: Response) {
    try {
      const { nombreProducto, cantidad, precio } = req.body;
      const producto = new Producto();
      producto.nombreProducto = nombreProducto;
      producto.cantidad = cantidad;
      producto.precio = precio;
      await producto.save();
      res.json(producto);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ mensaje: error.message });
    }
  }

  async getProductos(req: Request, res: Response) {
    try {
      console.log(this.contador);
      this.contador++;
      const productos = await Producto.find();
      res.json(productos);
    } catch (error) {
      if (error instanceof Error)
        res.status(500).json({ mensaje: error.message });
    }
  }
}
