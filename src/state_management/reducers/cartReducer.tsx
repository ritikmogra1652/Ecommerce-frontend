import { AddToCartPayload, IProduct, RemoveFromCartPayload, UpdateCartQuantityPayload } from '../../interface/commonInterfaces';
import ActionType from '../../resources/enums/index';

interface CartState {
    items: {
        product: IProduct;
        quantity: number;
    }[];
}

const initialState: CartState = {
    items: [],
};
interface AddToCartAction {
    type:  ActionType.ADD_TO_CART;
    payload: AddToCartPayload;
}

interface RemoveFromCartAction {
    type:  ActionType.REMOVE_FROM_CART;
    payload: RemoveFromCartPayload;
}

interface UpdateCartQuantityAction {
    type: ActionType.UPDATE_CART_QUANTITY;
    payload: UpdateCartQuantityPayload;
}


interface ClearCartAction {
    type:  ActionType.CLEAR_CART;
}

type Action =
    | AddToCartAction
    | RemoveFromCartAction
    | UpdateCartQuantityAction
    | ClearCartAction
const CartReducer = (state:CartState= initialState, action: Action) => {
    switch (action?.type) {
        case ActionType.ADD_TO_CART: {
            const existingItem = state.items.find(item => item.product._id === action.payload.product._id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.product._id === action.payload.product._id
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    ),
                };
            }
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        }
            
        case ActionType.UPDATE_CART_QUANTITY:
            return {
                ...state,
                items: state.items.map(item =>
                    item.product._id === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        
        
        case ActionType.REMOVE_FROM_CART:
            return {
                ...state,
                items: state.items.filter(item => item.product._id !== action.payload.productId),
                
                
            };
        case ActionType.CLEAR_CART:
            return {
                ...state,
                items: [],
            };
        default:
            return state;
    }
};

export default CartReducer;
