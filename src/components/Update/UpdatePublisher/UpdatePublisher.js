/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Modal from '../../Modal/Modal';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';
import '../../Add/addItem.css';
export default function UpdatePublisher() {
  const history = useHistory();
  const params = useParams();
  // console.log(params.id);

  const [state, setState] = useState({
    publisher_name: '',
    publisher_address: '',
    publisher_phone: '',
    publisherBook: []
  });
  // console.log(state.publisher_address);

  useEffect(() => {
    getPublisherId();
  }, [params.id]);
  const [notice, setNotice] = useState('');
  const getPublisherId = async () => {
    try {
      const id = params.id;
      const result = await axios.get(
        `https://localhost:7208/api/Publishers/GetPublisherBook/${id}`
      );
      setState({
        publisher_name: result.data.publisher_name,
        publisher_address: result.data.publisher_address,
        publisher_phone: result.data.publisher_phone,
        publisherBook: result.data.publisherBook
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handleChangePublisherName = (e) => {
    setState((prevState) => ({ ...prevState, publisher_name: e.target.value }));
    // console.log(state.publisher_name);
  };
  const handleChangePublisherAddress = (e) => {
    setState((prevState) => ({ ...prevState, publisher_address: e.target.value }));
    // console.log(state.publisher_address);
  };
  const handleChangePublisherPhone = (e) => {
    setState((prevState) => ({ ...prevState, publisher_phone: e.target.value }));
    // console.log(state.publisher_phone);
  };
  // console.log(state.bookList);
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9-]+$/; // regex tiếng việt, có "-"

    if (isEmpty(state.publisher_name)) {
      mess.publisherName = 'Vui lòng nhập tên nhà xuất bản';
    }
    if (!regexString.test(state.publisher_name.trim())) {
      mess.publisherName = 'Tên nhà xuất bản không được chứa ký tự đặc biệt hoặc số !';
    }
    if (regexString.test(state.publisher_name.trim())) {
      if (state.publisher_name.length < 10) {
        mess.publisherName = 'Tên nhà xuất bản không được nhỏ hơn 10 ký tự';
      }
    }

    // console.log(regexString.test(state.publisher_name));
    const regexAddress = /^[a-zA-Z0-9\s\u00C0-\u1EF9-,./()]+$/; // regex tiếng việt, số, - , . / ()

    if (!isEmpty(state.publisher_address)) {
      if (regexAddress.test(state.publisher_address.trim())) {
        if (state.publisher_address.length < 10) {
          mess.publisherAddress = 'Địa chỉ nhà xuất bản không được nhỏ hơn 10 ký tự';
        }
      }
      if (!regexAddress.test(state.publisher_address.trim())) {
        mess.publisherAddress =
          'Địa chỉ nhà xuất bản không được chứa ký tự đặc biệt ngoài những ký tự sau: "- , . /, ( )"';
      }
    }

    // console.log(regexString.test(state.publisher_address));
    const regexPhone = /^\d{10}$/;
    // console.log(regexString.test(state.publisher_phone));

    if (!isEmpty(state.publisher_phone)) {
      if (!regexPhone.test(state.publisher_phone.trim()).length < 10) {
        mess.publisherPhone = 'Điện thoại nhà xuất bản không được nhỏ hơn 10 và lớn hơn 11 số';
      }
    }

    // console.log(regexString.test(state.publisher_phone));
    setNotice(mess);
    console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const updatePublisher = async (e) => {
    e.preventDefault();
    const id = params.id;
    const isValid = validate();
    if (!isValid) {
      return true;
    }

    try {
      // console.log(state.publisher_address);
      // console.log(state.publisher_phone);
      await axios.put(`https://localhost:7208/api/Publishers/Updateid/${id}`, {
        publisher_name: state.publisher_name,
        publisher_address: state.publisher_address,
        publisher_phone: state.publisher_phone
      });
      alert(`Cập nhật nhà xuất bản với mã ${id} thành công!`);
      history.push('/home/publishers');
    } catch (err) {
      alert(err.response.data);
    }
  };
  const renderPublisherWithId = () => {
    return (
      <>
        <div className="mb-3 mt-3 text-start">
          <label htmlFor="inputNamePublisher" className="form-label">
            Tên nhà xuất bản <span className="text-danger">(*)</span>
          </label>
          <input
            type="text"
            className="form-control ps-3"
            id="inputNamePublisher"
            name="publisher_name"
            aria-describedby="namePublisherHelp"
            required
            placeholder="Nhập tên nhà xuất bản"
            value={state.publisher_name}
            onChange={handleChangePublisherName}
          />
          <p className="text-danger">{notice.publisherName}</p>
          <label htmlFor="inputAddressPublisher" className="form-label">
            Địa chỉ nhà xuất bản
          </label>
          <input
            type="text"
            className="form-control ps-3"
            id="inputAddressPublisher"
            name="publisher_address"
            aria-describedby="addressPublisherHelp"
            placeholder="198/2-199/4 đường Nguyễn Huệ, phường 1, quận 1, TP.HCM"
            value={state.publisher_address}
            onChange={handleChangePublisherAddress}
          />
          <p className="text-danger">{notice.publisherAddress}</p>
          <label htmlFor="inputPhonePublisher" className="form-label">
            Số điện thoại nhà xuất bản
          </label>
          <input
            type="text"
            className="form-control ps-3"
            id="inputPhonePublisher"
            name="publisher_phone"
            aria-describedby="phonePublisherHelp"
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
                !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete'].includes(event.key)
              ) {
                event.preventDefault();
              }
            }}
            placeholder="0903111222"
            value={state.publisher_phone}
            onChange={handleChangePublisherPhone}
          />
          <p className="text-danger">{notice.publisherPhone}</p>
          <label htmlFor="publisherBook" className="form-label">
            Những quyển sách đã xuất bản
          </label>
          <textarea
            disabled
            type="text"
            className="form-control"
            name="publisherBook"
            aria-describedby="publisherBookHelp"
            required
            value={state.publisherBook.map((item) => ' ' + item.title_book)}
          />
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
            Cập nhật nhà xuất bản có mã: {params.id}
          </span>
        </div>
      </nav>
      <div className="container my-4">
        <div className="card card__style">
          <div className="card-body">
            <h1 className="card-title">
              {' '}
              <i className="fa fa-user-tie me-1"></i>
            </h1>
            <div style={{ borderTop: '2px solid #e7e7e7' }}></div>
            <div>
              <form onSubmit={updatePublisher}>
                {renderPublisherWithId()}

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
                  <button type="submit" className="btn btn-primary" onClick={updatePublisher}>
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
