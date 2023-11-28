/* eslint-disable indent */
/* eslint-disable prettier/prettier */
/* eslint-disable multiline-ternary */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
import React, { Fragment, useEffect, useState } from 'react';
import Pagination from '../../Pagination/Pagination';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export default function InventoryTable(props) {
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

  const renderBooks = () => {
    if (searchResult === '') {
      return state.bookList.map((book, index) => {
        // console.log(book.book_id);
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{book.book_title}</td>
              <td>{book.book_quantity}</td>
              <td>
                {book.book_price.toLocaleString('it-IT', {
                  style: 'currency',
                  currency: 'VND'
                })}
              </td>
              <td>
                <NavLink
                  className="navbar-brand"
                  to={`/home/inventory/add-inventory/${book.book_id}`}>
                  <button className="btn btn-dark me-2" type="button">
                    <i className="fa fa-plus" aria-hidden="true"></i> Nhập kho
                  </button>
                </NavLink>
              </td>
            </tr>
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
                <td>{book.book_quantity}</td>
                <td>
                  {book.book_price.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </td>
                <td>
                  <NavLink
                    className="navbar-brand"
                    to={`/home/inventory/add-inventory/${book.book_id}`}>
                    <button className="btn btn-dark me-2" type="button">
                      <i className="fa fa-plus" aria-hidden="true"></i> Nhập kho
                    </button>
                  </NavLink>
                </td>
              </tr>
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
      <div className="d-flex justify-content-between mt-1 me-2">
        <div>
          <NavLink className="navbar-brand" to="/home/inventory/irc-history">
            <button className="btn btn-secondary text-light my-0">Xem lịch sử nhập kho</button>
          </NavLink>
          <NavLink className="navbar-brand ms-3" to="/home/inventory/iep-history">
            <button className="btn btn-secondary text-light my-0">Xem lịch sử xuất kho</button>
          </NavLink>
        </div>
        {/* {state.bookList.length === 0 ? ( */}
        <button
          className="btn btn-info text-light ms-2 mb-0"
          onClick={() => window.location.reload()}
          style={{ maxHeight: '38px', marginTop: '0px' }}>
          <i className="fa fa-sync"></i>
        </button>
        {/* ) : (
                    <Fragment></Fragment>
                )} */}
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
              <th scope="col">Số lượng</th>
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
