/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';
import Header from '../../components/Header/Header';
import { Redirect } from 'react-router-dom';
// import TabActive from '../../components/Home/Tab/TabActive';
import TabList from '../../components/Home/Tab/Tab';

// import Footer from '../../components/Home/Footer/Footer';

export default function Home() {
  if (localStorage.getItem('token')) {
    return (
      <div>
        <Header />
        <TabList />
        {/* <Footer /> */}
      </div>
    );
  } else {
    alert('Vui lòng đăng nhập để vào trang này !');
    return <Redirect to="/" />;
  }
}
