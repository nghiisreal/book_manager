/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import AddBook from '../../components/Add/AddBook/AddBook';
import AddAuthor from '../../components/Add/AddAuthor/AddAuthor';
import AddPublisher from '../../components/Add/AddPublisher/AddPublisher';
import AddCategory from '../../components/Add/AddCategory/AddCategory';
import PageNotFound from '../PageNotFound/PageNotFound';
import AddCustomer from '../../components/Add/AddCustomer/AddCustomer';
import AddOrder from '../../components/Add/AddOrder/AddOrder';
import InputIrcHistory from '../../components/Home/Inventory/InputIrcHistory';
import ExportExpHistory from '../../components/Home/Inventory/ExportExpHistory';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
export default function AddItem(props) {
  const type = props.match.params.type;
  const [role, setRole] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      const role = decodedToken.role; // lấy role từ token api
      setRole(role); // Lưu role vào state
    }
  }, []);
  if (localStorage.getItem('token')) {
    // dựa vào giá trị của type để render component tương ứng
    if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'add-book') {
      return <AddBook />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'add-author') {
      return <AddAuthor />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'add-publisher') {
      return <AddPublisher />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'add-category') {
      return <AddCategory />;
    } else if ((role === 'Quản trị viên' || role === 'NV bán hàng') && type === 'add-customer') {
      return <AddCustomer />;
    } else if ((role === 'Quản trị viên' || role === 'NV bán hàng') && type === 'add-order') {
      return <AddOrder />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'irc-history') {
      return <InputIrcHistory />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'iep-history') {
      return <ExportExpHistory />;
    } else if (role !== '') {
      return <PageNotFound />;
    }
  } else {
    alert('Vui lòng đăng nhập để vào trang này !');
    return <Redirect to="/" />;
  }
}
