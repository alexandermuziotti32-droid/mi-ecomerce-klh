"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProduct, updateProduct } from "@/app/admin/products/actions";
import type { Product, ColorVariant } from "@/types";
import type { Json } from "@/types/supabase";

export const ProductForm = ({ product }: { product?: Product }) => {
  const router = useRouter();
  const isEditing = Boolean(product);

  const [customId, setCustomId] = useState("");
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [colors, setColors] = useState<ColorVariant[]>(
    (product?.colors as ColorVariant[] | null) ?? [],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (uploadError) {
      setError(`Error al subir imagen: ${uploadError.message}`);
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    setImages((prev) => [...prev, publicUrlData.publicUrl]);
    setIsUploading(false);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addColor = () => {
    setColors((prev) => [
      ...prev,
      { name: "", hex: "#000000", sizes: [{ size: "S", stock: 0 }] },
    ]);
  };

  const removeColor = (index: number) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColorField = (
    index: number,
    field: "name" | "hex",
    value: string,
  ) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    );
  };

  const addSize = (colorIndex: number) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIndex
          ? { ...c, sizes: [...c.sizes, { size: "", stock: 0 }] }
          : c,
      ),
    );
  };

  const removeSize = (colorIndex: number, sizeIndex: number) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIndex
          ? { ...c, sizes: c.sizes.filter((_, si) => si !== sizeIndex) }
          : c,
      ),
    );
  };

  const updateSizeField = (
    colorIndex: number,
    sizeIndex: number,
    field: "size" | "stock",
    value: string,
  ) => {
    setColors((prev) =>
      prev.map((c, i) =>
        i === colorIndex
          ? {
              ...c,
              sizes: c.sizes.map((s, si) =>
                si === sizeIndex
                  ? { ...s, [field]: field === "stock" ? Number(value) : value }
                  : s,
              ),
            }
          : c,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    setIsSaving(true);

    const input = {
      ...(!isEditing && customId ? { id: Number(customId) } : {}),
      name: name.trim(),
      price: price ? Number(price) : 0,
      description: description.trim(),
      category: category || null,
      images,
      colors: colors as unknown as Json,
    };

    try {
      if (isEditing && product) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el producto",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {isEditing ? (
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
            Número de artículo
          </label>
          <p className="text-lg font-bold py-3">#{product?.id}</p>
        </div>
      ) : (
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
            Número de artículo (opcional)
          </label>
          <input
            type="number"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            placeholder="Se genera automáticamente si lo dejás vacío"
            className="w-full border-b border-gray-200 py-3 outline-none focus:border-black"
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
            Nombre
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-b border-gray-200 py-3 outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
            Precio
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border-b border-gray-200 py-3 outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border-b border-gray-200 py-3 outline-none focus:border-black bg-white"
          >
            <option value="">Sin categoría</option>
            <option value="hombres">Hombres</option>
            <option value="mujeres">Mujeres</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-black"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3">
          Imágenes
        </label>
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative w-24 h-32 bg-gray-100 rounded overflow-hidden group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
        />
        {isUploading && (
          <p className="text-xs text-gray-400 mt-2">Subiendo imagen...</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400">
            Colores y Talles
          </label>
          <button
            type="button"
            onClick={addColor}
            className="text-[10px] font-bold uppercase tracking-widest underline"
          >
            + Agregar color
          </button>
        </div>

        <div className="space-y-6">
          {colors.map((color, colorIndex) => (
            <div
              key={colorIndex}
              className="border border-gray-200 rounded-lg p-4 space-y-4"
            >
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">
                    Nombre del color
                  </label>
                  <input
                    value={color.name}
                    onChange={(e) =>
                      updateColorField(colorIndex, "name", e.target.value)
                    }
                    className="w-full border-b border-gray-200 py-2 outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-bold text-gray-400 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) =>
                      updateColorField(colorIndex, "hex", e.target.value)
                    }
                    className="w-12 h-9 border border-gray-200 rounded cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeColor(colorIndex)}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-600 underline"
                >
                  Quitar color
                </button>
              </div>

              <div className="space-y-2">
                {color.sizes.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="flex gap-3 items-center">
                    <input
                      placeholder="Talle"
                      value={size.size}
                      onChange={(e) =>
                        updateSizeField(
                          colorIndex,
                          sizeIndex,
                          "size",
                          e.target.value,
                        )
                      }
                      className="w-20 border-b border-gray-200 py-1 outline-none focus:border-black text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={size.stock}
                      onChange={(e) =>
                        updateSizeField(
                          colorIndex,
                          sizeIndex,
                          "stock",
                          e.target.value,
                        )
                      }
                      className="w-24 border-b border-gray-200 py-1 outline-none focus:border-black text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSize(colorIndex, sizeIndex)}
                      className="text-gray-300 hover:text-red-600 text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSize(colorIndex)}
                  className="text-[9px] font-bold uppercase tracking-widest underline text-gray-400"
                >
                  + Agregar talle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving || isUploading}
        className="w-full bg-black text-white py-4 uppercase text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50"
      >
        {isSaving
          ? "Guardando..."
          : isEditing
            ? "Guardar Cambios"
            : "Crear Producto"}
      </button>
    </form>
  );
};
