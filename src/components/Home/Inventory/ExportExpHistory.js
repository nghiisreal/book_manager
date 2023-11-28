/* eslint-disable import/no-duplicates */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
import React from 'react';
import { Fragment } from 'react';
import Pagination from '../../Pagination/Pagination';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { saveAs } from 'file-saver';

export default function ExportExpHistory(props) {
  const history = useHistory();
  const [state, setState] = useState({
    expList: [],
    currentPage: 1,
    totalPages: 1
  });
  // console.log(state.bookList);
  const [iepSearch, setIepSearch] = useState([]);
  const [iepStatistic, setIepStatistic] = useState([]);
  const [searchResult, setSearchResult] = useState('');

  useEffect(() => {
    getIepList(state.currentPage, setState);
  }, [state.currentPage, searchResult]);
  useEffect(() => {}, [iepSearch]);
  const getIepList = async (page) => {
    try {
      let result = null;
      if (searchResult === '') {
        const result = await axios.get(
          `https://localhost:7208/api/InventoryExports/GetInventoryExportsAll?page=${page}`
        );

        setState({
          ...state,
          expList: result.data.result,
          currentPage: result.data.currentPage,
          totalPages: result.data.totalPages
        });
      } else {
        result = await axios.get(
          'https://localhost:7208/api/InventoryExports/GetInventoryExportsAll?page=0'
        );
        setIepSearch(result.data.result);
        setState({ ...state, currentPage: 1, totalPages: 1 });
      }
      result = await axios.get(
        'https://localhost:7208/api/InventoryExports/GetInventoryExportsAll?page=0'
      );
      setIepStatistic(result.data.result);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handlePageChange = (pageNumber) => {
    getIepList(pageNumber, setState);
  };
  const exportExcel = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(
        'https://localhost:7208/api/InventoryExports/InventoryExportsToExcel',
        { responseType: 'blob' } // Kiểu blob: Binary Large Object để chưa những dữ liệu như văn bảng, hình ảnh... với dung lượng lớn
      );
      const blob = new Blob([result.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'InventoryExports.xlsx');
    } catch (err) {
      alert('Lỗi xuất file');
    }
  };
  const renderBooks = () => {
    if (searchResult === '') {
      return state.expList.map((item, index) => {
        // console.log(book.book_id);
        return (
          <Fragment key={index}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{item.iep_id}</td>
              <td>
                {item.orderItemExport.map((item, index) => {
                  return (
                    <li key={index} className="text-start">
                      {item.bookTitle}
                    </li>
                  );
                })}
              </td>
              <td>
                {item.orderItemExport.map((item, index) => {
                  return (
                    <p key={index} className="text-center">
                      <i className="fa fa-arrow-alt-circle-down text-danger"></i> {''}
                      {item.quantity} cuốn
                    </p>
                  );
                })}
              </td>
              <td>
                {' '}
                {item.export_date.substring(8, 10)}-{item.export_date.substring(5, 7)}-
                {item.export_date.substring(0, 4)} - {''}
                {item.export_date.substring(11, 16)}
              </td>
            </tr>
          </Fragment>
        );
      });
    } else {
      return iepSearch
        .filter((name) => name.iep_id.toLowerCase().includes(searchResult.toLowerCase()))
        .map((item, index) => {
          return (
            <Fragment key={index}>
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{item.iep_id}</td>
                <td>
                  {item.orderItemExport.map((item, index) => {
                    return (
                      <li key={index} className="text-start">
                        {item.bookTitle}
                      </li>
                    );
                  })}
                </td>
                <td>
                  {item.orderItemExport.map((item, index) => {
                    return (
                      <p key={index} className="text-center">
                        <i className="fa fa-arrow-alt-circle-down text-danger"></i>
                        {''}
                        {item.quantity} cuốn
                      </p>
                    );
                  })}
                </td>
                <td>
                  {' '}
                  {item.export_date.substring(8, 10)}-{item.export_date.substring(5, 7)}-
                  {item.export_date.substring(0, 4)} - {''}
                  {item.export_date.substring(11, 16)}
                </td>
              </tr>
            </Fragment>
          );
        });
    }
  };
  return (
    <div className="container my-3">
      <div className="mb-1">
        {searchResult === '' ? (
          <p className="d-flex justify-content-start mb-3">
            <b>
              Có: <span>{iepStatistic.length} phiếu xuất kho</span>
            </b>
          </p>
        ) : (
          <p hidden></p>
        )}
        <form className="d-flex">
          <button
            type="button"
            className="btn btn-dark me-3"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={(e) => {
              history.push('/home/inventory');
            }}>
            <i className="fa fa-arrow-left"></i>
          </button>
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
      <div className="d-flex justify-content-between mt-3 me-2">
        {/* {state.bookList.length === 0 ? ( */}
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
          maxHeight: '600px',
          overflow: 'auto',
          marginTop: '10px',
          marginBottom: '8px'
        }}>
        <table className="table table-bordered" style={{ verticalAlign: 'middle' }}>
          <thead>
            <tr className="table-primary">
              <th scope="col">#</th>
              <th scope="col">Mã PXK</th>
              <th scope="col">Tên sách</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Ngày xuất kho</th>
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
        // eslint-disable-next-line prettier/prettier
        <Fragment />
      )}
    </div>
  );
}
