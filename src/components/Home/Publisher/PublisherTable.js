/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../Pagination/Pagination';

export default function PublisherTable() {
  const [state, setState] = useState({
    publisherList: [],
    currentPage: 1,
    totalPages: 1
  });
  const [publisherSearch, setPublisherSearch] = useState([]);
  const [publisherStatistic, setPublisherStatistic] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  useEffect(() => {
    getPublisherList(state.currentPage, setState);
  }, [state.currentPage, searchResult]);
  useEffect(() => {}, [publisherSearch]);
  // console.log(state.publisherList);
  const getPublisherList = async (page) => {
    try {
      let result = null;
      if (searchResult === '') {
        const result = await axios.get(
          `https://localhost:7208/api/Detail/GetPublishersAll?page=${page}`
        );
        setState({
          ...state,
          publisherList: result.data.result,
          currentPage: result.data.currentPage,
          totalPages: result.data.totalPages
        });
      } else {
        result = await axios.get('https://localhost:7208/api/Detail/GetPublishersAll?page=0');
        setPublisherSearch(result.data.result);
        setState({ ...state, currentPage: 1, totalPages: 1 });
      }
      result = await axios.get('https://localhost:7208/api/Detail/GetPublishersAll?page=0');
      setPublisherStatistic(result.data.result);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handlePageChange = (pageNumber) => {
    getPublisherList(pageNumber);
  };
  const delPublisher = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Publishers/Deleteid/${id}`);
      alert(result.data);
      await getPublisherList(state.currentPage, setState);
      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const renderPublishers = () => {
    if (searchResult === '') {
      return state.publisherList.map((publisher, index) => {
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{publisher.publisher_name}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightPublisher${index}`}
                  aria-controls="offcanvasRight">
                  Xem Chi Tiết
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightPublisherDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delPublisher(publisher.publisher_id);
                  }}>
                  Xóa
                </button>
              </td>
            </tr>
            {/* offcanvas */}
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id={`offcanvasRightPublisher${index}`}
              aria-labelledby="offcanvasRightLabel"
              style={{ minWidth: '30vw' }}>
              <div className="offcanvas-header">
                <h4
                  id="offcanvasRightLabel"
                  style={{ height: '50px', lineHeight: '50px', marginBottom: 0 }}>
                  Chi Tiết Nhà Xuất Bản
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
                      <b>Tên nhà xuất bản: </b>
                    </span>
                    <span>{publisher.publisher_name}</span>
                  </div>
                  <div>
                    <span>
                      <b>Điện thoại: </b>
                    </span>
                    <span>{publisher.publisher_phone}</span>
                  </div>
                  <div>
                    <span>
                      <b>Địa chỉ: </b>
                    </span>
                    <span>{publisher.publisher_address}</span>
                  </div>
                  <div>
                    <span>
                      <b>Những quyển sách đã xuất bản: </b>
                    </span>
                    {publisher.bookList.map((item, index) => {
                      return <li key={index}>{item.title_book}</li>;
                    })}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <NavLink
                  className="navbar-brand"
                  to={`/home/publishers/update-publisher/${publisher.publisher_id}`}>
                  <button type="button" className="btn btn-primary me-3">
                    Sửa
                  </button>
                </NavLink>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightPublisherDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delPublisher(publisher.publisher_id);
                  }}>
                  Xóa
                </button>
              </div>
            </div>
          </Fragment>
        );
      });
    } else {
      return publisherSearch
        .filter((name) => name.publisher_name.toLowerCase().includes(searchResult.toLowerCase()))
        .map((publisher, index) => {
          return (
            <Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{publisher.publisher_name}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightPublisher${index}`}
                    aria-controls="offcanvasRight">
                    Xem Chi Tiết
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightPublisherDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delPublisher(publisher.publisher_id);
                    }}>
                    Xóa
                  </button>
                </td>
              </tr>
              {/* offcanvas */}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id={`offcanvasRightPublisher${index}`}
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                  <h4
                    id="offcanvasRightLabel"
                    style={{
                      height: '50px',
                      lineHeight: '50px',
                      marginBottom: 0
                    }}>
                    Chi Tiết Nhà Xuất Bản
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
                        <b>Tên nhà xuất bản: </b>
                      </span>
                      <span>{publisher.publisher_name}</span>
                    </div>
                    <div>
                      <span>
                        <b>Điện thoại: </b>
                      </span>
                      <span>{publisher.publisher_phone}</span>
                    </div>
                    <div>
                      <span>
                        <b>Địa chỉ: </b>
                      </span>
                      <span>{publisher.publisher_address}</span>
                    </div>
                    <div>
                      <span>
                        <b>Những quyển sách đã xuất bản: </b>
                      </span>
                      {publisher.bookList.map((item, index) => {
                        return <li key={index}>{item.title_book}</li>;
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <NavLink
                    className="navbar-brand"
                    to={`/home/publishers/update-publisher/${publisher.publisher_id}`}>
                    <button type="button" className="btn btn-primary me-3">
                      Sửa
                    </button>
                  </NavLink>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightPublisherDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delPublisher(publisher.publisher_id);
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
              Có: <span>{publisherStatistic.length} nhà xuất bản</span>
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
        <NavLink className="navbar-brand" to="/home/publishers/add-publisher">
          <button className="btn btn-dark text-light my-0">
            <i className="fa fa-plus" aria-hidden="true"></i> Thêm
          </button>
        </NavLink>
        {/* {state.publisherList.length === 0 ? ( */}
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
              <th scope="col">Tên xuất bản</th>
              <th scope="col" style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody className="table-light">{renderPublishers()}</tbody>
        </table>
      </div>

      {renderPublishers().length > 0 ? (
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
