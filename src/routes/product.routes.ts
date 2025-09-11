import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { CommonErrorSchema, SuccessResponseSchema } from "../utils/response";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0),
  description: z.string().optional(),
});

export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = ProductSchema.partial().omit({ id: true });

// In-memory store
let products: z.infer<typeof ProductSchema>[] = [];

export const productRoutes: FastifyPluginAsyncZod = async (fastify) => {
  // Create Product
  fastify.post(
    "/",
    {
      schema: {
        summary: "Create Product",
        body: CreateProductSchema,
        response: { 201: SuccessResponseSchema(ProductSchema) },
      },
    },
    async (req, reply) => {
      const newProduct = { id: crypto.randomUUID(), ...req.body };
      products.push(newProduct);
      reply.send()
      return reply.success(newProduct, 201, "Product created successfully");
    }
  );

  // Get All Products
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get All Products",
        response: {
          200: SuccessResponseSchema(z.array(ProductSchema)),
          ...CommonErrorSchema
        },
      },
    },
    async (req, reply) => {
      throw CE.BAD_REQUEST_400("This is a simulated Error")
      // return reply.success(products, 200, "Products retrieved successfully");
    }
  );

  // Get Product by ID
  fastify.get(
    "/:id",
    {
      schema: {
        summary: "Get Product by ID",
        params: z.object({ id: z.string().uuid() }),
        response: { 200: SuccessResponseSchema(ProductSchema) },
      },
    },
    async (req, reply) => {
      const product = products.find((p) => p.id === req.params.id);
      // if (!product) return reply.code(404).send({ message: "Product not found" });
      return reply.success(product, 201, "Product retrieved successfully");
    }
  );

  // Update Product
  fastify.put(
    "/:id",
    {
      schema: {
        summary: "Update Product",
        params: z.object({ id: z.string().uuid() }),
        body: UpdateProductSchema,
        response: { 200: SuccessResponseSchema(ProductSchema) },
      },
    },
    async (req, reply) => {
      const index = products.findIndex((p) => p.id === req.params.id);
      // if (index === -1) return reply.code(404).send({ message: "Product not found" });

      products[index] = { ...products[index], ...req.body };
      return reply.success(products[index], 200, "Product updated successfully");
    }
  );

  // Delete Product
  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Delete Product",
        params: z.object({ id: z.string().uuid() }),
        response: { 200: SuccessResponseSchema(z.object({ message: z.string() })) },
      },
    },
    async (req, reply) => {
      products = products.filter((p) => p.id !== req.params.id);
      return reply.success({ message: "Product deleted successfully" }, 200, "Product deleted");
    }
  );
};
