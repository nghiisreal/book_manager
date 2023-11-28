/* eslint-disable prettier/prettier */ /* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useState } from 'react';
import './BookTable.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../Pagination/Pagination';
import { saveAs } from 'file-saver';
export default function BookTable(props) {
  const [state, setState] = useState({
    bookList: [],
    currentPage: 1,
    totalPages: 1
  });
  // console.log(state.bookList);
  const [bookSearch, setBookSearch] = useState([]);
  const [bookStatistic, setBookStatistic] = useState([]);
  const [searchResult, setSearchResult] = useState('');

  useEffect(() => {
    getBookList(state.currentPage, setState);
  }, [state.currentPage, searchResult]);
  useEffect(() => {}, [bookSearch]);
  const getBookList = async (page) => {
    try {
      let result = null;
      if (searchResult === '') {
        const result = await axios.get(
          `https://localhost:7208/api/Detail/GetBooksAll?page=${page}`
        );

        setState({
          ...state,
          bookList: result.data.result,
          currentPage: result.data.currentPage,
          totalPages: result.data.totalPages
        });
      } else {
        result = await axios.get('https://localhost:7208/api/Detail/GetBooksAll?page=0');
        setBookSearch(result.data.result);
        setState({ ...state, currentPage: 1, totalPages: 1 });
      }
      result = await axios.get('https://localhost:7208/api/Detail/GetBooksAll?page=0');
      setBookStatistic(result.data.result);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handlePageChange = (pageNumber) => {
    getBookList(pageNumber, setState);
  };
  const delBook = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Books/Deleteid/${id}`);

      alert(result.data);
      await getBookList(state.currentPage, setState);
      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      alert(err.response.data);
    }
  };
  const exportExcel = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(
        'https://localhost:7208/api/Books/BooksToExcel',
        { responseType: 'blob' } // Kiểu blob: Binary Large Object để chưa những dữ liệu như văn bảng, hình ảnh... với dung lượng lớn
      );
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'Books.xlsx');
    } catch (err) {
      alert('Lỗi xuất file');
    }
  };
  const renderBooks = () => {
    if (searchResult === '') {
      return state.bookList.map((book, index) => {
        // console.log(book.book_id);
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{book.book_title}</td>
              <td>{book.category_name}</td>
              <td>
                {book.book_price.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightBook${index}`}
                  aria-controls="offcanvasRight">
                  Xem Chi Tiết
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightBookDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delBook(book.book_id);
                  }}>
                  Xóa
                </button>
              </td>
            </tr>
            {/* offcanvas */}
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id={`offcanvasRightBook${index}`}
              aria-labelledby="offcanvasRightLabel"
              style={{ minWidth: '30vw' }}>
              <div className="offcanvas-header">
                <h4
                  id="offcanvasRightLabel"
                  style={{ height: '50px', lineHeight: '50px', marginBottom: 0 }}>
                  Chi Tiết Sách
                </h4>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"></button>
              </div>
              <div
                style={{
                  borderBottom: '1px solid #cccccc',
                  paddingTop: '0px'
                }}></div>
              <div className="offcanvas-body">
                <div className="text-start">
                  <div className="text-center pt-2 pb-3">
                    <img src={book.book_image} style={{ width: '15vw' }}></img>
                  </div>
                  <div>
                    <span>
                      <b>Mã ISBN: </b>
                    </span>
                    <span> {book.isbn}</span>
                  </div>
                  <div>
                    <span>
                      <b>Tên sách: </b>
                    </span>
                    <span> {book.book_title}</span>
                  </div>
                  <div>
                    <span>
                      <b>Thể loại: </b>
                    </span>
                    <span>{book.category_name}</span>
                  </div>
                  <div>
                    <span>
                      <b>Số trang: </b>
                    </span>
                    <span>{book.num_pages}</span>
                  </div>
                  <div>
                    <span>
                      <b>Số lượng sách: </b>
                    </span>
                    {book.book_quantity === 0 ? (
                      <span className="text-danger">Hết hàng</span>
                    ) : (
                      <span>
                        {book.book_quantity} {''} quyển
                      </span>
                    )}
                  </div>
                  <div>
                    <span>
                      <b>Giá tiền: </b>
                    </span>
                    <span>
                      {' '}
                      {book.book_price.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </span>
                  </div>

                  <div>
                    <span>
                      <b>Tên tác giả: </b>
                    </span>
                    <span>{book.author_name}</span>
                  </div>
                  <div>
                    <span>
                      <b>Mô tả: </b>
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        textAlign: 'justify'
                      }}>
                      {book.book_des}
                    </span>
                  </div>
                  <div>
                    <span>
                      <b>Nhà xuất bản: </b>
                    </span>
                    <span>{book.publisher_name}</span>
                  </div>
                  <div>
                    <span>
                      <b>Ngày xuất bản: </b>
                    </span>
                    <span>
                      {' '}
                      {book.public_date.substring(8, 10)}-{book.public_date.substring(5, 7)}-
                      {book.public_date.substring(0, 4)}
                    </span>
                  </div>
                  <div>
                    <span>
                      <b>Đối tượng sử dụng: </b>
                    </span>
                    <span>{book.user_book}</span>
                  </div>
                  <div>
                    <span>
                      <b>Thời gian cập nhật: </b>
                    </span>
                    <span>
                      {book.update_date.substring(8, 10)}-{book.update_date.substring(5, 7)}-
                      {book.update_date.substring(0, 4)} - {''}
                      {book.update_date.substring(11, 16)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <NavLink className="navbar-brand" to={`/home/books/update-book/${book.book_id}`}>
                  <button type="button" className="btn btn-primary me-3">
                    Sửa
                  </button>
                </NavLink>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightBookDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delBook(book.book_id);
                  }}>
                  Xóa
                </button>
              </div>
            </div>
          </Fragment>
        );
      });
    } else {
      return bookSearch
        .filter((name) => name.book_title.toLowerCase().includes(searchResult.toLowerCase()))
        .map((book, index) => {
          return (
            <Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{book.book_title}</td>
                <td>{book.category_name}</td>
                <td>
                  {book.book_price.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightBook${index}`}
                    aria-controls="offcanvasRight">
                    Xem Chi Tiết
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightBookDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delBook(book.book_id);
                    }}>
                    Xóa
                  </button>
                </td>
              </tr>
              {/* offcanvas */}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id={`offcanvasRightBook${index}`}
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                  <h4
                    id="offcanvasRightLabel"
                    style={{
                      height: '50px',
                      lineHeight: '50px',
                      marginBottom: 0
                    }}>
                    Chi Tiết Sách
                  </h4>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div
                  style={{
                    borderBottom: '1px solid #cccccc',
                    paddingTop: '0px'
                  }}></div>
                <div className="offcanvas-body">
                  <div className="text-start">
                    <div className="text-left pt-2 pb-3">
                      <img src={book.book_image} style={{ width: '50%' }}></img>
                    </div>
                    <div>
                      <span>
                        <b>Mã ISBN: </b>
                      </span>
                      <span> {book.isbn}</span>
                    </div>
                    <div>
                      <span>
                        <b>Tên sách: </b>
                      </span>
                      <span> {book.book_title}</span>
                    </div>
                    <div>
                      <span>
                        <b>Thể loại: </b>
                      </span>
                      <span>{book.category_name}</span>
                    </div>
                    <div>
                      <span>
                        <b>Số trang: </b>
                      </span>
                      <span>{book.num_pages}</span>
                    </div>
                    <div>
                      <span>
                        <b>Số lượng sách: </b>
                      </span>
                      {book.book_quantity === 0 ? (
                        <span className="text-danger">Hết hàng</span>
                      ) : (
                        <span>
                          {book.book_quantity} {''} quyển
                        </span>
                      )}
                    </div>
                    <div>
                      <span>
                        <b>Giá tiền: </b>
                      </span>
                      <span>
                        {' '}
                        {book.book_price.toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND'
                        })}
                      </span>
                    </div>

                    <div>
                      <span>
                        <b>Tên tác giả: </b>
                      </span>
                      <span>{book.author_name}</span>
                    </div>
                    <div>
                      <span>
                        <b>Mô tả: </b>
                      </span>
                      <span
                        style={{
                          display: 'inline-block',
                          textAlign: 'justify'
                        }}>
                        {book.book_des}
                      </span>
                    </div>
                    <div>
                      <span>
                        <b>Nhà xuất bản: </b>
                      </span>
                      <span>{book.publisher_name}</span>
                    </div>
                    <div>
                      <span>
                        <b>Ngày xuất bản: </b>
                      </span>
                      <span>
                        {' '}
                        {book.public_date.substring(8, 10)}-{book.public_date.substring(5, 7)}-
                        {book.public_date.substring(0, 4)}
                      </span>
                    </div>
                    <div>
                      <span>
                        <b>Đối tượng sử dụng: </b>
                      </span>
                      <span>{book.user_book}</span>
                    </div>
                    <div>
                      <span>
                        <b>Thời gian cập nhật: </b>
                      </span>
                      <span>
                        {' '}
                        {book.update_date.substring(8, 10)}/{book.update_date.substring(5, 7)}/
                        {book.update_date.substring(0, 4)}/ - {''}
                        {book.update_date.substring(11, 16)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <NavLink className="navbar-brand" to={`/home/books/update-book/${book.book_id}`}>
                    <button type="button" className="btn btn-primary me-3">
                      Sửa
                    </button>
                  </NavLink>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightBookDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delBook(book.book_id);
                    }}>
                    Xóa
                  </button>
                </div>
              </div>
            </Fragment>
          );
        });
    }
  };
  return (
    <div className="container mt-1">
      <div className="mb-1">
        {searchResult === '' ? (
          <p className="d-flex justify-content-start mb-3">
            <b>
              Có: <span>{bookStatistic.length} cuốn sách</span>
            </b>
          </p>
        ) : (
          <p hidden></p>
        )}
        <form className="d-flex">
          <input
            className="form-control"
            type="search"
            placeholder="Tìm kiếm..."
            aria-label="Search"
            style={{ height: '50px' }}
            onChange={(e) => setSearchResult(e.target.value)}
          />
        </form>
      </div>
      <div className="d-flex justify-content-end mt-1 me-2">
        <NavLink className="navbar-brand" to="/home/books/add-book">
          <button className="btn btn-dark text-light my-0">
            <i className="fa fa-plus" aria-hidden="true"></i> Thêm
          </button>
        </NavLink>
        <button
          className="btn btn-info text-light ms-2 mb-0"
          onClick={() => window.location.reload()}
          style={{ maxHeight: '38px', marginTop: '0px' }}>
          <i className="fa fa-sync"></i>
        </button>
        <button
          className="btn btn-light ms-2 mb-0"
          onClick={exportExcel}
          style={{ maxHeight: '38px', marginTop: '0px', border: '1px solid #3d3d3d' }}>
          <i className="fa fa-file-excel text-success"></i>
        </button>
      </div>

      <div
        style={{
          width: '100%',
          maxHeight: '850px',
          overflow: 'auto',
          marginTop: '10px',
          marginBottom: '8px'
        }}>
        <table className="table table-bordered" style={{ verticalAlign: 'middle' }}>
          <thead>
            <tr className="table-primary">
              <th scope="col">#</th>
              <th scope="col">Tên sách</th>
              <th scope="col">Thể loại</th>
              <th scope="col">Giá</th>
              <th scope="col" style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody className="table-light">{renderBooks()}</tbody>
        </table>
      </div>

      {renderBooks().length > 0 ? (
        <>
          <Pagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      ) : (
        <Fragment />
      )}
    </div>
  );
}
