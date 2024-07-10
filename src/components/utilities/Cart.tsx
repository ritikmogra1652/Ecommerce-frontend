import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state_management';
import './Cart.css';
import { removeFromCart, updateCartQuantity } from '../../state_management/actions/cartAction';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import { toastMessageSuccess } from './CommonToastMessage';

const MyCart: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.CartReducer.items);
    const isLoggedIn = useSelector((state: RootState) => state.AuthReducer.isLoggedIn)
    const subtotal = cartItems.reduce((acc, item) => {
        return acc + (item.product.price * item.quantity);
    }, 0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        dispatch(updateCartQuantity({ productId, quantity: newQuantity }));
    };

    const handleRemoveFromCart = (productId: string) => {
        dispatch(removeFromCart({ productId }));
        toastMessageSuccess("Product removed successfully");
    };

    const handleProceedToCheckout = () => {
        if (isLoggedIn) {
            navigate(routes.CHECKOUT);
        } else {
            navigate(routes.LOGIN);
        }
    };

    return (
        <div className="mycart-container">
            <h2>My Cart</h2>
            {cartItems.length === 0 ? (
                <p className="mycart-empty-message">Your cart is empty.</p>
            ) : (
                <div className="mycart-items">
                    {cartItems.map((item, index) => (
                        <div key={index} className="mycart-item">
                            <img
                                src={item.product.image}
                                alt={item.product.product_name}
                                className="mycart-item-image"
                            />
                            <div className="mycart-item-details">
                                <h3 className="mycart-item-name">{item.product.product_name}</h3>
                                <p className="mycart-item-price">Price: Rs {item.product.price}</p>
                                <div className="mycart-quantity-control">
                                    <label htmlFor={`quantity-${index}`} className="mycart-quantity-label">Quantity:</label>
                                    <select
                                        id={`quantity-${index}`}
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.product._id, +e.target.value)}
                                        className="mycart-quantity-select"
                                    >
                                        {[...Array(100)].map((_, i) => (
                                            <option key={i} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className="mycart-item-total">Total Price: Rs {item.product.price * item.quantity}</p>
                                <button onClick={() => handleRemoveFromCart(item.product._id)} className="mycart-delete-button">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mycart-subtotal">
                        <p className="mycart-subtotal-text">Subtotal: Rs {subtotal}</p>
                    </div>
                    <div className="mycart-actions">
                        <button className="mycart-proceed-button" onClick={handleProceedToCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCart;
