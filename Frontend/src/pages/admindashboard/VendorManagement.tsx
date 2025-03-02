import React, { useState } from "react";
import { HiTrash, HiPencilAlt, HiPlusCircle, HiX } from "react-icons/hi";

interface Vendor {
  id: number;
  fullName: string;
  email: string;
  contactNumber: string;
  companyName: string;
  companyAddress: string;
  companyMobileNumber: string;
  brandName?: string;
  countryOfOrigin: string;
}

const VendorManagement: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [error, setError] = useState("");

  const handleOpenModal = (vendor?: Vendor) => {
    setCurrentVendor(
      vendor || {
        id: 0,
        fullName: "",
        email: "",
        contactNumber: "",
        companyName: "",
        companyAddress: "",
        companyMobileNumber: "",
        brandName: "",
        countryOfOrigin: "",
      }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentVendor(null);
    setIsModalOpen(false);
  };

  const handleSaveVendor = () => {
    if (!currentVendor) return;
    if (!currentVendor.fullName.trim() || !currentVendor.email.trim()) {
      setError("⚠️ Full Name and Email are required.");
      return;
    }
    if (
      vendors.some(
        (v) =>
          v.email.toLowerCase() === currentVendor.email.toLowerCase() &&
          v.id !== currentVendor.id
      )
    ) {
      setError("⚠️ Vendor with this email already exists.");
      return;
    }

    if (currentVendor.id && vendors.some((v) => v.id === currentVendor.id)) {
      setVendors(
        vendors.map((v) => (v.id === currentVendor.id ? currentVendor : v))
      );
    } else {
      setVendors([...vendors, { ...currentVendor, id: Date.now() }]);
    }

    setError("");
    handleCloseModal();
  };

  const handleDeleteVendor = (id: number) => {
    setVendors(vendors.filter((v) => v.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg p-6 rounded-xl border">
      <h2 className="text-2xl font-bold text-primary text-center">
        🏢 Vendor Management
      </h2>
      <div className="flex justify-end">
        <button
          className="btn btn-outline flex items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <HiPlusCircle className="text-lg" /> Add Vendor
        </button>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="table-auto w-full border rounded-lg shadow-sm text-xl">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Full Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact Number</th>
              <th className="p-3 text-left">Company</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <tr
                  key={vendor.id}
                  className="border-b hover:bg-gray-100 transition-all"
                >
                  <td className="p-3 font-semibold">{vendor.fullName}</td>
                  <td className="p-3">{vendor.email}</td>
                  <td className="p-3">{vendor.contactNumber}</td>
                  <td className="p-3">{vendor.companyName}</td>
                  <td className="p-3">{vendor.countryOfOrigin}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="btn btn-outline bg-amber-400 btn-md flex items-center gap-1"
                      onClick={() => handleOpenModal(vendor)}
                    >
                      <HiPencilAlt className="text-lg" /> Edit
                    </button>
                    <button
                      className="btn btn-outline bg-red-500 btn-md flex items-center gap-1"
                      onClick={() => handleDeleteVendor(vendor.id)}
                    >
                      <HiTrash className="text-lg" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  No vendors available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg border shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {currentVendor?.id ? "Update Vendor" : "Add Vendor"}
              </h2>
              <button
                className="text-gray-500 hover:text-red-500 transition"
                onClick={handleCloseModal}
              >
                <HiX size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {[
                "fullName",
                "email",
                "contactNumber",
                "companyName",
                "companyAddress",
                "companyMobileNumber",
                "brandName",
                "countryOfOrigin",
              ].map((field, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  className="input rounded-lg w-full border bg-gray-100"
                  value={(currentVendor as any)?.[field] || ""}
                  onChange={(e) =>
                    setCurrentVendor({
                      ...currentVendor!,
                      [field]: e.target.value,
                    })
                  }
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-md mt-2">{error}</p>}
            <div className="mt-4 flex justify-end">
              <button
                className="btn btn-outline bg-green-500 text-white"
                onClick={handleSaveVendor}
              >
                {currentVendor?.id ? "Update" : "Add"}
              </button>
              <button
                className="btn btn-outline bg-red-600 text-white ml-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
