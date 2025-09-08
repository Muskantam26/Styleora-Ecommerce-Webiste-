import { useEffect, useState } from "react";
import API from "./api";
import '../CSS/Showproduct.css';

function VProducts() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000); // adjust as needed

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/user/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

const searchProducts = async () => {
  try {
    const res = await API.get("/user/products/search", {
      params: {
        name: searchTerm
      }
    });
  setProducts(res.data);
    setMsg(`Showing results for "${searchTerm}"`);
  } catch (err) {
    console.error(err);
    setMsg("Error searching products");
  }
};


  const filterByPrice = async () => {
    try {
      const res = await API.get("/user/products/filter", {
        params: {
          minPrice: minPrice,
          maxPrice: maxPrice
        }
      });
      setProducts(res.data);
      setMsg(`Showing products from ₹${minPrice} to ₹${maxPrice}`);
    } catch (err) {
      console.error(err);
      setMsg("Error filtering products");
    }
  };


const sortProductsByName = async (order = "asc") => {
  try {
    const res = await API.get("/user/products/sort", {
      params: { order },
    });
    setProducts(res.data);
    setMsg(`Sorted by name (${order.toUpperCase()})`);
  } catch (err) {
    console.error(err);
    setMsg("Error sorting products");
  }
};



  const addToCart = async (productId) => {
    try {
      const username = localStorage.getItem("username");
      await API.post(`/api/cart/add`, null, {
        params: {
          productId: productId,
          quantity: 1,
          username: username
        }
      });
      setMsg("Product added to cart!");
    } catch (err) {
      console.error(err);
      setMsg("Error adding to cart");
    }
  };

  return (
   <div className="product-page">
  <h2>All Products</h2>

  <div className="main-layout">
    {/* Sidebar Starts */}
    <div className="sidebar">
      {/* Sort Buttons */}
      <div className="sort-buttons">
        <h4>Sort</h4>
        <button onClick={() => sortProductsByName("asc")}>Sort A-Z</button>
        <button onClick={() => sortProductsByName("desc")}>Sort Z-A</button>
      </div>

      {/* Search input */}
      <div className="search-section">
        <h4>Search</h4>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchProducts}>Search</button>
        <button onClick={fetchProducts} style={{ marginTop: "10px" }}>
          Clear
        </button>
      </div>

      {/* Price filter */}
      <div className="price-filter">
        <h4>Filter by Price</h4>
        <label>
          Min: ₹{minPrice}
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </label>
        <label>
          Max: ₹{maxPrice}
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </label>
        <button onClick={filterByPrice}>Apply</button>
      </div>
    </div>

    {/* Product Grid */}
    <div className="product-content">
      {msg && <p className="message">{msg}</p>}
      {products.length === 0 && <p className="message">No products found.</p>}

      <div className="product-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <h3>{p.name}</h3>
            <img src={p.imageUrl} alt={p.name} width="200" />
            <p>Price: ₹{p.price}</p>
            <p>Category: {p.category}</p>
            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
}

export default VProducts;
