// routes/product.ts
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0),
  description: z.string().optional(),
});

const CreateProductSchema = ProductSchema.omit({ id: true });
const UpdateProductSchema = ProductSchema.partial().omit({ id: true });

// Mock in-memory store
let products: z.infer<typeof ProductSchema>[] = [];

export const productRoutes: FastifyPluginAsyncZod = async (fastify) => {

  fastify.post("/", {
    schema: {
      summary: "Create Product",
      body: CreateProductSchema,
      response: { 201: ProductSchema },
    },
  },
    async (req, reply) => {
      const newProduct = { id: crypto.randomUUID(), ...req.body };
      products.push(newProduct);
      return reply.code(201).send(newProduct);
    }
  );

  // Get All Products
  fastify.get(
    "/",
    {
      schema: {
        summary: "Get All Products",
        response: { 200: z.array(ProductSchema) },
      },
    },
    async () => products
  );

  // Get Product by ID
  fastify.get(
    "/:id",
    {
      schema: {
        summary: "Get Product by ID",
        params: z.object({ id: z.string().uuid() }),
        response: { 200: ProductSchema },
      },
    },
    async (req, reply) => {
      const product = products.find((p) => p.id === req.params.id);
      if (!product) return reply.code(404).send({ message: "Product not found" });
      return product;
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
        response: { 200: ProductSchema },
      },
    },
    async (req, reply) => {
      const index = products.findIndex((p) => p.id === req.params.id);
      if (index === -1) return reply.code(404).send({ message: "Product not found" });

      products[index] = { ...products[index], ...req.body };
      return products[index];
    }
  );

  // Delete Product
  fastify.delete(
    "/:id",
    {
      schema: {
        summary: "Delete Product",
        params: z.object({ id: z.string().uuid() }),
        response: { 200: z.object({ message: z.string() }) },
      },
    },
    async (req) => {
      products = products.filter((p) => p.id !== req.params.id);
      return { message: "Product deleted successfully" };
    }
  );
};
