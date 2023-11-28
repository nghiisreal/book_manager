/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import Modal from '../../Modal/Modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import isEmpty from 'validator/lib/isEmpty';
import axios from 'axios';
import '../addItem.css';
export default function AddPublisher() {
  const history = useHistory();
  const [publisherName, setPublisherName] = useState('');
  const [publisherAddress, setPublisherAddress] = useState('');
  const [publisherPhone, setPublisherPhone] = useState('');
  const [notice, setNotice] = useState('');
  const handleChangePublisherName = (e) => {
    const value = e.target.value;
    setPublisherName(value.trim());
  };
  const handleChangePublisherAddress = (e) => {
    const value = e.target.value;
    setPublisherAddress(value.trim());
  };
  const handleChangePublisherPhone = (e) => {
    const value = e.target.value;
    setPublisherPhone(value.trim());
  };
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9-]+$/; // regex tiếng việt, có "-"
    // console.log(regexString.test(publisherName));
    if (isEmpty(publisherName)) {
      mess.publisherName = 'Vui lòng nhập tên nhà xuất bản';
    }
    if (!regexString.test(publisherName.trim())) {
      mess.publisherName = 'Tên nhà xuất bản không được chứa ký tự đặc biệt hoặc số !';
    }
    if (regexString.test(publisherName.trim())) {
      if (publisherName.length < 10) {
        mess.publisherName = 'Tên nhà xuất bản không được nhỏ hơn 10 ký tự';
      }
    }
    const regexAddress = /^[a-zA-Z0-9\s\u00C0-\u1EF9-,./()]+$/; // regex tiếng việt, số, -  . /, ()
    // console.log(regexString.test(publisherAddress));

    if (!isEmpty(publisherAddress)) {
      if (regexAddress.test(publisherAddress.trim())) {
        if (publisherAddress.length < 10) {
          mess.publisherAddress = 'Địa chỉ nhà xuất bản không được nhỏ hơn 10 ký tự';
        }
      }
      if (!regexAddress.test(publisherAddress.trim())) {
        mess.publisherAddress =
          'Địa chỉ nhà xuất bản không được chứa ký tự đặc biệt ngoài những ký tự sau: "- , . /, ( )"';
      }
    }

    const regexPhone = /^\d{10}$/;
    // console.log(regexString.test(publisherPhone));
    // console.log(publisherPhone);

    if (!isEmpty(publisherPhone)) {
      if (!regexPhone.test(publisherPhone.trim())) {
        mess.publisherPhone = 'Điện thoại nhà xuất bản không được nhỏ hơn 10 và lớn hơn 11 số';
      }
    }
    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const addPublisher = async (e) => {
    e.preventDefault();
    // console.log(authorName);
    const isValid = validate();
    if (!isValid) {
      return true;
    }
    try {
      await axios.post('https://localhost:7208/api/Publishers/CreateNewPublisher', {
        publisher_name: publisherName,
        publisher_address: publisherAddress,
        publisher_phone: publisherPhone
      });

      history.push('/home/publishers');
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
            Thêm nhà xuất bản
          </span>
        </div>
      </nav>
      <div className="container my-4">
        <div className="card card__style">
          <div className="card-body">
            <h1 className="card-title">
              {' '}
              <i className="fa fa-bookmark me-1"></i>
            </h1>
            <div style={{ borderTop: '2px solid #e7e7e7' }}></div>
            <div>
              <form onSubmit={addPublisher}>
                <div className="mb-3 mt-3 text-start">
                  <label htmlFor="inputNamePub" className="form-label">
                    Tên nhà xuất bản <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputNamePub"
                    name="publisher_name"
                    aria-describedby="namePubHelp"
                    required
                    placeholder="Nhập tên nhà xuất bản"
                    onChange={handleChangePublisherName}
                  />

                  <p className="text-danger">{notice.publisherName}</p>
                  <label htmlFor="inputAddressPub" className="form-label">
                    Địa chỉ nhà xuất bản
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputAddressPub"
                    name="publisher_address"
                    aria-describedby="addressPubHelp"
                    placeholder="198/2-199/4 đường Nguyễn Huệ, phường 1, quận 1, TP.HCM"
                    onChange={handleChangePublisherAddress}
                  />

                  <p className="text-danger">{notice.publisherAddress}</p>
                  <label htmlFor="inputPhonePub" className="form-label">
                    Số điện thoại nhà xuất bản
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="inputPhonePub"
                    name="publisher_phone"
                    aria-describedby="phonePubHelp"
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
                    onChange={handleChangePublisherPhone}
                  />

                  <p className="text-danger">{notice.publisherPhone}</p>
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
                  <button type="submit" className="btn btn-primary" onClick={addPublisher}>
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
