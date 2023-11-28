/* eslint-disable no-unused-vars */
/* eslint-disable semi */
/* eslint-disable space-before-function-paren */
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function DataStat(props) {
  // Lấy năm hiện tại
  const [year, setYear] = useState(new Date().getFullYear());
  const [dataBook, setDataBook] = useState('');
  const [dataOrder, setDataOrder] = useState('');
  const [dataRevenue, setDataRevenue] = useState('');
  const [dataCustomer, setDataCustomer] = useState('');
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      const result = await axios.get(
        `https://localhost:7208/api/Statistics/GetTotalMonthYear/TotalMonthYear?year=${year}`
      );
      setDataBook(result.data.total_booksSold);
      setDataOrder(result.data.total_orders);
      setDataRevenue(result.data.yearRevenue);
      setDataCustomer(result.data.total_customers);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  return (
    <div className="row">
      <div className="col-sm-6 col-lg-3">
        <div className="card mb-3 data__statis">
          <h5 className="card-header bg-primary text-center text-light">
            Tổng số sách đã bán trong năm {year}
          </h5>
          <div className="card-body">
            <h5 className="card-title d-flex justify-content-center">
              <div className="icon__dataStat border border-primary">
                <i
                  className="fa fa-book-open text-primary"
                  style={{
                    lineHeight: '66px',
                    marginLeft: '19%',
                    width: '100%',
                    fontSize: '38px'
                  }}></i>
              </div>
            </h5>
            <p className="card-text text_stat text-center text-primary">{dataBook} cuốn sách</p>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-3">
        <div className="card mb-3 data__statis">
          <h5 className="card-header bg-success text-center text-light">
            Tổng số đơn hàng đã hoàn thành trong năm {year}
          </h5>
          <div className="card-body">
            <h5 className="card-title d-flex justify-content-center">
              <div className="icon__dataStat border border-success">
                <i
                  className="fa fa-money-check-alt text-success"
                  style={{
                    lineHeight: '66px',
                    marginLeft: '19%',
                    width: '100%',
                    fontSize: '38px'
                  }}></i>
              </div>
            </h5>
            <p className="card-text text_stat text-center text-success">{dataOrder} đơn hàng</p>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-3">
        <div className="card mb-3 data__statis">
          <h5 className="card-header bg-danger text-center text-light">
            Tổng số doanh thu trong năm {year}
          </h5>
          <div className="card-body">
            <h5 className="card-title d-flex justify-content-center">
              <div className="icon__dataStat border border-danger">
                <i
                  className="fa fa-money-bill-wave text-danger"
                  style={{
                    lineHeight: '66px',
                    marginLeft: '18%',
                    width: '100%',
                    fontSize: '38px'
                  }}></i>
              </div>
            </h5>
            <p className="card-text text_stat text-center text-danger">
              {dataRevenue.toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND'
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="col-sm-6 col-lg-3">
        <div className="card mb-3 data__statis">
          <h5 className="card-header bg-dark text-center text-light">
            Tổng số khách hàng đã đặt hàng trong năm {year}
          </h5>
          <div className="card-body">
            <h5 className="card-title d-flex justify-content-center">
              <div className="icon__dataStat border border-dark">
                <i
                  className="fa fa-user-friends text-dark"
                  style={{
                    lineHeight: '66px',
                    marginLeft: '15%',
                    width: '100%',
                    fontSize: '38px'
                  }}></i>
              </div>
            </h5>
            <p className="card-text text_stat text-center text-dark">{dataCustomer} khách hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
}
