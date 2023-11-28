/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import '../addItem.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';
import Modal from '../../Modal/Modal';
export default function AddAuthor() {
  const history = useHistory();
  const [authorName, setAuthorName] = useState('');
  const [notice, setNotice] = useState('');
  const handleChangeAuthorName = (e) => {
    const value = e.target.value;
    setAuthorName(value.trim());
  };
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9-.]+$/; // regex tiếng việt và dấu "," "."
    // console.log(regexString.test(authorName));
    if (isEmpty(authorName)) {
      mess.authorName = 'Vui lòng nhập tên tác giả';
    }
    if (!regexString.test(authorName.trim())) {
      mess.authorName = 'Tên tác giả không được chứa ký tự đặc biệt hoặc số !';
    }
    if (regexString.test(authorName.trim())) {
      if (authorName.length < 2) {
        mess.authorName = 'Tên tác giả không được nhỏ hơn 2 ký tự';
      }
    }
    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const addAuthor = async (e) => {
    e.preventDefault();
    // console.log(authorName);
    const isValid = validate();
    if (!isValid) {
      return true;
    }
    try {
      await axios.post('https://localhost:7208/api/Authors/CreateNewAu', {
        author_name: authorName
      });

      history.push('/home/authors');
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
            Thêm tác giả
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
              <form onSubmit={addAuthor}>
                <div className="mb-3 mt-3 text-start">
                  <label htmlFor="inputNameAuthor" className="form-label">
                    Tên tác giả <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputNameAuthor"
                    name="author_name"
                    aria-describedby="nameAuthorHelp"
                    required
                    placeholder="Nhập tên tác giả"
                    onChange={handleChangeAuthorName}
                  />

                  <p className="text-danger">{notice.authorName}</p>
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
                  <button type="submit" className="btn btn-primary" onClick={addAuthor}>
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
