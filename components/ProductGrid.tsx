"use client";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
    >
      <AnimatePresence mode="popLayout">
        {products.map((item) => (
          <motion.div key={item.id} variants={itemVariants} layout>
            <ProductCard product={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};