/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, { useState, useEffect, Fragment } from 'react';
import Pagination from '../../Pagination/Pagination';
import { NavLink } from 'react-router-dom';
import { saveAs } from 'file-saver';
export default function CustomerTable() {
  const [state, setState] = useState({
    customerList: [],

    currentPage: 1,
    totalPages: 1
  });
  const [customerSearch, setCustomerSearch] = useState([]);
  const [customerStatistic, setCustomerStatistic] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  useEffect(() => {
    getCustomerList(state.currentPage, setState);
  }, [state.currentPage, searchResult]);
  useEffect(() => {}, [customerSearch]);
  const getCustomerList = async (page) => {
    try {
      let result = null;
      if (searchResult === '') {
        const result = await axios.get(
          `https://localhost:7208/api/Customers/GetCustomersAll?page=${page}`
        );

        setState({
          ...state,
          customerList: result.data.result,
          currentPage: result.data.currentPage,
          totalPages: result.data.totalPages
        });
      } else {
        result = await axios.get('https://localhost:7208/api/Customers/GetCustomersAll?page=0');
        setCustomerSearch(result.data.result);
        setState({ ...state, currentPage: 1, totalPages: 1 });
      }
      result = await axios.get('https://localhost:7208/api/Customers/GetCustomersAll?page=0');
      setCustomerStatistic(result.data.result);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handlePageChange = (pageNumber) => {
    getCustomerList(pageNumber, setState);
  };
  const delCustomer = async (id) => {
    try {
      const result = await axios.delete(`https://localhost:7208/api/Customers/Deleteid/${id}`);
      alert(result.data);
      await getCustomerList(state.currentPage, setState);
      // window.location.reload(); // tự động load lại trang web
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const exportExcel = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(
        'https://localhost:7208/api/Customers/CustomersToExcel',
        { responseType: 'blob' } // Kiểu blob: Binary Large Object để chưa những dữ liệu như văn bảng, hình ảnh... với dung lượng lớn
      );
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'Customers.xlsx');
    } catch (err) {
      alert('Lỗi xuất file');
    }
  };
  const renderCustomers = () => {
    if (searchResult === '') {
      return state.customerList.map((customer, index) => {
        // console.log(customer.customer_id);
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{customer.customer_name}</td>

              <td>{customer.customer_phone}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightCustomer${index}`}
                  aria-controls="offcanvasRight">
                  Xem Chi Tiết
                </button>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightCustomerDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delCustomer(customer.id);
                  }}>
                  Xóa
                </button>
              </td>
            </tr>
            {/* offcanvas */}
            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id={`offcanvasRightCustomer${index}`}
              aria-labelledby="offcanvasRightLabel"
              style={{ minWidth: '30vw' }}>
              <div className="offcanvas-header">
                <h4
                  id="offcanvasRightLabel"
                  style={{ height: '50px', lineHeight: '50px', marginBottom: 0 }}>
                  Chi Tiết Khách Hàng
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
                  <div>
                    <span>
                      <b>Tên khách hàng: </b>
                    </span>
                    <span> {customer.customer_name}</span>
                  </div>

                  <div>
                    <span>
                      <b>Số điện thoại: </b>
                    </span>
                    <span>{customer.customer_phone}</span>
                  </div>
                  <div>
                    <span>
                      <b>Địa chỉ: </b>
                    </span>
                    <span>{customer.customer_address}</span>
                  </div>
                  <div>
                    <span>
                      <b>Email: </b>
                    </span>
                    <span>{customer.customer_email}</span>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <NavLink
                  className="navbar-brand"
                  to={`/home/customers/update-customer/${customer.id}`}>
                  <button type="button" className="btn btn-primary me-3">
                    Sửa
                  </button>
                </NavLink>
                <button
                  className="btn btn-danger"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target={`#offcanvasRightCustomerDelete${index}`}
                  aria-controls="offcanvasRight"
                  onClick={() => {
                    delCustomer(customer.id);
                  }}>
                  Xóa
                </button>
              </div>
            </div>
          </Fragment>
        );
      });
    } else {
      return customerSearch
        .filter((name) => name.customer_name.toLowerCase().includes(searchResult.toLowerCase()))
        .map((customer, index) => {
          return (
            <Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>

                <td>{customer.customer_name}</td>

                <td>{customer.customer_phone}</td>
                <td>
                  <button
                    className="btn btn-primary me-2"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightCustomer${index}`}
                    aria-controls="offcanvasRight">
                    Xem Chi Tiết
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightCustomerDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delCustomer(customer.id);
                    }}>
                    Xóa
                  </button>
                </td>
              </tr>
              {/* offcanvas */}
              <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id={`offcanvasRightCustomer${index}`}
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                  <h4
                    id="offcanvasRightLabel"
                    style={{
                      height: '50px',
                      lineHeight: '50px',
                      marginBottom: 0
                    }}>
                    Chi Tiết Hóa Đơn
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
                    <div>
                      <span>
                        <b>Tên khách hàng: </b>
                      </span>
                      <span> {customer.customer_name}</span>
                    </div>

                    <div>
                      <span>
                        <b>Số điện thoại: </b>
                      </span>
                      <span>{customer.customer_phone}</span>
                    </div>
                    <div>
                      <span>
                        <b>Địa chỉ: </b>
                      </span>
                      <span>{customer.customer_address}</span>
                    </div>
                    <div>
                      <span>
                        <b>Email: </b>
                      </span>
                      <span>{customer.customer_email}</span>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <NavLink
                    className="navbar-brand"
                    to={`/home/customers/update-customer/${customer.id}`}>
                    <button type="button" className="btn btn-primary me-3">
                      Sửa
                    </button>
                  </NavLink>
                  <button
                    className="btn btn-danger"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target={`#offcanvasRightCustomerDelete${index}`}
                    aria-controls="offcanvasRight"
                    onClick={() => {
                      delCustomer(customer.id);
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
              Có: <span>{customerStatistic.length} khách hàng</span>
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
        <NavLink className="navbar-brand" to="/home/customers/add-customer">
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
              <th scope="col">Tên khách hàng</th>

              <th scope="col">Số điện thoại</th>

              <th scope="col" style={{ width: '10%' }}></th>
            </tr>
          </thead>
          <tbody className="table-light">{renderCustomers()}</tbody>
        </table>
      </div>

      {renderCustomers().length > 0 ? (
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
