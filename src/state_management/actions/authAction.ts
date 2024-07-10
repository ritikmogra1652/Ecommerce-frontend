import { Action, Dispatch } from "redux";
import ActionType from "../../resources/enums";
import {  IUserData } from "../../interface/commonInterfaces";


// export const signUpAction  = (data: ISignUp) => (dispatch: Dispatch<Action>) => {
//   return dispatch({
//   type: ActionType.SIGNUP,
//   payload: data,
// })
// };

export const logInAction  = (data: IUserData) => (dispatch: Dispatch<Action>) => {
    return dispatch({
    type: ActionType.LOGIN,
    payload: data,
  });
};

export const logOutAction  = () => (dispatch: Dispatch<Action>) => {
    return (dispatch({
      type: ActionType.LOGOUT,
    }));
};

export const clearAuth = () => ({
  type: ActionType.CLEAR_AUTH,
});


export const updateAuth =
  (data: string) => (dispatch: Dispatch<Action>) => {
    return dispatch({
      type: ActionType.UPDATE_AUTH,
      payload: data,
    });
  };
