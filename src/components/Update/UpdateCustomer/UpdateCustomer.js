/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import Modal from '../../Modal/Modal';
import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';

export default function UpdateCustomer() {
  const history = useHistory();
  const params = useParams();
  const [state, setState] = useState({
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_email: ''
  });
  useEffect(() => {
    getCustomerId();
  }, [params.id]);
  const [notice, setNotice] = useState('');
  const getCustomerId = async () => {
    try {
      const id = params.id;
      const result = await axios.get(`https://localhost:7208/api/Customers/GetCustomerId/${id}`);
      setState({
        customer_name: result.data.customer_name,
        customer_phone: result.data.customer_phone,
        customer_address: result.data.customer_address,
        customer_email: result.data.customer_email
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handleChangeCustomerName = (e) => {
    setState((prevState) => ({ ...prevState, customer_name: e.target.value }));
  };
  const handleChangeCustomerPhone = (e) => {
    setState((prevState) => ({ ...prevState, customer_phone: e.target.value }));
  };
  const handleChangeCustomerAddress = (e) => {
    setState((prevState) => ({ ...prevState, customer_address: e.target.value }));
  };
  const handleChangeCustomerEmail = (e) => {
    setState((prevState) => ({ ...prevState, customer_email: e.target.value }));
  };
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9]+$/; // regex tiếng việt
    // console.log(regexString.test(state.customer_name));
    if (isEmpty(state.customer_name)) {
      mess.customerName = 'Vui lòng nhập tên khách hàng';
    }
    if (!regexString.test(state.customer_name.trim())) {
      mess.customerName = 'Tên khách hàng không được chứa ký tự đặc biệt hoặc số !';
    }

    // console.log(regexString.test(state.customer_name.trim()));
    if (regexString.test(state.customer_name.trim())) {
      if (state.customer_name.length < 4) {
        mess.customerName = 'Tên khách hàng không được nhỏ hơn 4 ký tự';
      }
    }
    const regexEmail = /^[a-zA-Z0-9\s\u00C0\u1EF9@.]+$/; // regex tiếng việt, @, .
    if (isEmpty(state.customer_email)) {
      mess.customerEmail = 'Vui lòng nhập email';
    }
    if (!regexEmail.test(state.customer_email.trim())) {
      mess.customerEmail = 'Email không được chứa ký tự đặc biệt ngoài @ và .!';
    }
    const regexAddress = /^[a-zA-Z0-9\s\u00C0-\u1EF9-,./()]+$/; // regex tiếng việt, số, -  . /, ()
    // console.log(regexString.test(state.customer_address));
    if (isEmpty(state.customer_address)) {
      mess.customerAddress = 'Vui lòng nhập địa chỉ liên hệ';
    }
    if (!isEmpty(state.customer_address)) {
      if (regexAddress.test(state.customer_address.trim())) {
        if (state.customer_address.length < 10) {
          mess.customerAddress = 'Địa chỉ liên hệ không được nhỏ hơn 10 ký tự';
        }
      }
      if (!regexAddress.test(state.customer_address.trim())) {
        mess.customerAddress =
          'Địa chỉ liên hệ không được chứa ký tự đặc biệt ngoài những ký tự sau: "- , . /, ( )"';
      }
    }

    const regexPhone = /^\d{10}$/;
    // console.log(regexString.test(state.customer_phone));

    if (isEmpty(state.customer_phone)) {
      mess.customerPhone = 'Vui lòng nhập số điện thoại';
    }
    if (!isEmpty(state.customer_phone)) {
      if (!regexPhone.test(state.customer_phone.trim())) {
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
  const updateCustomer = async (e) => {
    e.preventDefault();
    const id = params.id;
    const isValid = validate();
    if (!isValid) {
      return true;
    }

    try {
      // console.log(state.publisher_address);
      // console.log(state.publisher_phone);
      await axios.put(`https://localhost:7208/api/Customers/Updateid/${id}`, {
        customer_name: state.customer_name,

        customer_phone: state.customer_phone,
        customer_address: state.customer_address,
        customer_email: state.customer_email
      });
      alert(`Cập nhật khách hàng với mã ${id} thành công!`);
      history.push('/home/customers');
    } catch (err) {
      alert(err.response.data);
    }
  };
  const renderCustomerWithId = () => {
    return (
      <>
        <div className="mb-3 mt-3 text-start">
          <label htmlFor="inputNameCustomer" className="form-label">
            Tên khách hàng <span className="text-danger">(*)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputNameCustomer"
            name="customer_name"
            aria-describedby="nameCustomerHelp"
            required
            placeholder="Nhập tên khách hàng"
            value={state.customer_name}
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
            pattern="[0-9]{10}[0-9]{1}"
            maxLength={11}
            value={state.customer_phone}
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
                !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete'].includes(event.key)
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
            value={state.customer_address}
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
            value={state.customer_email}
            onChange={handleChangeCustomerEmail}
          />
          <p className="text-danger">{notice.customerEmail}</p>
        </div>
      </>
    );
  };
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span
            className="navbar-brand mb-0 h1"
            style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            Cập nhật khách hàng có mã: {params.id}
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
              <form onSubmit={updateCustomer}>
                {renderCustomerWithId()}
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
                  <button type="submit" className="btn btn-primary" onClick={updateCustomer}>
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
