import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/products", {
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const productsData: Product[] = await response.json();
          setProducts(productsData);
        } else {
          console.error("Error fetching products:", response.status);
        }
      } catch (error) {
        console.error("Error during fetchProducts:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Products</h2>
      <table className="table table-bordered table-striped">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
