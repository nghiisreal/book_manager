/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Modal from '../../Modal/Modal';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';
import '../../Add/addItem.css';
export default function UpdateAuthor(props) {
  const history = useHistory();
  const params = useParams();
  // console.log(params.id);

  const [state, setState] = useState({
    author_name: '',
    authorAndBooks: []
  });
  // console.log(state.author_name);

  useEffect(() => {
    getAuthorId();
  }, [params.id]);
  const [notice, setNotice] = useState('');
  const getAuthorId = async () => {
    try {
      const id = params.id;
      const result = await axios.get(`https://localhost:7208/api/Authors/GetAuthorWithBooks/${id}`);
      setState({
        author_name: result.data.author_name,
        authorAndBooks: result.data.authorAndBooks
      });
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handleChangeAuthorName = (e) => {
    setState({
      ...state,
      author_name: e.target.value
    });
  };
  // console.log(state.bookList);
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z\s\u00C0-\u1EF9-.]+$/; // regex tiếng việt
    // console.log(regexString.test(state.author_name));
    if (isEmpty(state.author_name)) {
      mess.authorName = 'Vui lòng nhập tên tác giả';
    }
    if (!regexString.test(state.author_name.trim())) {
      mess.authorName = 'Tên tác giả không được chứa ký tự đặc biệt hoặc số !';
    }
    if (regexString.test(state.author_name.trim())) {
      if (state.author_name.length < 2) {
        mess.authorName = 'Tên tác giả không được nhỏ hơn 2 ký tự';
      }
    }
    setNotice(mess);
    console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const updateAuthor = async (e) => {
    e.preventDefault();

    const id = params.id;
    const isValid = validate();
    if (!isValid) {
      return true;
    }

    try {
      await axios.put(`https://localhost:7208/api/Authors/Updateid/${id}`, {
        author_name: state.author_name
      });
      alert(`Cập nhật tác giả với mã ${id} thành công!`);
      history.push('/home/authors');
    } catch (err) {
      alert(err.response.data);
    }
  };
  const renderAuthorWithId = () => {
    return (
      <>
        <div className="mb-3 mt-3 text-start">
          <label htmlFor="inputNameAuthor" className="form-label">
            Tên tác giả <span className="text-danger">(*)</span>
          </label>
          <input
            type="text"
            className="form-control ps-3"
            id="inputNameAuthor"
            name="author_name"
            aria-describedby="nameAuthorHelp"
            required
            placeholder="Nhập tên tác giả"
            value={state.author_name}
            onChange={handleChangeAuthorName}
          />
          <p className="text-danger">{notice.authorName}</p>
          <label htmlFor="authorAndBooks" className="form-label">
            Những quyển sách đã viết
          </label>
          <textarea
            disabled
            type="text"
            className="form-control"
            name="authorAndBooks"
            aria-describedby="authorAndBooksHelp"
            required
            value={state.authorAndBooks.map((item) => ' ' + item.title_book)}
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
            Cập nhật tác giả có mã: {params.id}
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
              <form onSubmit={updateAuthor}>
                {renderAuthorWithId()}
                {/* <div className="mb-3 mt-3 text-start">
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
                                        onChange
                                    />

                                    <p className="text-danger"></p>
                                </div> */}
                {/* <div className="d-flex justify-content-between">
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
                                    <button type="submit" className="btn btn-primary">
                                        <i className="fa fa-save" onSubmit></i>
                                    </button>
                                </div> */}
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
                  <button type="submit" className="btn btn-primary" onClick={updateAuthor}>
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
