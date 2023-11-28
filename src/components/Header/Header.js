/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import './Header.css';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
function Header(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');
  const history = useHistory();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      const name = decodedToken.name; // lấy name từ token api
      const role = decodedToken.role; // lấy role từ token api
      setRole(role); // Lưu role vào state
      setUser(name); // Lưu name vào state
    }
  }, []);
  // hàm đăng xuất người dùng
  const logOutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expTime');
    setIsLoggedIn(false);
    // thực hiện trở về trang đăng nhập
    window.location.replace('/');
  };
  const handleLogout = (event) => {
    event.preventDefault(); // ngăn chặn hành động mặc định của sự kiện click
    logOutUser();
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg_navbar">
      <div className="container-fluid">
        <NavLink className="navbar-brand me-5" to="/home">
          <img src="/img/Bms_web_logo.png" style={{ width: '60px', marginBottom: '8px' }}></img>
          <span>
            <b>BS Management</b>
          </span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-2">
            <NavLink activeClassName="activeNavItem" className="nav-link text-light" to="/home">
              Trang chủ <span className="sr-only">(current)</span>
            </NavLink>
            {role === 'Quản trị viên' ? (
              <li className="nav-item">
                <NavLink
                  activeClassName="activeNavItem"
                  className="nav-link text-light"
                  to="/user-manager">
                  Nhân sự
                </NavLink>
              </li>
            ) : (
              <></>
            )}
          </ul>
          <div className="d-flex">
            <div className="text-center">
              <img
                src="/img/avatar.png"
                className="rounded img-fluid img-thumbnail me-2"
                alt="avatar-user"
                style={{
                  maxWidth: '50px',
                  height: '30px',
                  lineHeight: '30px',
                  marginTop: '15px'
                }}
              />
            </div>
            <span className="me-4 text-light">
              {role}: {''}
              <a
                href="#"
                style={{
                  color: 'yellow',
                  height: '60px',
                  lineHeight: '60px',
                  textDecoration: 'none'
                }}>
                {user}
              </a>
            </span>

            {isLoggedIn ? (
              <button className="btn btn-secondary" type="submit" onClick={handleLogout}>
                <i className="fa fa-power-off" aria-hidden="true"></i>
              </button>
            ) : (
              <NavLink to="/"></NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default React.memo(Header); // Ngăn Header load lại
