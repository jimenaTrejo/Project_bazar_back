// Require the Product model
import Producto from "../models/Producto.js";

// Define the controller object
class ProductoController {
  // @desc    Get all products
  // @route   GET /api/productos
  async getProductos(req, res) {
    try {
      let { search, limit, page } = req.query;
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      search = search || "";

      const skip = (page - 1) * limit;

      const query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };

      const productos = await Producto.find(query).skip(skip).limit(limit);

      const total = await Producto.countDocuments(query);

      res.json({
        productos,
        total,
        skip,
        limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Server error ${error}` });
    }
  }

  // @desc    Get single product
  // @route   GET /api/productos/:id
  async getProducto(req, res) {
    try {
      const producto = await Producto.findById(req.params.id);
      if (!producto) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: `Server error ${error}` });
    }
  }
}


export default ProductoController;
