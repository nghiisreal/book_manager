/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../Pagination/Pagination';

export default function AuthorTable(props) {
  const [state, setState] = useState({
    authorList: [],
    currentPage: 1,
    totalPages: 1
  });
  const [authorSearch, setAuthorSearch] = useState([]);
  const [authorStatistic, setAuthorStatistic] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  // Sử dụng 2 useEffect
  // Phân trang và Search
  useEffect(() => {
    getAuthorList(state.currentPage, setState);
  }, [state.currentPage, searchResult]);
  // Hiển thị kết quả search trên hầu hết trang
  useEffect(() => {
    // console.log(authorSearch);
  }, [authorSearch]);

  const getAuthorList = async (page) => {
    try {
      let result = null;
      if (searchResult === '') {
        result = await axios.get(`https://localhost:7208/api/Detail/GetAuthorsAll?page=${page}`);
        setState({
          authorList: result.data.result,
          currentPage: result.data.currentPage,
          totalPages: result.data.totalPages
        });
      } else {
        result = await axios.get('https://localhost:7208/api/Detail/GetAuthorsAll?page=0');
        setAuthorSearch(result.data.result);
        setState({ ...state, currentPage: 1, totalPages: 1 });
        // console.log(authorSearch);
      }
      result = await axios.get('https://localhost:7208/api/Detail/GetAuthorsAll?page=0');
      setAuthorStatistic(result.data.result);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  // Paginations
  const handlePageChange = (pageNumber) => {
    getAuthorList(pageNumber, setState);
  };
  const delAuthor = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Authors/Deleteid/${id}`);

      alert(result.data);
      await getAuthorList(state.currentPage, setState);

      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const renderAuthors = () => {
    if (searchResult === '') {
      return state.authorList.map((author, index) => {
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{author.author_name}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightAuthor${index}`}
                  aria-controls="offcanvasRight">
                  Xem Chi Tiết
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightAuthorDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delAuthor(author.author_id);
                  }}>
                  Xóa
                </button>
              </td>
            </tr>

            {/* offcanvas */}
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id={`offcanvasRightAuthor${index}`}
              aria-labelledby="offcanvasRightLabel"
              style={{ minWidth: '30vw' }}>
              <div className="offcanvas-header">
                <h4
                  id="offcanvasRightLabel"
                  style={{ height: '50px', lineHeight: '50px', marginBottom: 0 }}>
                  Chi Tiết Tác Giả
                </h4>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"></button>
              </div>
              <div style={{ borderBottom: '1px solid grey', paddingTop: '0px' }}></div>
              <div className="offcanvas-body">
                <div className="text-start">
                  <div>
                    <span>
                      <b>Tên tác giả: </b>
                    </span>
                    <span>{author.author_name}</span>
                  </div>
                  <div>
                    <span>
                      <b>Sách đã viết: </b>
                    </span>
                    {author.bookList.map((item, index) => {
                      return <li key={index}>{item.title_book}</li>;
                    })}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <NavLink
                  className="navbar-brand"
                  to={`/home/authors/update-author/${author.author_id}`}>
                  <button type="button" className="btn btn-primary me-3">
                    Sửa
                  </button>
                </NavLink>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightAuthorDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delAuthor(author.author_id);
                  }}>
                  Xóa
                </button>
              </div>
            </div>
          </Fragment>
        );
      });
    } else {
      return authorSearch
        .filter((name) => name.author_name.toLowerCase().includes(searchResult.toLowerCase()))
        .map((author, index) => {
          return (
            <Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{author.author_name}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightAuthor${index}`}
                    aria-controls="offcanvasRight">
                    Xem Chi Tiết
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightAuthorDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delAuthor(author.author_id);
                    }}>
                    Xóa
                  </button>
                </td>
              </tr>

              {/* offcanvas */}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id={`offcanvasRightAuthor${index}`}
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                  <h4
                    id="offcanvasRightLabel"
                    style={{
                      height: '50px',
                      lineHeight: '50px',
                      marginBottom: 0
                    }}>
                    Chi Tiết Tác Giả
                  </h4>
                  <button
                    type="button"
                    className="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div
                  style={{
                    borderBottom: '1px solid grey',
                    paddingTop: '0px'
                  }}></div>
                <div className="offcanvas-body">
                  <div className="text-start">
                    <div>
                      <span>
                        <b>Tên tác giả: </b>
                      </span>
                      <span>{author.author_name}</span>
                    </div>
                    <div>
                      <span>
                        <b>Sách đã viết: </b>
                      </span>
                      {author.bookList.map((item, index) => {
                        return <li key={index}>{item.title_book}</li>;
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <NavLink
                    className="navbar-brand"
                    to={`/home/authors/update-author/${author.author_id}`}>
                    <button type="button" className="btn btn-primary me-3">
                      Sửa
                    </button>
                  </NavLink>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightAuthorDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delAuthor(author.author_id);
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
              Có: <span>{authorStatistic.length} tác giả</span>
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
        <NavLink className="navbar-brand" to="/home/authors/add-author">
          <button className="btn btn-dark text-light my-0">
            <i className="fa fa-plus" aria-hidden="true"></i> Thêm
          </button>
        </NavLink>
        {/* {state.authorList.length === 0 ? ( */}
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
              <th scope="col">Tên tác giả</th>
              <th scope="col" style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody className="table-light">{renderAuthors()}</tbody>
        </table>
      </div>

      {renderAuthors().length > 0 ? (
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
