/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import Modal from '../../Modal/Modal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import isEmpty from 'validator/lib/isEmpty';
import axios from 'axios';

export default function AddCategory() {
  const history = useHistory();
  const [categoryName, setCategoryName] = useState('');

  const [notice, setNotice] = useState('');
  const handleChangeCategoryName = (e) => {
    const value = e.target.value;
    setCategoryName(value);
  };
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9]+$/; // regex tiếng việt
    // console.log(regexString.test(categoryName));
    if (isEmpty(categoryName)) {
      mess.categoryName = 'Vui lòng nhập tên loại sách';
    }
    if (!regexString.test(categoryName.trim())) {
      mess.categoryName = 'Tên loại sách không được chứa ký tự đặc biệt hoặc số !';
    }
    if (regexString.test(categoryName.trim())) {
      if (categoryName.length < 2) {
        mess.categoryName = 'Tên loại sách không được nhỏ hơn 2 ký tự';
      }
    }
    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const addCategory = async (e) => {
    e.preventDefault();
    // console.log(authorName);
    const isValid = validate();
    if (!isValid) {
      return true;
    }
    try {
      await axios.post('https://localhost:7208/api/Categories/CreateNewCate', {
        category_name: categoryName
      });

      history.push('/home/categories');
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
            Thêm loại sách
          </span>
        </div>
      </nav>
      <div className="container my-4">
        <div className="card card__style">
          <div className="card-body">
            <h1 className="card-title">
              {' '}
              <i className="fa fa-layer-group me-1"></i>
            </h1>
            <div style={{ borderTop: '2px solid #e7e7e7' }}></div>
            <div>
              <form onSubmit={addCategory}>
                <div className="mb-3 mt-3 text-start">
                  <label htmlFor="inputNameCategory" className="form-label">
                    Tên loại sách <span className="text-danger">(*)</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputNameCategory"
                    name="category_name"
                    aria-describedby="nameCategoryHelp"
                    required
                    placeholder="Nhập tên loại sách"
                    onChange={handleChangeCategoryName}
                  />

                  <p className="text-danger">{notice.categoryName}</p>
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
                  <button type="submit" className="btn btn-primary" onClick={addCategory}>
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
