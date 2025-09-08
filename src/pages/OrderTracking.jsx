import { useEffect, useState } from "react";
import API from "./api";
import '../CSS/Trackorders.css';

function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/api/orders", {
        params: { username }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const res = await API.get(`/api/invoice/${orderId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('❌ Error downloading invoice:', err);
    }
  };

  return (
<div className="orders-container">
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders found.</p>}

      {orders.map(order => (
        <div
          key={order.id}
          className="order-box"
        >
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Payment ID: {order.paymentId}</p>
          <h4>Items:</h4>
          {order.items.map(item => (
            <div key={item.id} className="item-box"> 
              <p>{item.product.name} - Qty: {item.quantity}</p>
              <img src={item.product.imageUrl} alt={item.product.name} width="100" />
            </div>
          ))}

          {/*  Download Invoice Button INSIDE the order box */}
          <button
            style={{ marginTop: "10px" }}
            onClick={() => downloadInvoice(order.id)}
               className="download-btn"
          >
            Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
}

export default OrderTracking;
