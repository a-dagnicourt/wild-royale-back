const express = require('express');
const { valProduct } = require('../joiSchemas');
const { joiValidation, checkToken, checkRole } = require('../middlewares');
const prisma = require('../prismaClient');

const router = express.Router();

router.use(checkToken);

/**
 * A product (with id for output display)
 * @typedef {object} DisplayProduct
 * @property {number} id.required - 1
 * @property {string} label.required - enum:ftmkt,ftd,ftmall,ftmap - Product name
 */

/**
 * A product
 * @typedef {object} Product
 * @property {string} label.required - enum:ftmkt,ftd,ftmall,ftmap - Product name
 */

/**
 * GET /api/v0/products
 * @summary View all products
 * @tags products
 * @return {array<DisplayProduct>} 200 - Product list successfully retrieved
 * @return {object} 400 - Bad request response
 * @security bearerAuth
 */
router.get(
  '/',
  // Allows every role except prospect
  checkRole('superadmin' || 'admin' || 'user'),
  async (req, res, next) => {
    const { product } = req.query;
    try {
      // Gets all products with their users intermediate table infos.
      const products = await prisma.product.findMany({
        where: {
          label: product,
        },
        include: {
          productOwned: true,
        },
      });
      // Returns a 200 'OK' HTTP code response + all infos JSON
      return res.status(200).json(products);
      // Returns a 400 'Bad Request' if any error occurs
    } catch (error) {
      res.status(400);
      // Triggers the error handling middleware
      return next(error);
    }
  }
);

/**
 * GET /api/v0/products/{productId}
 * @summary Get product by ID
 * @tags products
 * @param {number} productId.path.required - id of wanted product
 * @return {array<DisplayProduct>} 200 - Product successfully retrieved
 * @return {object} 404 - Role not found
 * @security bearerAuth
 */
router.get(
  '/:id',
  // Allows every role except prospect
  checkRole('superadmin' || 'admin' || 'user'),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      // Gets a unique product by its id with its users intermediate table infos.
      const product = await prisma.product.findUnique({
        where: {
          id: parseInt(id, 10),
        },
        include: {
          productOwned: true,
        },
      });
      if (!product) {
        return next();
      }
      return res.status(200).json(product);
    } catch (error) {
      // Returns a 404 'Not Found' if any error occurs
      res.status(404);
      return next(error);
    }
  }
);

/**
 * POST /api/v0/products/
 * @summary Create a product
 * @tags products
 * @param {Product} request.body.required - Product info
 * @return {array<DisplayProduct>} 201 - Role successfully created
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.post(
  '/',
  // Allows only superadmin
  checkRole('superadmin'),
  joiValidation(valProduct),
  async (req, res, next) => {
    const { label } = req.body;

    try {
      // Creates a product with all infos infos provided by body
      const product = await prisma.product.create({
        data: {
          label,
        },
      });
      // Returns a 201 'Created' HTTP code response + all infos JSON
      return res.status(201).json(product);
    } catch (error) {
      // Returns a 422 'Bad Request' if any error occurs in creation processus
      res.status(422);

      return next(error);
    }
  }
);

/**
 * DELETE /api/v0/products/{productId}
 * @summary Delete a product
 * @tags products
 * @param {number} productId.path.required - id of wanted product
 * @return {object} 204 - Role successfully deleted
 * @return {object} 400 - Bad request response
 * @security bearerAuth
 */
router.delete(
  '/:id',
  // Allows only superadmin
  checkRole('superadmin'),
  async (req, res, next) => {
    const { id } = req.params;

    try {
      // Deletes product from database by its id
      await prisma.product.delete({
        where: {
          id: parseInt(id, 10),
        },
      });
      // Returns a 204 'Deleted' HTTP code response + all infos JSON
      return res.sendStatus(204);
    } catch (error) {
      res.status(404);

      return next(error);
    }
  }
);

/**
 * PUT /api/v0/products/{productId}
 * @summary Update a product
 * @tags products
 * @param {number} productId.path.required - Product ID
 * @param {Product} request.body.required - product info
 * @return {array<DisplayProduct>} 200 - Product successfully updated
 * @return {object} 404 - Product not found
 * @return {object} 422 - Bad data entries
 * @security bearerAuth
 */
router.put(
  '/:id',
  // Allows only superadmin
  checkRole('superadmin'),
  joiValidation(valProduct),
  async (req, res, next) => {
    const { id } = req.params;
    const { label } = req.body;

    try {
      // Updates the id provided company
      const updatedProduct = await prisma.product.update({
        where: {
          id: parseInt(id, 10),
        },
        data: {
          label,
        },
      });

      return res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(404);
      return next(error);
    }
  }
);

module.exports = router;
