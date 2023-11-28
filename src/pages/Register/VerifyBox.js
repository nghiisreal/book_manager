/* eslint-disable prettier/prettier */
/* eslint-disable space-before-function-paren */
import React, { useState } from 'react'
import './Register.css'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

export default function VerifyBox() {
  const [state, setState] = useState()
  const handleInputChange = (e) => {
    const value = e.target.value
    // console.log(value)
    setState(value)
  }
  const handleVerifyAccount = async (e) => {
    try {
      await axios.post(
        `https://localhost:7208/api/Users/VerifyEmailUser/verify?emailToken=${state}`
      )
      alert('Xác nhận tài khoản thành công!')
    } catch (err) {
      alert(err.response.data)
    }
  }
  // console.log(state)
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card create_card">
            <h2 className="card-title text-center create_h2">Xác nhận tạo tài khoản</h2>
            <p className="text-center px-4 text-danger">
              *Vui lòng kiểm tra email và nhập mã xác nhận vào khung bên dưới để hoàn tất việc đăng
              ký tài khoản
            </p>
            <div className="card-body py-md-3">
              <form onSubmit={handleVerifyAccount}>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control create__input"
                    id="emailToken"
                    name="emailToken"
                    placeholder="Mã xác nhận"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="text-center">
                  <NavLink className="loginn__btn" to="/" onClick={handleVerifyAccount}>
                    Xác nhận tài khoản
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
