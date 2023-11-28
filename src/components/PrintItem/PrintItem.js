/* eslint-disable react/prop-types */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';
import PageNotFound from '../../pages/PageNotFound/PageNotFound';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';
import PrintOrder from '../Home/Order/PrintOrder';

export default function PrintItem(props) {
  const { type, id } = props.match.params; // Lấy giá trị id và type từ đường dẫn URL
  if (localStorage.getItem('token')) {
    // dựa vào giá trị của type để render component tương ứng
    if (type === 'print-order') {
      return <PrintOrder id={id} />;
    } else {
      return <PageNotFound />;
    }
  } else {
    alert('Vui lòng đăng nhập để vào trang này !');
    return <Redirect to="/" />;
  }
}
