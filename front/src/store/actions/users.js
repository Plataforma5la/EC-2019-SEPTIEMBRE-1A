import axios from "axios";
import MyEmail from "../../components/Mail";
import { renderEmail } from "react-html-email";
import React from "react";

import {
  GET_USER,
  LOG_USER,
  SET_HISTORIAL,
  GET_USERS,
  SET_ADMINHISTORIAL,
  SET_STATUS,
  PEDIDO_SELECTED
} from "../constants/index";

import { getCart, emptyCart, syncCart } from "./cart";

const getUser = user => ({
  type: GET_USER,
  user
});

const pedidoSelected = pedido => ({
  type: PEDIDO_SELECTED,
  pedido
});

const getUsers = users => ({
  type: GET_USERS,
  users
});

const logUser = logUser => ({
  type: LOG_USER,
  logUser
});

const setStatus = setStatus => ({
  type: SET_STATUS,
  setStatus
})

export const setHistorial = historial => ({
  type: SET_HISTORIAL,
  historial
});

export const signUpUser = user => dispatch => {
  if (!user.password.length) throw Error("No password");
  return axios
    .post("/api/users", user)
    .then(user => true)
    .catch(err => {
      throw err;
    });
};

export const fetchUser = () => dispatch =>
  axios.get("/api/sessions").then(user => {
    dispatch(getUser(user.data));
    if(user.data.id){
      dispatch(getCart(user.data.id));
      dispatch(userHistorial());
    }
  });

export const fetchUsers = () => dispatch => {
  axios
    .get("/api/users/permisos")
    .then(users => {
      dispatch(getUsers(users.data));
    })
    .catch(err => console.log(err));
};
export const changePermission = ([value, id]) => dispatch => {
  axios
    .put(`/api/users/permisos`, { data: [value, id] })
    .then(users => dispatch(getUsers(users.data)));
};

export const setOrderStatus = ([status, orderId, userId]) => dispatch => {
  return axios
    .put(`/api/pedidos/adminOrders`, [status, orderId, userId])
    .then(info => dispatch(setStatus(info.data)))
};

export const delUsers = arrId => dispatch => {
  axios
    .delete(`/api/users/permisos`, { data: arrId })
    .then(users => dispatch(getUsers(users.data)));
};


export const adminHistorial = adminHistorial => ({
  type: SET_ADMINHISTORIAL,
  adminHistorial
});

export const loginUser = (username, password) => dispatch => {
  if (!password.length) throw Error("No password");
  return axios
    .post("/api/sessions", { username, password })
    .then(res => dispatch(logUser(res.data)))
    .then(() => dispatch(syncCart()))
    .then(() => dispatch(userHistorial()))
    .catch(err => {
      throw err;
    });
};

export const userHistorial = () => dispatch => {
  axios
    .get("/api/pedidos/historial")
    .then(res => {
      return dispatch(setHistorial(res.data));
    })
    .catch(err => console.error(err));
};

export const userLogOut = () => dispatch => {
  axios
    .delete("/api/sessions")
    .then(() => {
      dispatch(getUser({}));
    })
    .then(() => {
      dispatch(setHistorial({}));
      dispatch(emptyCart(true));
    })
    .catch(error => console.error(error));
};


export const placeOrder = (user, mail, cart) => dispatch => {
  return axios
    .post("/api/pedidos", {
      messageHtml: renderEmail(<MyEmail name={user.name} cart={cart} />),
      name: user.name,
      to: mail
    })
    .then(() => {
      dispatch(userHistorial());
      dispatch(emptyCart());
    })
    .catch(err => console.error(err));
};

export const fetchAdminOrders = () => dispatch =>{
  return axios
    .get("/api/pedidos/dashboard/adminOrders")
    .then(res => res.data)
    .then(historial => dispatch(adminHistorial(historial)));
  }

export const updateUser = userForUpdate => dispatch => {
  return axios
    .put("/api/users/editprofile", { data: userForUpdate })
    .then(userUpdated => dispatch(getUser(userUpdated.data)))
    .catch(err => console.log(err));
  }

export const fetchPedido = id => dispatch => {
  axios.get(`/api/pedidos/${id}`).then(res => {
    dispatch(pedidoSelected(res.data));
  });
};  
