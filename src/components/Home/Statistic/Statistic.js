/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React from 'react';
import ChartBarRevenue from '../../Chart/ChartBarRevenue';
import './Statistic.css';
import DataStat from '../../Chart/DataStat';
import ChartBarCustomer from '../../Chart/ChartBarCustomer';
import { PieChartTopBook } from '../../Chart/PieChartTopBook';
import ChartBarExpense from '../../Chart/ChartBarExpense';
export default function Statistic(props) {
  return (
    <div className="container">
      <div className="text-end">
        <button
          className="btn btn-info text-light mb-2"
          onClick={() => window.location.reload()}
          style={{ maxHeight: '38px', marginTop: '0px' }}>
          <i className="fa fa-sync"></i>
        </button>
      </div>
      <DataStat />
      <div className="row ms-1">
        <div className="col-sm-12 col-md-6 chart__statistic">
          <ChartBarRevenue />
        </div>
        <div className="col-sm-12 col-md-6 chart__statistic2">
          <ChartBarExpense />
        </div>
      </div>
      <div className="row ms-1 mt-3">
        <div className="col-sm-12 col-md-7 chart__statistic3">
          <ChartBarCustomer />
        </div>
        <div className="col-sm-12 col-md-5 pie__statistic">
          <PieChartTopBook />
        </div>
      </div>
    </div>
  );
}
