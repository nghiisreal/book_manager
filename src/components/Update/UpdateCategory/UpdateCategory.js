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
export default function UpdateCategory() {
  const history = useHistory();
  const params = useParams();
  // console.log(params.id);

  const [state, setState] = useState({
    category_name: '',
    categoryAndBooks: []
  });
  // console.log(state.category_name);

  useEffect(() => {
    getCateId();
  }, [params.id]);
  const [notice, setNotice] = useState('');
  const getCateId = async () => {
    try {
      const id = params.id;
      const result = await axios.get(
        `https://localhost:7208/api/Categories/GetCategoriesWithBook/${id}`
      );
      setState({
        category_name: result.data.category_name,
        categoryAndBooks: result.data.categoryAndBooks
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handleChangeCateName = (e) => {
    setState({
      ...state,
      category_name: e.target.value
    });
  };
  // console.log(state.bookList);
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9]+$/; // regex tiếng việt
    // console.log(regexString.test(state.category_name));
    if (isEmpty(state.category_name)) {
      mess.categoryName = 'Vui lòng nhập tên loại sách';
    }
    if (!regexString.test(state.category_name.trim())) {
      mess.categoryName = 'Tên loại sách không được chứa ký tự đặc biệt hoặc số !';
    }
    if (regexString.test(state.category_name.trim())) {
      if (state.category_name.length < 2) {
        mess.categoryName = 'Tên loại sách không được nhỏ hơn 2 ký tự';
      }
    }
    setNotice(mess);
    console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const updateCate = async (e) => {
    e.preventDefault();
    const id = params.id;
    const isValid = validate();
    if (!isValid) {
      return true;
    }

    try {
      await axios.put(`https://localhost:7208/api/Categories/Updateid/${id}`, {
        category_name: state.category_name
      });
      alert(`Cập nhật loại sách với mã ${id} thành công!`);
      history.push('/home/categories');
    } catch (err) {
      alert(err.response.data);
    }
  };
  const renderCateWithId = () => {
    return (
      <>
        <div className="mb-3 mt-3 text-start">
          <label htmlFor="inputNameCate" className="form-label">
            Tên loại sách <span className="text-danger">(*)</span>
          </label>
          <input
            type="text"
            className="form-control ps-3"
            id="inputNameCate"
            name="category_name"
            aria-describedby="nameCateHelp"
            required
            placeholder="Nhập tên loại sách"
            value={state.category_name}
            onChange={handleChangeCateName}
          />
          <p className="text-danger">{notice.categoryName}</p>
          <label htmlFor="authorAndBooks" className="form-label">
            Những quyển sách đã viết
          </label>
          <textarea
            disabled
            type="text"
            className="form-control"
            name="categoryAndBooks"
            aria-describedby="categoryAndBooksHelp"
            required
            value={state.categoryAndBooks.map((item) => ' ' + item.titleBooks)}
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
            Cập nhật loại sách có mã: {params.id}
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
              <form onSubmit={updateCate}>
                {renderCateWithId()}

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
                  <button type="submit" className="btn btn-primary" onClick={updateCate}>
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
