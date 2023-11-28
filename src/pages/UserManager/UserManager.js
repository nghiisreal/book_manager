/* eslint-disable camelcase */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../../components/Header/Header';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
import './UserManager.css';
import axios from 'axios';
import PageNotFound from '../PageNotFound/PageNotFound';
export default function UserManager() {
  const [role, setRole] = useState('Quản trị viên');
  const [state, setState] = useState({
    roleList: []
  });
  const [userRole, setUserRole] = useState('');
  // useEffect chạy duy nhất một lần sau khi thành phần được render lần đầu tiên để lấy role từ token
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      const role = decodedToken.role; // lấy role từ token api
      setUserRole(role); // Lưu role vào state
    }
  }, []);
  const handleRoleChange = (e) => {
    e.preventDefault();
    const newRole = e.target.value;
    setRole(newRole);
    getRole(newRole);
  };
  // console.log(state);
  // useEffect sẽ được kích hoạt mỗi khi giá trị của role thay đổi.
  // Được sử dụng để gọi hàm getRole(role) để lấy danh sách các vai trò dựa trên role mới nhất và cập nhật state roleList
  useEffect(() => {
    getRole(role);
  }, [role]);
  const getRole = async (roleValue) => {
    try {
      const result = await axios.get(`https://localhost:7208/api/Users/GetRole/${roleValue}`);
      setState({ roleList: result.data });
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handleRoleInput = async (userId, role) => {
    // Gọi API để cập nhật trạng thái của order có ID là orderId
    try {
      await axios.put(`https://localhost:7208/api/Users/ChangeRole/${userId}`, {
        role
      });

      // Sau khi cập nhật xong, cập nhật lại state để hiển thị trạng thái mới
      const updatedUserList = state.roleList.map((user) => {
        if (user.userId === userId) {
          return { ...user, role };
        } else {
          return user;
        }
      });
      setState((prevState) => ({
        ...prevState,
        roleList: updatedUserList
      }));
      window.location.reload();
    } catch (err) {
      alert(err.response.data);
    }
  };
  const delUser = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Users/DeleteUserId/${id}`);
      alert(result.data);
      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const renderRole = () => {
    return state.roleList.map((item, index) => {
      return (
        <div className="col-12 col-md-6 col-xl-3" key={index}>
          <div className="card mt-3" style={{ width: '18rem' }}>
            <img src="./img/avatar.png" className="card-img-top p-3" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p className="card-text mt-1">Tài khoản: {item.username}</p>
              <p className="card-text mb-1">Email:</p>
              <p className="card-text mt-0">{item.user_email}</p>
              {item.isEmail_Confirmed === true ? (
                <p className="card-text">
                  <i className="fa fa-circle text-success"></i>
                  {''} Hoạt động
                </p>
              ) : (
                <p className="card-text">
                  <i className="fa fa-circle text-danger"></i>
                  {''} Chưa xác nhận email
                </p>
              )}
              <div className="row">
                <div className="col-9">
                  {userRole === role && role === 'Quản trị viên' ? (
                    <select
                      id="orderStatus-select"
                      onChange={(e) => handleRoleInput(item.userId, e.target.value)}
                      name="status"
                      required
                      value={item.role}
                      disabled
                      style={{ backgroundColor: '#bfbfbf', color: 'black' }}>
                      <option value="Quản trị viên">Quản trị viên</option>
                      <option value="NV bán hàng">NV bán hàng</option>
                      <option value="Quản lý kho">Quản lý kho</option>
                      <option value="Người vận chuyển">Người vận chuyển</option>
                    </select>
                  ) : (
                    <select
                      id="orderStatus-select"
                      onChange={(e) => handleRoleInput(item.userId, e.target.value)}
                      name="status"
                      required
                      value={item.role}
                      style={{ backgroundColor: '#bfbfbf' }}>
                      <option value="Quản trị viên">Quản trị viên</option>
                      <option value="NV bán hàng">NV bán hàng</option>
                      <option value="Quản lý kho">Quản lý kho</option>
                      <option value="Người vận chuyển">Người vận chuyển</option>
                    </select>
                  )}
                </div>
                <div className="col-3">
                  {userRole === role && role === 'Quản trị viên' ? (
                    <></>
                  ) : (
                    <button
                      className="btn btn-danger mt-0"
                      onClick={() => {
                        delUser(item.userId);
                      }}
                      role="button">
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };
  if (localStorage.getItem('token')) {
    return (
      <div>
        <Header />
        {userRole === 'Quản trị viên' ? (
          <div className="container">
            <ul className="nav nav-tabs mt-4" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active button_um"
                  id="admin-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#admin-tab-pane"
                  type="radio"
                  role="tab"
                  aria-controls="admin-tab-pane"
                  aria-selected="true"
                  value="Quản trị viên"
                  onClick={handleRoleChange}>
                  Quản trị viên
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link button_um"
                  id="sales-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#sales-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="sales-tab-pane"
                  aria-selected="false"
                  value="NV bán hàng"
                  onClick={handleRoleChange}>
                  NV bán hàng
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link button_um"
                  id="stock-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#stock-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="stock-tab-pane"
                  aria-selected="false"
                  value="Quản lý kho"
                  onClick={handleRoleChange}>
                  Quản lý kho
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link button_um"
                  id="ship-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#ship-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="ship-tab-pane"
                  aria-selected="false"
                  value="Người vận chuyển"
                  onClick={handleRoleChange}>
                  Người vận chuyển
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="admin-tab-pane"
                role="tabpanel"
                aria-labelledby="admin-tab"
                tabIndex="0">
                <div className="container">
                  <div className="row">{renderRole()}</div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="sales-tab-pane"
                role="tabpanel"
                aria-labelledby="sales-tab"
                tabIndex="0">
                <div className="container">
                  <div className="row">{renderRole()}</div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="stock-tab-pane"
                role="tabpanel"
                aria-labelledby="stock-tab"
                tabIndex="0">
                <div className="container">
                  <div className="row">{renderRole()}</div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="ship-tab-pane"
                role="tabpanel"
                aria-labelledby="ship-tab"
                tabIndex="0">
                <div className="container">
                  <div className="row">{renderRole()}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PageNotFound />
        )}
      </div>
    );
  } else {
    alert('Vui lòng đăng nhập để vào trang này !');
    return <Redirect to="/" />;
  }
}
