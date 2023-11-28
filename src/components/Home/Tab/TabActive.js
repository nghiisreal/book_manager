/* eslint-disable react/prop-types */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';
import PageNotFound from '../../../pages/PageNotFound/PageNotFound';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
// import Tab from './Tab';
import CategoryTable from '../Category/CategoryTable';
import AuthorTable from '../Author/AuthorTable';
import PublisherTable from '../Publisher/PublisherTable';
import BookTable from '../Book/BookTable';
import ShippingTable from '../Shipping/ShippingTable';
import OrderTable from '../Order/OrderTable';
import CustomerTable from '../Customer/CustomerTable';

export default function TabActive(props) {
  const types = props.match.params.types;
  if (localStorage.getItem('token')) {
    // dựa vào giá trị của type để render component tương ứng
    if (types === 'categories') {
      return <CategoryTable />;
    } else if (types === 'authors') {
      return <AuthorTable />;
    } else if (types === 'publishers') {
      return <PublisherTable />;
    } else if (types === 'books') {
      return <BookTable />;
    } else if (types === 'customers') {
      return <CustomerTable />;
    } else if (types === 'orders') {
      return <OrderTable />;
    } else if (types === 'shipping') {
      return <ShippingTable />;
    } else {
      return <PageNotFound />;
    }
  } else {
    alert('Vui lòng đăng nhập để vào trang này !');
    return <Redirect to="/" />;
  }
}
