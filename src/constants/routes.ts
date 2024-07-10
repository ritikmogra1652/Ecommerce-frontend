const routes = {
  HOMEPAGE: "/",
  SIGNUP: "/signup",
  LOGIN: "/login",
  MYORDERS: "/myorders",
  MYPROFILE: "/myprofile",
  UPDATE_PASSWORD: "/updatepassword",
  EDIT_PROFILE: "/editprofile",
  CART: "/cart",
  CHECKOUT: "/checkout",
};

export const beforeLoginRoutes = [
  routes.HOMEPAGE,
  routes.LOGIN,
  routes.CART,
  routes.SIGNUP,
];

export default routes;
