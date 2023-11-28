/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../Pagination/Pagination';

export default function CategoryTable() {
  const [state, setState] = useState({
    categoryList: [],
    currentPage: 1,
    totalPages: 1
  });
  const [categorySearch, setCategorySearch] = useState([]);
  const [categoryStatistic, setCategoryStatistic] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  useEffect(() => {
    getCategoryList(state.currentPage, setState);
  }, [state.currentPage, searchResult]);
  // Hiển thị kết quả search trên hầu hết trang
  useEffect(() => {}, [categorySearch]);
  // GET danh sách
  const getCategoryList = async (page) => {
    try {
      let result = null;
      if (searchResult === '') {
        const result = await axios.get(
          `https://localhost:7208/api/Detail/GetCategoriesAll?page=${page}`
        );
        setState({
          ...state,
          categoryList: result.data.result,
          currentPage: result.data.currentPage,
          totalPages: result.data.totalPages
        });
      } else {
        result = await axios.get('https://localhost:7208/api/Detail/GetCategoriesAll?page=0');
        setCategorySearch(result.data.result);
        setState({ ...state, currentPage: 1, totalPages: 1 });
      }
      result = await axios.get('https://localhost:7208/api/Detail/GetCategoriesAll?page=0');
      setCategoryStatistic(result.data.result);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  // Pagination
  const handlePageChange = (pageNumber) => {
    getCategoryList(pageNumber, setState);
  };
  // Delete
  const delCategory = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Categories/Deleteid/${id}`);
      alert(result.data);
      await getCategoryList(state.currentPage, setState);
      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      console.log(err.response.data);
    }
  };
  // Search
  // Render danh sách
  const renderCategories = () => {
    if (searchResult === '') {
      return state.categoryList.map((category, index) => {
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{category.category_name}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightCategory${index}`}
                  aria-controls="offcanvasRight">
                  Xem Chi Tiết
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightCategoryDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delCategory(category.category_id);
                  }}>
                  Xóa
                </button>
              </td>
            </tr>
            {/* offcanvas */}
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id={`offcanvasRightCategory${index}`}
              aria-labelledby="offcanvasRightLabel"
              style={{ minWidth: '30vw' }}>
              <div className="offcanvas-header">
                <h4
                  id="offcanvasRightLabel"
                  style={{ height: '50px', lineHeight: '50px', marginBottom: 0 }}>
                  Chi Tiết Loại Sách
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
                      <b>Tên loại: </b>
                    </span>
                    <span>{category.category_name}</span>
                  </div>
                  <div>
                    <span>
                      <b>Tên sách theo loại: </b>
                    </span>
                    {category.bookList.map((item, index) => {
                      return <li key={index}>{item.titleBooks}</li>;
                    })}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <NavLink
                  className="navbar-brand"
                  to={`/home/categories/update-category/${category.category_id}`}>
                  <button type="button" className="btn btn-primary me-3">
                    Sửa
                  </button>
                </NavLink>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightCategoryDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delCategory(category.category_id);
                  }}>
                  Xóa
                </button>
              </div>
            </div>
          </Fragment>
        );
      });
    } else {
      return categorySearch
        .filter((name) => name.category_name.toLowerCase().includes(searchResult.toLowerCase()))
        .map((category, index) => {
          return (
            <Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{category.category_name}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightCategory${index}`}
                    aria-controls="offcanvasRight">
                    Xem Chi Tiết
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightCategoryDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delCategory(category.category_id);
                    }}>
                    Xóa
                  </button>
                </td>
              </tr>
              {/* offcanvas */}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id={`offcanvasRightCategory${index}`}
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                  <h4
                    id="offcanvasRightLabel"
                    style={{
                      height: '50px',
                      lineHeight: '50px',
                      marginBottom: 0
                    }}>
                    Chi Tiết Loại Sách
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
                        <b>Tên loại: </b>
                      </span>
                      <span>{category.category_name}</span>
                    </div>
                    <div>
                      <span>
                        <b>Tên sách theo loại: </b>
                      </span>
                      {category.bookList.map((item, index) => {
                        return <li key={index}>{item.titleBooks}</li>;
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <NavLink
                    className="navbar-brand"
                    to={`/home/categories/update-category/${category.category_id}`}>
                    <button type="button" className="btn btn-primary me-3">
                      Sửa
                    </button>
                  </NavLink>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightCategoryDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delCategory(category.category_id);
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
              Có: <span>{categoryStatistic.length} loại sách</span>
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
        <NavLink className="navbar-brand" to="/home/categories/add-category">
          <button className="btn btn-dark text-light my-0">
            <i className="fa fa-plus" aria-hidden="true"></i> Thêm
          </button>
        </NavLink>
        {/* {state.categoryList.length === 0 ? ( */}
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
              <th scope="col">Loại sách</th>
              <th scope="col" style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody className="table-light">{renderCategories()}</tbody>
        </table>
      </div>

      {renderCategories().length > 0 ? (
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
