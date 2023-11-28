/* eslint-disable semi */
/* eslint-disable prettier/prettier */
/* eslint-disable space-before-function-paren */
import React, { useState } from 'react';
import './Register.css';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';
export default function Register(props) {
  const history = useHistory();
  const [state, setState] = useState({
    name: '',
    username: '',
    user_email: '',
    password: '',
    role: 'Quản trị viên'
  });
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [notice, setNotice] = useState('');
  const [role, setRole] = useState('Quản trị viên');
  const [showPassword, setShowPassword] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name + value);
    setState({
      ...state,
      [name]: value
    });
  };
  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    // console.log(value);
    setConfirmPassword(value);
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    // console.log(value);
    setPassword(value);
  };
  const passwordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const handleRoleChange = (e) => {
    e.preventDefault();
    const newRole = e.target.value;
    setRole(newRole);
    setState({ ...state, role: newRole });
  };
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9]+$/; // regex tiếng việt
    // console.log(regexString.test(state.name));
    if (!state.name || isEmpty(state.name)) {
      mess.name = 'Vui lòng nhập họ tên người dùng';
    }
    if (!regexString.test(state.name.trim())) {
      mess.name = 'Họ tên người dùng không được chứa ký tự đặc biệt hoặc số !';
    }
    if (state.name.length < 7) {
      mess.name = 'Họ tên người dùng không được nhỏ hơn 7 ký tự';
    }

    const regexUserName = /^[a-zA-Z0-9\u00C0-\u1EF9_]+$/; // regrex không dấu, có số, có dấu "_" và không khoảng trắng
    if (!state.username || isEmpty(state.username)) {
      mess.username = 'Vui lòng nhập tên đăng nhập';
    }
    if (!regexUserName.test(state.username.trim())) {
      mess.username = 'Tên đăng nhập chỉ cho phép chứa ký tự không dấu, ký tự "_" và số !';
    }
    if (state.username.length < 6) {
      mess.username = 'Tên đăng nhập không được nhỏ hơn 6 ký tự';
    }

    const regexPassword = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@#$%^&+=]{7,}$/;
    // ^ đánh dấu bắt đầu của chuỗi.
    // (?=.*[A-Z]) yêu cầu ít nhất một ký tự viết hoa.
    // (?=.*\d) yêu cầu ít nhất một chữ số.
    // [a-zA-Z\d@#$%^&+=]{7,} mật khẩu 7 ký tự trở lên, A-Z, ký tự đặc biệt và chữ số.
    // $ đánh dấu kết thúc của chuỗi.
    if (confirmPassword === password) {
      state.password = password;
    }
    if (!state.password || isEmpty(password)) {
      mess.password = 'Vui lòng nhập mật khẩu';
    } else {
      if (!regexPassword.test(password)) {
        mess.password = 'Yêu cầu có ít nhất một ký tự viết hoa và một ký tự số !';
        if (password.length < 7) {
          mess.password = 'Mật khẩu phải có ít nhất 7 ký tự';
        }
      }
    }
    // console.log(password + confirmPassword);
    if (password !== confirmPassword) {
      mess.cf_password = 'Mật khẩu không trùng khớp';
    }

    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!state.user_email || isEmpty(state.user_email)) {
      mess.user_email = 'Vui lòng nhập email';
    }
    if (!regexEmail.test(state.user_email.trim())) {
      mess.user_email = 'Không đúng định dạng email';
    }
    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
      // if (confirmPassword === password) {
      //   state.password = password;
      // }
      return true;
    }
    try {
      history.push('/register/verify-box');
      await axios.post('https://localhost:7208/api/Users/CreateNewUser/register', {
        name: state.name,
        username: state.username,
        user_email: state.user_email,
        password: state.password,
        role: state.role
      });
    } catch (err) {
      alert(err.response.data);
    }
  };
  // console.log(state);
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card create_card">
            <h2 className="card-title text-center create_h2">Đăng ký tài khoản</h2>
            <div className="card-body py-md-3">
              <form onSubmit={handleCreateAccount}>
                <p className="text-danger">{notice.name}</p>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control create__input"
                    id="name"
                    name="name"
                    placeholder="Họ tên"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-danger">{notice.username}</p>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control create__input"
                    id="username"
                    name="username"
                    placeholder="Tên đăng nhập"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-danger">{notice.user_email}</p>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control create__input"
                    id="user_email"
                    name="user_email"
                    placeholder="Email"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-danger">{notice.password}</p>
                <div className="row">
                  <div className="col-10">
                    <div className="form-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control create__input"
                        id="password"
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <button
                      className="toggle-password-button"
                      onClick={passwordVisibility}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        height: '42px',
                        lineHeight: '42px'
                      }}>
                      {' '}
                      {showPassword
                        ? (
                        <i
                          className="fa fa-eye-slash"
                          style={{ fontSize: '1.2rem', color: '#da5767' }}></i>
                          )
                        : (
                        <i
                          className="fa fa-eye"
                          style={{ fontSize: '1.2rem', color: '#da5767' }}></i>
                          )}
                    </button>
                  </div>
                </div>

                <p className="text-danger">{notice.cf_password}</p>
                <div className="row">
                  <div className="col-10">
                    <div className="form-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control create__input"
                        id="confirm-password"
                        name="confirm-password"
                        placeholder="Nhập lại mật khẩu"
                        onChange={handleConfirmPassword}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-2">
                    <button
                      className="toggle-password-button"
                      onClick={passwordVisibility}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        height: '42px',
                        lineHeight: '42px'
                      }}>
                      {' '}
                      {showPassword
                        ? (
                        <i
                          className="fa fa-eye-slash"
                          style={{ fontSize: '1.2rem', color: '#da5767' }}></i>
                          )
                        : (
                        <i
                          className="fa fa-eye"
                          style={{ fontSize: '1.2rem', color: '#da5767' }}></i>
                          )}
                    </button>
                  </div>
                </div>
                <div className="form-group mb-4">
                  <select
                    id="orderStatus-select"
                    name="status"
                    required
                    onChange={handleRoleChange}
                    value={role}
                    style={{ backgroundColor: '#CFE2FF' }}>
                    <option value="Quản trị viên">Quản trị viên</option>
                    <option value="NV bán hàng">NV bán hàng</option>
                    <option value="Quản lý kho">Quản lý kho</option>
                    <option value="Người vận chuyển">Người vận chuyển</option>
                  </select>
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <NavLink className="loginn__btn" to="/">
                    Login
                  </NavLink>
                  <button className="create__btn" onClick={handleCreateAccount}>
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
