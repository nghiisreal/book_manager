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
import { Link, useHistory } from 'react-router-dom';
import HeaderNoLogin from '../../components/Header/HeaderNoLogin';
// import Footer from '../../components/Footer/Footer';
import axios from 'axios';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
import Footer from '../../components/Home/Footer/Footer';
export default function Login() {
  const history = useHistory();
  const [userName, setUserName] = useState('');
  const [passWord, setPassWord] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassWord(e.target.value);
  };
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  const passwordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    handleLogin();
  }, []);
  // console.log(userName, passWord, role);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (role === '') {
        alert('Vui lòng chọn vai trò!');
      }
      const result = await axios.post('https://localhost:7208/api/Users/Login', {
        username: userName,
        password: passWord,
        role
      });
      window.location.replace('/home');
      // Lấy token trả về từ api
      const { token } = result.data;
      const decodedToken = jwt_decode(token);
      const expTime = decodedToken.exp;
      // const expDate = new Date(expTime * 1000); // convert from seconds to milliseconds
      // const formattedExpDate = expDate.toLocaleString(); // format as date time string
      localStorage.setItem('token', token);
      localStorage.setItem('expTime', expTime);
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  // Nếu đã có token rồi thì không cho đăng nhập lại
  if (localStorage.getItem('token')) {
    return <Redirect to="/home" />;
  } else {
    return (
      <div style={{ minHeight: '100vh' }} className="position-relative">
        <HeaderNoLogin />
        <div
          className="container text-center py-3"
          style={{
            boxShadow: '2px 5px 10px 5px #aaaaaa',
            width: '40vw',
            borderRadius: '10px',
            marginTop: '13vh'
          }}>
          <h1>
            <span className="badge bg-success">LOGIN</span>
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="inputUserName" className="form-label">
                <b>Tên đăng nhập</b>
              </label>
              <input
                type="text"
                className="form-control text-center"
                id="inputUserName"
                placeholder="Nhập tên đăng nhập"
                name="userName"
                value={userName}
                required
                onChange={handleUserNameChange}
                style={{
                  width: '50%',
                  margin: 'auto',
                  border: '1px solid #0073ff'
                }}
              />
            </div>
            <div className="mb-3 position-relative">
              <div>
                <label htmlFor="inputPassword" className="form-label">
                  <b>Mật khẩu</b>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control text-center"
                  id="exampleInputPassword1"
                  placeholder="Nhập mật khẩu"
                  name="passWord"
                  value={passWord}
                  required
                  onChange={handlePasswordChange}
                  style={{
                    width: '50%',
                    margin: 'auto',
                    border: '1px solid #0073ff'
                  }}
                />
              </div>
              <div>
                <button
                  className="toggle-password-button"
                  onClick={passwordVisibility}
                  style={{
                    position: 'absolute',
                    right: '5.5rem',
                    top: '61%',
                    transform: 'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}>
                  {' '}
                  {showPassword ? (
                    <i
                      className="fa fa-eye-slash"
                      style={{ fontSize: '1.2rem', color: '#0073ff' }}></i>
                  ) : (
                    <i className="fa fa-eye" style={{ fontSize: '1.2rem', color: '#0073ff' }}></i>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-4 mb-2">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio1"
                  defaultValue="Quản trị viên"
                  onChange={handleRoleChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Quản trị viên
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio2"
                  defaultValue="NV bán hàng"
                  onChange={handleRoleChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  NV bán hàng
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio3"
                  defaultValue="Quản lý kho"
                  onChange={handleRoleChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio3">
                  Quản lý kho
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="inlineRadioOptions"
                  id="inlineRadio4"
                  defaultValue="Người vận chuyển"
                  onChange={handleRoleChange}
                />
                <label className="form-check-label" htmlFor="inlineRadio4">
                  Người vận chuyển
                </label>
              </div>
            </div>
            <div>
              <button type="submit" className="btn btn-primary" onClick={handleLogin}>
                Đăng nhập
              </button>
            </div>
            {/* <Link to="/sign-up">Đăng ký tài khoản</Link> */}
          </form>
        </div>
        {/* <div>
          <Footer />
        </div> */}
      </div>
    );
  }
}
