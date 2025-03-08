import React, { useEffect, useMemo, useState } from "react";
import { HiTrash, HiPlusCircle } from "react-icons/hi";
import categoryService from "../../services/CategoryServices";

interface Category {
  _id: string;
  categoryName: string;
}

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await categoryService.getAllCategories();
      // console.log(response.data.data);
      setCategories(response.data.data);
    };
    fetchCategories();
  }, [isLoading]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setError("⚠️ Category name cannot be empty.");
      return;
    }
    setError("");

    try {
      setIsLoading(true);
      const response = await categoryService.createCategory(categoryName);
      // console.log(response);
      if (response.status === 201) {
        setIsLoading(false);
        setCategoryName("");
        setError("");
        alert("Category created successfully");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setError("⚠️ Failed to create category.");
      alert("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    console.log(id);
    try {
      setIsLoading(true);
      const response = await categoryService.deleteCategory(id);
      if (response.status === 200) {
        setIsLoading(false);
        alert("Category deleted successfully");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      alert("Failed to delete category");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.categoryName.toLowerCase().includes(categoryName.toLowerCase())
    );
  }, [categories, categoryName]);

  return (
    <div className="max-w-6xl mx-auto bg-surface-light dark:bg-surface-dark shadow-lg p-6 rounded-xl border border-border-light dark:border-border-dark">
      <h2 className="text-2xl font-bold text-primary dark:text-primary-light text-center">
        🏷️ Manage Categories
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <input
          type="text"
          placeholder="Search or Enter Category Name"
          className="input rounded-lg w-full border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button
          className="btn btn-outline  flex items-center gap-2"
          onClick={handleAddCategory}
        >
          <HiPlusCircle className="text-lg" /> Add Category
        </button>
      </div>

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
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <tr
                  key={category._id}
                  className="border-b border-border-light dark:border-border-dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  {/* Index */}
                  <td className="p-3">{index + 1}</td>

                  {/* Category Name */}
                  <td className="p-3 font-semibold">{category.categoryName}</td>

                  {/* Actions */}
                  <td className="p-3 text-center">
                    <button
                      className="btn btn-error btn-md "
                      onClick={() => handleDeleteCategory(category._id)}
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
