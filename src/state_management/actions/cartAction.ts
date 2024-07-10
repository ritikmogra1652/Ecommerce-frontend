// import { Action, Dispatch } from "redux";
import { IProduct, RemoveFromCartPayload, UpdateCartQuantityPayload } from "../../interface/commonInterfaces";
import ActionType from "../../resources/enums";

export const addToCart = (product: IProduct, quantity: number) => ({
  type: ActionType.ADD_TO_CART,
  payload: { product, quantity },
});

export const removeFromCart = (productId: RemoveFromCartPayload) => ({
  type: ActionType.REMOVE_FROM_CART,
  payload: productId,
});

export const updateCartQuantity = (payload: UpdateCartQuantityPayload) => ({
  type: ActionType.UPDATE_CART_QUANTITY,
  payload,
});

export const clearCart = () => ({
  type: ActionType.CLEAR_CART,
});