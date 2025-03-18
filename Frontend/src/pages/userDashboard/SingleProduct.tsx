import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import userServices from "../../services/UserServices";
import cartService from "../../services/CartServicec";
import toast from "react-hot-toast";
interface Product {
  _id?: string;
  productName: string;
  category: string;
  sellPrice: number;
  images: string[];
  productDescription: string;
}

const SingleProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product>();
  const [mainImage, setMainImage] = useState(product?.images[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await userServices.getProductDetails(
        productId as string
      );
      console.log(response.data.data);
      const tempProducts = response.data.data ? response.data.data : null;

      const productData = {
        _id: tempProducts?._id,
        productName: tempProducts?.productName,
        category: tempProducts?.category,
        sellPrice: tempProducts?.sellPrice,
        images: tempProducts?.images,
        productDescription: tempProducts?.productDescription,
      };

      setProduct(productData);
      setMainImage(productData?.images[0]);
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async (productId: string, quantity: number) => {
    console.log(productId, quantity);

    try {
      const response = await cartService.addToCart(productId, quantity);
      console.log(response);
      if (response.status === 200) {
        toast.success("Product added to cart");
        navigate("/user/cart");
      } else {
        toast.error("Failed to add product to cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {product && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={mainImage}
                  alt={product.productName}
                  className="w-full max-w-lg h-96 object-cover rounded-lg shadow-md transition-transform duration-300 transform group-hover:scale-105"
                />
              </div>
              {/* Thumbnail Images */}
              <div className="flex mt-4 space-x-2">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                      mainImage === image
                        ? "border-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    onClick={() => setMainImage(image)}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.productName}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                Category:{" "}
                <span className="font-semibold">{product.category}</span>
              </p>

              {/* <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </div>
                <button className="btn btn-ghost btn-sm flex items-center text-red-500 hover:text-red-600">
                  <FaHeart className="mr-1" /> Wishlist
                </button>
              </div> */}

              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                ${product.sellPrice}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                {product.productDescription}
              </p>

              <div className="flex flex-col gap-4  mt-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="btn btn-xl bg-amber-400 flex items-center dark:text-white dark:bg-primary"
                  >
                    -
                  </button>
                  <span className="mx-2 text-xl p-4 font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="btn btn-xl bg-amber-400 flex items-center dark:text-white dark:bg-primary"
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-xl bg-amber-400 flex items-center dark:text-white dark:bg-primary"
                  onClick={() =>
                    handleAddToCart(product._id as string, quantity)
                  }
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </button>
                <button
                  className="btn btn-accent btn-xl"
                  onClick={() => navigate("/user/cart")}
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleProduct;
