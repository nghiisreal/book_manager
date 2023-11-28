/* eslint-disable camelcase */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from '../../Pagination/Pagination';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
import './Order.css';
import { saveAs } from 'file-saver';
function OrderTable(props) {
  const [state, setState] = useState({
    orderList: [],
    orderItems: [],
    currentPage: 1,
    totalPages: 1
  });
  const [orderSearch, setOrderSearch] = useState([]);
  const [orderStatistic, setOrderStatistic] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      const role = decodedToken.role; // lấy role từ token api
      setRole(role); // Lưu role vào state
    }
  }, []);
  useEffect(() => {
    getOrderList(state.currentPage, setState);
  }, [state.currentPage, searchResult]);
  useEffect(() => {}, [orderSearch]);
  const getOrderList = async (page) => {
    try {
      let result = null;
      if (searchResult === '') {
        const result = await axios.get(
          `https://localhost:7208/api/Orders/GetOrdersAll?page=${page}`
        );

        setState({
          ...state,
          orderList: result.data.result,
          orderItems: result.data.result.orderItems,
          currentPage: result.data.currentPage,
          totalPages: result.data.totalPages
        });
      } else {
        result = await axios.get('https://localhost:7208/api/Orders/GetOrdersAll?page=0');
        setOrderSearch(result.data.result);
        setState({ ...state, currentPage: 1, totalPages: 1 });
      }
      result = await axios.get('https://localhost:7208/api/Orders/GetOrdersAll?page=0');
      setOrderStatistic(result.data.result);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handlePageChange = (pageNumber) => {
    getOrderList(pageNumber, setState);
  };
  // Xóa đơn
  const delOrder = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Orders/Deleteid/${id}`);
      alert(result.data);
      await getOrderList(state.currentPage, setState);
      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      console.log(err.response.data);
    }
  };
  // Hủy đơn
  const cancelOrder = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Orders/Cancelid/${id}`);
      alert(result.data);
      await getOrderList(state.currentPage, setState);
      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      alert(err.response.data);
    }
  };
  const handleInputPaymentChange = async (orderId, payment) => {
    // Gọi API để cập nhật trạng thái của order có ID là orderId
    try {
      await axios.put(`https://localhost:7208/api/Payment/UpdatePayment/${orderId}`, {
        payment
      });

      // Sau khi cập nhật xong, cập nhật lại state để hiển thị thanh toán mới
      setState((prevState) => {
        const updatedOrderList = prevState.orderList.map((order) => {
          if (order.order_id === orderId) {
            return { ...order, payment };
          }
          return order;
        });
        return {
          ...prevState,
          orderList: updatedOrderList
        };
      });
    } catch (err) {
      alert(err.response.data);
    }
  };
  const handleInputStatusChange = async (orderId, status) => {
    // Gọi API để cập nhật trạng thái của order có ID là orderId
    try {
      await axios.put(`https://localhost:7208/api/Status/UpdateStatus/${orderId}`, {
        status
      });

      // Sau khi cập nhật xong, cập nhật lại state để hiển thị trạng thái mới
      setState((prevState) => {
        const updatedOrderList = prevState.orderList.map((order) => {
          if (order.order_id === orderId) {
            return { ...order, status };
          }
          return order;
        });

        return {
          ...prevState,
          orderList: updatedOrderList
        };
      });
    } catch (err) {
      alert(err.response.data);
    }
  };
  const exportExcel = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(
        'https://localhost:7208/api/Orders/OrdersToExcel',
        { responseType: 'blob' } // Kiểu blob: Binary Large Object để chưa những dữ liệu như văn bảng, hình ảnh... với dung lượng lớn
      );
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'Orders.xlsx');
    } catch (err) {
      alert('Lỗi xuất file');
    }
  };
  const renderOrders = () => {
    if (searchResult === '') {
      return state.orderList.map((order, index) => {
        // console.log(order.order_id);
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>
                <NavLink
                  className="navbar-brand style_link"
                  to={`/home/orders/print/print-order/${order.order_id}`}>
                  {order.order_id}
                </NavLink>
              </td>
              <td>{order.customer_name}</td>
              <td>{order.customer_phone}</td>
              <td>
                {order.total_price.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </td>
              {order.payment === 'Đã thanh toán' ? (
                <td style={{ backgroundColor: '#f4b5ff' }}>{order.payment}</td>
              ) : (
                <td className="select">
                  <select
                    id="orderPayment-select"
                    onChange={(e) => handleInputPaymentChange(order.order_id, e.target.value)}
                    name="payment"
                    required
                    value={order.payment}
                    style={{ backgroundColor: '#bfbfbf' }}>
                    <option value="Chưa thanh toán">Chưa thanh toán</option>
                    <option value="Đã thanh toán">Đã thanh toán</option>
                  </select>
                </td>
              )}
              {order.status === 'Đã duyệt đơn' ? (
                <td className="select">
                  <select
                    id="orderStatus-select"
                    onChange={(e) => handleInputStatusChange(order.order_id, e.target.value)}
                    name="status"
                    required
                    value={order.status}
                    style={{ backgroundColor: '#e3ffa3' }}>
                    <option value="Đã duyệt đơn" disabled>
                      Đã duyệt đơn
                    </option>
                    <option value="Đã nhận hàng">Đã nhận hàng</option>
                    <option value="Không nhận hàng">Không nhận hàng</option>
                  </select>
                </td>
              ) : order.status === 'Đang xử lý' ? (
                <td className="select">
                  <select
                    id="orderStatus-select"
                    onChange={(e) => handleInputStatusChange(order.order_id, e.target.value)}
                    name="status"
                    required
                    value={order.status}
                    style={{ backgroundColor: '#bfbfbf' }}>
                    <option value="Đang xử lý" disabled>
                      Đang xử lý
                    </option>
                    <option value="Đã duyệt đơn">Đã duyệt đơn</option>
                  </select>
                </td>
              ) : order.status === 'Đã nhận hàng' ? (
                <td
                  style={{ backgroundColor: '#87bf73' }}
                  title={
                    order.receive_date.substring(8, 10) +
                    `-${order.receive_date.substring(5, 7)}` +
                    `-${order.receive_date.substring(0, 4)}` +
                    ` - ${order.receive_date.substring(11, 16)}`
                  }>
                  {order.status}
                </td>
              ) : order.status === 'Đang giao hàng' ? (
                <td style={{ backgroundColor: '#bcf58e' }}>{order.status}</td>
              ) : (
                <td style={{ backgroundColor: '#942529', color: 'white' }}>{order.status}</td>
              )}
              <td>
                {order.order_date.substring(8, 10)}-{order.order_date.substring(5, 7)}-
                {order.order_date.substring(0, 4)} - {'\n'}
                {order.order_date.substring(11, 16)}
              </td>
              <td>
              <div>
                <button
                  className="btn btn-primary me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightOrder${index}`}
                  aria-controls="offcanvasRightOrder">
                  Xem Chi Tiết
                </button>
                </div>
                <button
                  className="btn btn-dark me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightOrderCancel${index}`}
                  aria-controls="offcanvasRightCancel"
                  onClick={() => {
                    cancelOrder(order.order_id);
                  }}>
                  Hủy
                </button>
                {role === 'Quản trị viên' ? (
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightOrderDelete${index}`}
                    aria-controls="offcanvasRightDelete"
                    onClick={() => {
                      delOrder(order.order_id);
                    }}>
                    Xóa
                  </button>
                ) : (
                  <></>
                )}
              </td>
            </tr>
            {/* offcanvas */}
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id={`offcanvasRightOrder${index}`}
              aria-labelledby="offcanvasRightLabel"
              style={{ minWidth: '30vw' }}>
              <div className="offcanvas-header">
                <h4
                  id="offcanvasRightLabel"
                  style={{ height: '50px', lineHeight: '50px', marginBottom: 0 }}>
                  Chi Tiết Đơn Hàng
                </h4>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"></button>
              </div>
              <div
                style={{
                  borderBottom: '1px solid #cccccc',
                  paddingTop: '0px'
                }}></div>
              <div className="offcanvas-body">
                <div className="text-start">
                  <div>
                    <span>
                      <b>Mã đơn hàng: </b>
                    </span>
                    <span>
                      {' '}
                      <NavLink
                        className="navbar-brand style_link"
                        to={`/home/orders/print/print-order/${order.order_id}`}>
                        {order.order_id}
                      </NavLink>
                    </span>
                  </div>
                  <div>
                    <span>
                      <b>Tên khách hàng: </b>
                    </span>
                    <span> {order.customer_name}</span>
                  </div>
                  <div>
                    <span>
                      <b>Số điện thoại: </b>
                    </span>
                    <span>{order.customer_phone}</span>
                  </div>
                  <div>
                    <span>
                      <b>Địa chỉ: </b>
                    </span>
                    <span>{order.customer_address}</span>
                  </div>
                  <div>
                    <span>
                      <b>Email: </b>
                    </span>
                    <span>{order.customer_email}</span>
                  </div>
                  <div>
                    <span>
                      <b>Đặt hàng: </b>
                    </span>
                    {order.orderItems.map((item, index) => {
                      return (
                        <li key={index}>
                          {item.bookTitle} - {''}
                          <span>{item.quantity} quyển</span>
                        </li>
                      );
                    })}
                  </div>
                  <div>
                    <span>
                      <b>Ngày đặt hàng: </b>
                    </span>
                    <span>
                      {order.order_date.substring(8, 10)}-{order.order_date.substring(5, 7)}-
                      {order.order_date.substring(0, 4)} - {''}
                      {order.order_date.substring(11, 16)}
                    </span>
                  </div>
                  <div>
                    <span>
                      <b>Tổng tiền: </b>
                    </span>
                    <span style={{ textAlign: 'justify' }}>
                      {order.total_price.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </span>
                  </div>
                  <div>
                    <span>
                      <b>Thanh toán: </b>
                    </span>
                    <span style={{ textAlign: 'justify' }}>{order.payment}</span>
                  </div>
                  <div>
                    <span>
                      <b>Tình trạng đơn hàng: </b>
                    </span>
                    <span style={{ textAlign: 'justify' }}>{order.status}</span>
                  </div>
                  <div>
                    <span>
                      <b>Ngày giao / nhận hàng: </b>
                    </span>
                    {order.receive_date === '0001-01-01T00:00:00' ? (
                      <span>Chưa cập nhật</span>
                    ) : (
                      <span style={{ textAlign: 'justify' }}>
                        {' '}
                        {order.receive_date.substring(8, 10)}-{order.receive_date.substring(5, 7)}-
                        {order.receive_date.substring(0, 4)} - {''}
                        {order.receive_date.substring(11, 16)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-end">
                {order.status === 'Đang xử lý' ? (
                  <NavLink
                    className="navbar-brand"
                    to={`/home/orders/update-order/${order.order_id}`}>
                    <button type="button" className="btn btn-primary me-3">
                      Sửa
                    </button>
                  </NavLink>
                ) : (
                  <></>
                )}

                <button
                  className="btn btn-dark me-3"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightOrderCancel${index}`}
                  aria-controls="offcanvasRightCancel"
                  onClick={() => {
                    cancelOrder(order.order_id);
                  }}>
                  Hủy
                </button>
                {role === 'Quản trị viên' ? (
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightOrderDelete${index}`}
                    aria-controls="offcanvasRightDelete"
                    onClick={() => {
                      delOrder(order.order_id);
                    }}>
                    Xóa
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Fragment>
        );
      });
    } else {
      return orderSearch
        .filter((name) => name.customer_name.toLowerCase().includes(searchResult.toLowerCase()))
        .map((order, index) => {
          return (
            <Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>
                  <NavLink
                    className="navbar-brand style_link"
                    to={`/home/orders/print-order/${order.order_id}`}>
                    {order.order_id}
                  </NavLink>
                </td>
                <td>{order.customer_name}</td>
                <td>{order.customer_phone}</td>
                <td>
                  {order.total_price.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </td>
                {order.payment === 'Đã thanh toán' ? (
                  <td style={{ backgroundColor: '#f4b5ff' }}>{order.payment}</td>
                ) : (
                  <td className="select">
                    <select
                      id="orderPayment-select"
                      onChange={(e) => handleInputPaymentChange(order.order_id, e.target.value)}
                      name="payment"
                      required
                      value={order.payment}
                      style={{ backgroundColor: '#bfbfbf' }}>
                      <option value="Chưa thanh toán">Chưa thanh toán</option>
                      <option value="Đã thanh toán">Đã thanh toán</option>
                    </select>
                  </td>
                )}

                {order.status === 'Đã duyệt đơn' ? (
                  <td className="select">
                    <select
                      id="orderStatus-select"
                      onChange={(e) => handleInputStatusChange(order.order_id, e.target.value)}
                      name="status"
                      required
                      value={order.status}
                      style={{ backgroundColor: '#e3ffa3' }}>
                      <option value="Đã duyệt đơn" disabled>
                        Đã duyệt đơn
                      </option>
                      <option value="Đã nhận hàng">Đã nhận hàng</option>
                      <option value="Không nhận hàng">Không nhận hàng</option>
                    </select>
                  </td>
                ) : order.status === 'Đang xử lý' ? (
                  <td className="select">
                    <select
                      id="orderStatus-select"
                      onChange={(e) => handleInputStatusChange(order.order_id, e.target.value)}
                      name="status"
                      required
                      value={order.status}
                      style={{ backgroundColor: '#bfbfbf' }}>
                      <option value="Đang xử lý" disabled>
                        Đang xử lý
                      </option>
                      <option value="Đã duyệt đơn">Đã duyệt đơn</option>
                    </select>
                  </td>
                ) : order.status === 'Đã nhận hàng' ? (
                  <td
                    style={{ backgroundColor: '#87bf73' }}
                    title={
                      order.receive_date.substring(8, 10) +
                      `-${order.receive_date.substring(5, 7)}` +
                      `-${order.receive_date.substring(0, 4)}` +
                      ` - ${order.receive_date.substring(11, 16)}`
                    }>
                    {order.status}
                  </td>
                ) : order.status === 'Đang giao hàng' ? (
                  <td style={{ backgroundColor: '#bcf58e' }}>{order.status}</td>
                ) : (
                  <td style={{ backgroundColor: '#942529', color: 'white' }}>{order.status}</td>
                )}
                <td>
                  {order.order_date.substring(8, 10)}-{order.order_date.substring(5, 7)}-
                  {order.order_date.substring(0, 4)} - {'\n'}
                  {order.order_date.substring(11, 16)}
                </td>
                <td>
                  <div>
                  <button
                    className="btn btn-primary me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightOrder${index}`}
                    aria-controls="offcanvasRightOrder">
                    Xem Chi Tiết
                  </button>
                  </div>
                  <button
                    className="btn btn-dark me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightOrderCancel${index}`}
                    aria-controls="offcanvasRightCancel"
                    onClick={() => {
                      cancelOrder(order.order_id);
                    }}>
                    Hủy
                  </button>
                  {role === 'Quản trị viên' ? (
                    <button
                      className="btn btn-danger"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target={`#offcanvasRightOrderDelete${index}`}
                      aria-controls="offcanvasRightDelete"
                      onClick={() => {
                        delOrder(order.order_id);
                      }}>
                      Xóa
                    </button>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
              {/* offcanvas */}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id={`offcanvasRightOrder${index}`}
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                  <h4
                    id="offcanvasRightLabel"
                    style={{
                      height: '50px',
                      lineHeight: '50px',
                      marginBottom: 0
                    }}>
                    Chi Tiết Đơn Hàng
                  </h4>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div
                  style={{
                    borderBottom: '1px solid #cccccc',
                    paddingTop: '0px'
                  }}></div>
                <div className="offcanvas-body">
                  <div className="text-start">
                    <div>
                      <span>
                        <b>Mã đơn hàng: </b>
                      </span>
                      <span>
                        {' '}
                        <NavLink
                          className="navbar-brand style_link"
                          to={`/home/orders/print/print-order/${order.order_id}`}>
                          {order.order_id}
                        </NavLink>
                      </span>
                    </div>
                    <div>
                      <span>
                        <b>Tên khách hàng: </b>
                      </span>
                      <span> {order.customer_name}</span>
                    </div>
                    <div>
                      <span>
                        <b>Số điện thoại: </b>
                      </span>
                      <span>{order.customer_phone}</span>
                    </div>
                    <div>
                      <span>
                        <b>Địa chỉ: </b>
                      </span>
                      <span>{order.customer_address}</span>
                    </div>
                    <div>
                      <span>
                        <b>Email: </b>
                      </span>
                      <span>{order.customer_email}</span>
                    </div>
                    <div>
                      <span>
                        <b>Đặt hàng: </b>
                      </span>
                      {order.orderItems.map((item, index) => {
                        return (
                          <li key={index}>
                            {item.bookTitle} X
                            <span>
                              {item.quantity} - {''}quyển
                            </span>
                          </li>
                        );
                      })}
                    </div>
                    <div>
                      <span>
                        <b>Ngày đặt hàng: </b>
                      </span>
                      <span>
                        {order.order_date.substring(8, 10)}-{order.order_date.substring(5, 7)}-
                        {order.order_date.substring(0, 4)} - {''}
                        {order.order_date.substring(11, 16)}
                      </span>
                    </div>
                    <div>
                      <span>
                        <b>Tổng tiền: </b>
                      </span>
                      <span style={{ textAlign: 'justify' }}>
                        {order.total_price.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </span>
                    </div>
                    <div>
                      <span>
                        <b>Thanh toán: </b>
                      </span>
                      <span style={{ textAlign: 'justify' }}>{order.payment}</span>
                    </div>
                    <div>
                      <span>
                        <b>Tình trạng đơn hàng: </b>
                      </span>
                      <span style={{ textAlign: 'justify' }}>{order.status}</span>
                    </div>
                    <div>
                      <span>
                        <b>Ngày giao / nhận hàng: </b>
                      </span>
                      {order.receive_date === '0001-01-01T00:00:00' ? (
                        <span>Chưa cập nhật</span>
                      ) : (
                        <span style={{ textAlign: 'justify' }}>
                          {' '}
                          {order.receive_date.substring(8, 10)}-{order.receive_date.substring(5, 7)}
                          -{order.receive_date.substring(0, 4)} - {''}
                          {order.receive_date.substring(11, 16)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  {order.status === 'Đang xử lý' ? (
                    <NavLink
                      className="navbar-brand"
                      to={`/home/orders/update-order/${order.order_id}`}>
                      <button type="button" className="btn btn-primary me-3">
                        Sửa
                      </button>
                    </NavLink>
                  ) : (
                    <></>
                  )}
                  <button
                    className="btn btn-dark me-3"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightOrderCancel${index}`}
                    aria-controls="offcanvasRightCancel"
                    onClick={() => {
                      cancelOrder(order.order_id);
                    }}>
                    Hủy
                  </button>
                  {role === 'Quản trị viên' ? (
                    <button
                      className="btn btn-danger"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target={`#offcanvasRightOrderDelete${index}`}
                      aria-controls="offcanvasRightDelete"
                      onClick={() => {
                        delOrder(order.order_id);
                      }}>
                      Xóa
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </Fragment>
          );
        });
    }
  };
  return (
    <div className="container mt-1">
      <div className="mb-1">
        {searchResult === '' ? (
          <p className="d-flex justify-content-start mb-3">
            <b>
              Có: <span>{orderStatistic.length} đơn hàng</span>
            </b>
          </p>
        ) : (
          <p hidden></p>
        )}
        <form className="d-flex">
          <input
            className="form-control"
            type="search"
            placeholder="Tìm kiếm..."
            aria-label="Search"
            style={{ height: '50px' }}
            onChange={(e) => setSearchResult(e.target.value)}
          />
        </form>
      </div>
      <div className="d-flex justify-content-end mt-1 me-2">
        <NavLink className="navbar-brand" to="/home/orders/add-order">
          <button className="btn btn-dark text-light my-0">
            <i className="fa fa-plus" aria-hidden="true"></i> Thêm
          </button>
        </NavLink>
        <button
          className="btn btn-info text-light ms-2 mb-0"
          onClick={() => window.location.reload()}
          style={{ maxHeight: '38px', marginTop: '0px' }}>
          <i className="fa fa-sync"></i>
        </button>
        <button
          className="btn btn-light ms-2 mb-0"
          onClick={exportExcel}
          style={{ maxHeight: '38px', marginTop: '0px', border: '1px solid #3d3d3d' }}>
          <i className="fa fa-file-excel text-success"></i>
        </button>
      </div>
      <div
        style={{
          width: '100%',
          maxHeight: '850px',
          overflow: 'auto',
          marginTop: '10px',
          marginBottom: '8px'
        }}>
        <table className="table table-bordered" style={{ verticalAlign: 'middle' }}>
          <thead>
            <tr className="table-primary">
              <th scope="col">#</th>
              <th scope="col">Mã đơn hàng</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Thanh toán</th>
              <th scope="col">Tình trạng đơn hàng</th>
              <th scope="col">Ngày đặt hàng</th>
              <th scope="col" style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody className="table-light">{renderOrders()}</tbody>
        </table>
      </div>

      {renderOrders().length > 0 ? (
        <>
          <Pagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      ) : (
        <Fragment />
      )}
    </div>
  );
}
export default React.memo(OrderTable);
