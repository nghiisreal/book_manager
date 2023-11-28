/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import './PrintOrder.css';
// Thư viện để lấy name từ token api
import jwt_decode from 'jwt-decode';
export default function PrintOrder(props) {
  const history = useHistory();
  const params = useParams();
  const [user, setUser] = useState('');
  const [state, setState] = useState({
    order: [],
    orderItems: []
  });
  useEffect(() => {
    getOrderId();
  }, [params.id]);
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      const name = decodedToken.name; // lấy name từ token api
      setUser(name); // Lưu name vào state
    }
  }, []);
  const handlePrint = (e) => {
    e.preventDefault();
    window.print();
  };
  const getOrderId = async () => {
    try {
      const id = params.id;
      const result = await axios.get(
        `https://localhost:7208/api/Orders/GetOrderWithOrderItems/${id}`
      );
      setState({
        order: result.data,
        orderItems: result.data.orderItems
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };
  console.log(state);

  return (
    <div className="container pt-3">
      <div className="d-flex justify-content-center">
        <div></div>
        <div>
          <div className="card text-left" style={{ maxWidth: '40rem' }}>
            <div className="card-body">
              <h4 className="card-title text-center">
                <b>NHÀ SÁCH TL</b>
              </h4>
              <hr />
              <h2 className="card-title text-center" style={{ color: 'blue' }}>
                HÓA ĐƠN BÁN HÀNG
              </h2>
              <h5 className="text-center mb-4">
                <u>Mã hóa đơn: {state.order.order_id}</u>
              </h5>
              <div className="infor-order">
                <div className="row">
                  <div className="col-8">
                    <p className="card-text">
                      <b>Thông tin khách hàng:</b>
                    </p>
                    <p className="card-text">
                      <b>Họ tên: </b>
                      {state.order.customer_name}
                    </p>
                    <p className="card-text">
                      <b>Số điện thoại: </b>
                      {state.order.customer_phone}
                    </p>
                    <p className="card-text">
                      <b>Địa chỉ giao hàng: </b>
                      {state.order.customer_address}
                    </p>
                  </div>
                  <div className="col-4">
                    <img src="/img/orderLogo.png" alt="order_logo" style={{ width: '10rem' }} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="card-text">
                    <b>Sản phẩm đặt mua: </b>
                  </p>
                  {state.orderItems.map((item, index) => {
                    return (
                      <p className="card-text" key={index}>
                        + {item.bookTitle}, <span>Số lượng: {item.quantity},</span>{' '}
                        <span>
                          Giá tiền:{' '}
                          {item.price.toLocaleString('it-IT', {
                            style: 'currency',
                            currency: 'VND'
                          })}
                        </span>
                      </p>
                    );
                  })}
                </div>
                <hr />
                <div className="row">
                  <div className="col-6">
                    <h5 className="card-text mb-3">
                      <b>Tổng cộng: </b>
                      <span className="text-danger">
                        {state.order.total_price?.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </span>
                    </h5>
                  </div>
                  <div className="col-6 mb-3">
                    <p>Người cấp hóa đơn</p>
                    <h5>{user}</h5>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handlePrint} className="print__btn">
              <i className="fa fa-print print__icon"></i>
            </button>
          </div>
          <button
            type="button"
            className="btn btn-dark me-3"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={(e) => {
              history.push('/home/orders');
            }}>
            <i className="fa fa-home"></i>
          </button>
        </div>
        <div></div>
      </div>
    </div>
  );
}
