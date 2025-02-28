import React, { useState } from "react";
import { HiTrash, HiPlusCircle } from "react-icons/hi";

interface Category {
  id: number;
  name: string;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      setError("⚠️ Category name cannot be empty.");
      return;
    }
    if (
      categories.some(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      )
    ) {
      setError("⚠️ Category already exists.");
      return;
    }
    const newCategory: Category = { id: Date.now(), name: categoryName };
    setCategories([...categories, newCategory]);
    setCategoryName("");
    setError("");
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
      {/* Header */}
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
        🏷️ Manage Categories
      </h2>

      {/* Input & Button Section */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <input
          type="text"
          placeholder="Enter Category Name"
          className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={handleAddCategory}
        >
          <HiPlusCircle className="text-lg" /> Add Category
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Category Table */}
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border border-border-light dark:border-border-dark rounded-lg shadow-sm">
          <thead className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <tr className="border-b border-border-light dark:border-border-dark">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr
                  key={category.id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  {/* Index */}
                  <td className="p-3">{index + 1}</td>

                  {/* Category Name */}
                  <td className="p-3 font-semibold">{category.name}</td>

                  {/* Actions */}
                  <td className="p-3 text-center">
                    <button
                      className="btn btn-error btn-sm flex items-center gap-1"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <HiTrash className="text-lg" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-6 text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryPage;
