import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import './MyOrder.css';

interface OrderItem {
  _id: string;
  product_name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  address: string;
  phone: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  username: string;
}

const MyOrder: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);

  const fetchOrders = async () => {
    try {
      const AuthStr = 'Bearer '.concat(jwtToken as string);
      const response = await axios.get(`${backendApiUrl}${endPoints.GET_ORDERS}`, {
        headers: {
          'Authorization': AuthStr
        }
      });
      console.log(response.data.data);
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [jwtToken]); 

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!orders || orders.length === 0) {
    return (<>
            <h2>My Orders</h2>
      <p>You have no orders.</p>
    </>
    );
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders && orders.length === 0 ? (
        <p>You have no orders.</p> 
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order">
            <div className="order-details">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> Rs {order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <p><strong>Items: </strong></p>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img src={item.image} alt={item.product_name} />
                  <div className="item-details">
                    <h3>{item.product_name}</h3>
                    <p>Price: Rs {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrder;
