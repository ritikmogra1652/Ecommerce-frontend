import React from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import {  useDispatch, useSelector } from 'react-redux';
import routes from '../../constants/routes';
import { RootState } from '../../state_management';
import './Navbar.css'
import { logOutAction } from '../../state_management/actions/authAction';
import { bindActionCreators } from 'redux';
import { toastMessageSuccess } from './CommonToastMessage';
import { clearCart } from '../../state_management/actions/cartAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';


const Navbar: React.FC = () => {

    const isLoggedIn = useSelector((state: RootState) => state.AuthReducer.isLoggedIn);
    const cartItemCount = useSelector((state: RootState) => state.CartReducer.items.length);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const actions = bindActionCreators(
        {
            logOutAction,
            clearCart
        },
        dispatch
    );

    const handleLogout = () => {
        actions.logOutAction();
        actions.clearCart();
        toastMessageSuccess("User Logged Out SuccessFully");
        navigate(routes.HOMEPAGE);
    }


    return (
        <nav>
            <ul>
                <li><Link to="/">HOMEPAGE</Link></li>
                {/* <li><Link to={routes.CART}>CART</Link></li>
                 */}
                <li>
                    <Link to={routes.CART} className="cart-link">
                    <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                    </Link>
                </li>

                {isLoggedIn ? (
                    <>
                        <li><Link to={routes.MYORDERS}>My Orders</Link></li>
                        <li><Link to={routes.MYPROFILE}>My Profile</Link></li>
                        <li><Link to={routes.HOMEPAGE} onClick={handleLogout}>Logout</Link></li>
                    </>
                ) : (
                    <>
                    
                        <li><Link to={routes.LOGIN}>Login</Link></li>
                        <li><Link to={routes.SIGNUP}>SignUp</Link></li>
                    </>
                )}

            </ul>
        </nav>
    )
}



export default Navbar;