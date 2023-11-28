/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import '../addItem.css';
import Modal from '../../Modal/Modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';

export default function AddCustomer() {
  const history = useHistory();
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notice, setNotice] = useState('');
  const handleChangeCustomerName = (e) => {
    const value = e.target.value;
    console.log(value);
    setCustomerName(value.trim());
  };

  const handleChangeCustomerAddress = (e) => {
    const value = e.target.value;
    setCustomerAddress(value.trim());
  };
  const handleChangeCustomerPhone = (e) => {
    const value = e.target.value;
    setCustomerPhone(value.trim());
  };
  const handleChangeCustomerEmail = (e) => {
    const value = e.target.value;
    setCustomerEmail(value.trim());
  };
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9]+$/; // regex tiếng việt
    // console.log(regexString.test(customerName));
    if (isEmpty(customerName)) {
      mess.customerName = 'Vui lòng nhập tên khách hàng';
    }
    if (!regexString.test(customerName.trim())) {
      mess.customerName = 'Tên khách hàng không được chứa ký tự đặc biệt hoặc số !';
    }

    // console.log(regexString.test(customerName.trim()));
    if (regexString.test(customerName.trim())) {
      if (customerName.length < 4) {
        mess.customerName = 'Tên khách hàng không được nhỏ hơn 4 ký tự';
      }
    }
    const regexEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (isEmpty(customerEmail)) {
      mess.customerEmail = 'Vui lòng nhập email';
    }
    if (!regexEmail.test(customerEmail.trim())) {
      mess.customerEmail = 'Không đúng định dạng email';
    }
    const regexAddress = /^[a-zA-Z0-9\s\u00C0-\u1EF9-,./()]+$/; // regex tiếng việt, số, -  . /, ()
    // console.log(regexString.test(customerAddress));
    if (isEmpty(customerAddress)) {
      mess.customerAddress = 'Vui lòng nhập địa chỉ liên hệ';
    }
    if (!isEmpty(customerAddress)) {
      if (regexAddress.test(customerAddress.trim())) {
        if (customerAddress.length < 10) {
          mess.customerAddress = 'Địa chỉ liên hệ không được nhỏ hơn 10 ký tự';
        }
      }
      if (!regexAddress.test(customerAddress.trim())) {
        mess.customerAddress =
          'Địa chỉ liên hệ không được chứa ký tự đặc biệt ngoài những ký tự sau: "- , . /, ( )"';
      }
    }

    const regexPhone = /^[0-9]{10,11}$/;
    // console.log(regexString.test(customerPhone));
    // console.log(customerPhone);
    if (isEmpty(customerPhone)) {
      mess.customerPhone = 'Vui lòng nhập số điện thoại';
    }
    if (!isEmpty(customerPhone)) {
      if (!regexPhone.test(customerPhone.trim())) {
        mess.customerPhone = 'Điện thoại khách hàng không được nhỏ hơn 10 và lớn hơn 11 số';
      }
    }

    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const addCustomer = async (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return true;
    }
    try {
      await axios.post('https://localhost:7208/api/Customers/CreateNewCustomer', {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_email: customerEmail
      });

      history.push('/home/customers');
    } catch (err) {
      alert(err.response.data);
    }
  };
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span
            className="navbar-brand mb-0 h1"
            style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            Thêm khách hàng
          </span>
        </div>
      </nav>
      <div className="container my-4">
        <div className="card card__style">
          <div className="card-body">
            <h1 className="card-title">
              {' '}
              <i className="fa fa-user-friends me-1"></i>
            </h1>
            <div style={{ borderTop: '2px solid #e7e7e7' }}></div>
            <div>
              <form onSubmit={addCustomer}>
                <div className="mb-3 mt-3 text-start">
                  <label htmlFor="inputNameCustomer" className="form-label">
                    Tên khách hàng<span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputNameCustomer"
                    name="customer_name"
                    aria-describedby="nameCustomerHelp"
                    required
                    placeholder="Nhập tên khách hàng"
                    onChange={handleChangeCustomerName}
                  />

                  <p className="text-danger">{notice.customerName}</p>

                  <label htmlFor="inputPhoneCustomer" className="form-label">
                    Số điện thoại khách hàng
                    <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="inputPhoneCustomer"
                    name="customer_phone"
                    aria-describedby="phoneCustomerHelp"
                    pattern="[0-9]{10,11}"
                    maxLength={11}
                    onKeyDown={(event) => {
                      if (event.ctrlKey && event.key.toLowerCase() === 'a') {
                        // Cho phép người dùng sử dụng tổ hợp phím Ctrl + A để chọn toàn bộ nội dung trong trường nhập liệu
                        return;
                      }
                      if (event.ctrlKey && event.key.toLowerCase() === 'c') {
                        // Cho phép người dùng sử dụng tổ hợp phím Ctrl + C
                        return;
                      }
                      if (event.ctrlKey && event.key.toLowerCase() === 'v') {
                        // Cho phép người dùng sử dụng tổ hợp phím Ctrl + V
                        return;
                      }
                      if (
                        isNaN(Number(event.key)) &&
                        !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete'].includes(
                          event.key
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                    placeholder="0903111222"
                    onChange={handleChangeCustomerPhone}
                  />

                  <p className="text-danger">{notice.customerPhone}</p>
                  <label htmlFor="inputAddressCustomer" className="form-label">
                    Địa chỉ liên hệ<span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddressCustomer"
                    name="customer_address"
                    aria-describedby="addressCustomerHelp"
                    required
                    placeholder="198/2-199/4 đường Nguyễn Huệ, phường 1, quận 1, TP.HCM"
                    onChange={handleChangeCustomerAddress}
                  />
                  <p className="text-danger">{notice.customerAddress}</p>
                  <label htmlFor="inputEmailCustomer" className="form-label">
                    Email<span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmailCustomer"
                    name="customer_email"
                    aria-describedby="emailCustomerHelp"
                    required
                    placeholder="Nhập email"
                    onChange={handleChangeCustomerEmail}
                  />
                  <p className="text-danger">{notice.customerEmail}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    <i className="fa fa-arrow-left"></i>
                  </button>
                  <button type="reset" className="btn btn-danger">
                    <i className="fa fa-sync"></i>
                  </button>
                  <button type="submit" className="btn btn-primary" onClick={addCustomer}>
                    <i className="fa fa-save"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
}
