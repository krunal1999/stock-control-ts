import React, { useEffect, useState } from "react";
import { HiTrash, HiPencilAlt, HiPlusCircle, HiX } from "react-icons/hi";
import vendorservice from "../../services/VendorServices";

interface Vendor {
  _id?: string;
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
  const [currentVendor, setCurrentVendor] = useState<Vendor>({
    fullName: "",
    email: "",
    contactNumber: "",
    companyName: "",
    companyAddress: "",
    companyMobileNumber: "",
    brandName: "",
    countryOfOrigin: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      const response = await vendorservice.getAllVendor();
      // console.log(response.data.data);
      setVendors(response.data.data);
      setLoading(false);
    };
    fetchVendors();
  }, [loading]);

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setCurrentVendor(vendor);
    } else {
      setCurrentVendor({
        fullName: "",
        email: "",
        contactNumber: "",
        companyName: "",
        companyAddress: "",
        companyMobileNumber: "",
        brandName: "",
        countryOfOrigin: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentVendor({
      fullName: "",
      email: "",
      contactNumber: "",
      companyName: "",
      companyAddress: "",
      companyMobileNumber: "",
      brandName: "",
      countryOfOrigin: "",
    });
    setIsModalOpen(false);
  };

  const handleSaveVendor = async () => {
    if (!currentVendor) return;
    if (
      !currentVendor.fullName.trim() ||
      !currentVendor.email.trim() ||
      !currentVendor.brandName ||
      !currentVendor.countryOfOrigin ||
      !currentVendor.companyName ||
      !currentVendor.companyAddress ||
      !currentVendor.companyMobileNumber ||
      !currentVendor.contactNumber
    ) {
      setError("⚠️ All fields are required.");
      return;
    }
    console.log(currentVendor);

    try {
      setError("");
      setLoading(true);
      const response = await vendorservice.createVendor(currentVendor);
      console.log(response);
      handleCloseModal();
      setLoading(false);
      setError("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    console.log(id);
    try {
      setLoading(true);
      const response = await vendorservice.deleteVendor(id);
      if (response.status === 200) {
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleUpdateVendor = async () => {
    console.log(currentVendor);
    try {
      setLoading(true);
      const response = await vendorservice.updateVendor(
        currentVendor._id || "",
        currentVendor
      );
      if (response.status === 200) {
        // console.log(response);
        handleCloseModal();
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className=" max-w-7xl mx-auto bg-white shadow-lg p-6 rounded-xl  dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-primary text-center">
        🏢 Vendor Management
      </h2>
      <div className="flex justify-end">
        <button
          className="btn btn-outline btn-xl flex items-center gap-2"
          onClick={() => handleOpenModal()}
        >
          <HiPlusCircle className="text-xl" /> Add Vendor
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
                  key={vendor._id}
                  className="border-b hover:bg-gray-100 dark:hover:bg-gray-500 transition-all"
                >
                  <td className="p-3 font-semibold">{vendor.fullName}</td>
                  <td className="p-3">{vendor.email}</td>
                  <td className="p-3">{vendor.contactNumber}</td>
                  <td className="p-3">{vendor.companyName}</td>
                  <td className="p-3">{vendor.countryOfOrigin}</td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      className="btn btn-outline bg-amber-400 btn-md flex items-center gap-1 dark:text-black"
                      onClick={() => handleOpenModal(vendor)}
                    >
                      <HiPencilAlt className="text-lg" /> Edit
                    </button>
                    <button
                      className="btn btn-outline bg-red-500 btn-md flex items-center gap-1 dark:text-black"
                      onClick={() => handleDeleteVendor(vendor._id || "")}
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center dark:bg-gray-800">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl border shadow-xl dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {currentVendor._id ? "Update Vendor" : "Add Vendor"}
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
                "fullName-text",
                "email-email",
                "contactNumber-number",
                "companyName-text",
                "companyAddress-text",
                "companyMobileNumber-number",
                "brandName-text",
                "countryOfOrigin-text",
              ].map((field, index) => {
                const [fieldName, fieldType] = field.split("-"); // Split the string
                const placeholderText = fieldName
                  .replace(/([A-Z])/g, " $1")
                  .trim(); // Create placeholder

                return (
                  <input
                    key={index}
                    type={fieldType} // Set the type
                    required
                    placeholder={placeholderText} // Set the placeholder
                    className="input text-xl rounded-lg w-full border bg-gray-100 dark:bg-gray-800"
                    value={
                      (currentVendor as Vendor)?.[fieldName as keyof Vendor] ||
                      ""
                    }
                    onChange={(e) =>
                      setCurrentVendor({
                        ...currentVendor!,
                        [fieldName as keyof Vendor]: e.target.value,
                      })
                    }
                  />
                );
              })}
            </div>

            {error && <p className="text-red-500 text-md mt-2">{error}</p>}
            <div className="mt-4 flex justify-end">
              {currentVendor._id ? (
                <button
                  className="btn btn-outline bg-green-500 text-white"
                  onClick={handleUpdateVendor}
                >
                  Update
                </button>
              ) : (
                <button
                  className="btn btn-outline bg-green-500 text-white"
                  onClick={handleSaveVendor}
                >
                  Add
                </button>
              )}

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
