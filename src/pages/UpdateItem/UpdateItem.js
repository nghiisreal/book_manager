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
import UpdateBook from '../../components/Update/UpdateBook/UpdateBook';
import UpdateAuthor from '../../components/Update/UpdateAuthor/UpdateAuthor';
import UpdatePublisher from '../../components/Update/UpdatePublisher/UpdatePublisher';
import UpdateCategory from '../../components/Update/UpdateCategory/UpdateCategory';
import PageNotFound from '../PageNotFound/PageNotFound';
import UpdateCustomer from '../../components/Update/UpdateCustomer/UpdateCustomer';
import UpdateOrder from '../../components/Update/UpdateOrder/UpdateOrder';
import AddInventory from '../../components/Add/AddInventory/AddInventory';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
export default function UpdateItem(props) {
  const { type, id } = props.match.params; // Lấy giá trị id và type từ đường dẫn URL
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
    if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'update-book') {
      return <UpdateBook id={id} />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'update-author') {
      return <UpdateAuthor id={id} />;
    } else if (
      (role === 'Quản trị viên' || role === 'Quản lý kho') &&
      type === 'update-publisher'
    ) {
      return <UpdatePublisher id={id} />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'update-category') {
      return <UpdateCategory id={id} />;
    } else if (type === 'update-customer') {
      return <UpdateCustomer id={id} />;
    } else if ((role === 'Quản trị viên' || role === 'NV bán hàng') && type === 'update-order') {
      return <UpdateOrder id={id} />;
    } else if ((role === 'Quản trị viên' || role === 'Quản lý kho') && type === 'add-inventory') {
      return <AddInventory id={id} />;
    } else if (role !== '') {
      return <PageNotFound />;
    }
  } else {
    alert('Vui lòng đăng nhập để vào trang này !');
    return <Redirect to="/" />;
  }
}
