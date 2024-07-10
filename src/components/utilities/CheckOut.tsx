import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RootState } from '../../state_management'; // Assuming RootState includes CartState
import axios from 'axios';
import endPoints, { backendApiUrl } from '../../constants/endPoints';
import { clearCart } from '../../state_management/actions/cartAction';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes';
import './CheckOut.css';
import { toastMessageSuccess } from './CommonToastMessage';

const schema = yup.object().shape({
    address: yup.string().required('Address is required'),
    phone: yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]+$/, 'Phone number must only contain digits')
        .min(10, 'Phone number must be at least 10 digits')
        .max(10, 'Phone number must be at most 10 digits'),
});

interface FormFields {
    
    address: string,
    phone: string,

}
const Checkout: React.FC = () => {
    const cartItems = useSelector((state: RootState) => state.CartReducer.items);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const jwtToken = useSelector((state: RootState) => state.AuthReducer.authData?.jwtToken);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const handleOrder = async (data: FormFields) => {
        setLoading(true);
        setError(null);

        const orderData = {
            address: data.address,
            phone: data.phone,
            items: cartItems.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            total: subtotal
        };

        try {
            console.log(orderData);
            
            const AuthStr = 'Bearer '.concat(jwtToken as string);
            const response = await axios.post(`${backendApiUrl}${endPoints.PLACE_ORDER}`, orderData, {
                headers: {
                    'Authorization': AuthStr
                }
            });

            if (response.data.success) {
                dispatch(clearCart());
                navigate(routes.HOMEPAGE);
                toastMessageSuccess("Order placed successfully");

            } else {
                setError('Order could not be placed. Please try again.');
            }
        } catch (err) {
            setError('Order could not be placed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="checkout-items">
                {cartItems.map((item, index) => (
                    <div key={index} className="checkout-item">
                        <img src={item.product.image} alt={item.product.product_name} />
                        <div className="item-details">
                            <h3>{item.product.product_name}</h3>
                            <p>Price: Rs {item.product.price}</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="checkout-summary">
                <p>Subtotal: Rs {subtotal}</p>
            </div>
            <form className="checkout-form" onSubmit={handleSubmit(handleOrder)}>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        {...register('address')}
                    />
                    {errors.address && <p className="checkout-error-message">{errors.address.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="text"
                        id="phone"
                        {...register('phone')}
                    />
                    {errors.phone && <p className="checkout-error-message">{errors.phone.message}</p>}
                </div>
                <button type="submit" className="order-button" disabled={loading}>
                    {loading ? 'Placing Order...' : 'Place Order'}
                </button>
                {error && <p className="checkout-error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Checkout;
