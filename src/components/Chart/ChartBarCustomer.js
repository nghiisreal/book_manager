/* eslint-disable multiline-ternary */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
// Thư viện thêm số liệu lên biểu đồ
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ChartBarCustomer() {
  // Lấy tháng hiện tại
  const [inputMonth, setInputMonth] = useState(new Date().getMonth() + 1);
  // Lấy năm hiện tại
  const [inputYear, setInputYear] = useState(new Date().getFullYear());
  // Top khách hàng
  const [selectedCount, setSelectedCount] = useState(3);
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    getChartData();
  }, [selectedCount]);
  const getChartData = async () => {
    try {
      if (!inputYear && !inputMonth && !selectedCount) return; // nếu inputYear, month, count không có giá trị thì không gọi API
      const result = await axios.get(
        `https://localhost:7208/api/Statistics/GetTopCustomers/TopCustomers?month=${inputMonth}&year=${inputYear}&count=${selectedCount}`
      );
      if (result.data) {
        setChartData(result.data);
      } else {
        // Xử lý trường hợp không có dữ liệu
        setChartData(null);
        // console.log('Không có dữ liệu tương ứng');
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };
  const handleInputYearChange = (e) => {
    e.preventDefault();
    setInputYear(e.target.value);
  };
  const handleInputMonthChange = (e) => {
    e.preventDefault();
    setInputMonth(e.target.value);
  };
  const handleInputChange = (e) => {
    e.preventDefault();
    setSelectedCount(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'a') {
      // Cho phép người dùng sử dụng tổ hợp phím Ctrl + A để chọn toàn bộ nội dung trong trường nhập liệu
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      // Cho phép người dùng sử dụng tổ hợp phím Ctrl + C
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'v') {
      // Cho phép người dùng sử dụng tổ hợp phím Ctrl + V
      return;
    }
    if (
      isNaN(Number(e.key)) &&
      !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete'].includes(e.key)
    ) {
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      getChartData();
    }
  };
  return (
    <>
      <div className="text-end">
        <span>Tháng: </span>
        <input
          type="text"
          className="input__statis mt-2 me-2 text-center"
          value={inputMonth}
          onChange={handleInputMonthChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tháng"
        />
        <span>Năm: </span>
        <input
          type="text"
          className="input__statis mt-2 me-3 text-center"
          value={inputYear}
          onChange={handleInputYearChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập năm"
        />
        <select
          onChange={handleInputChange}
          name="count"
          className="mt-2 me-3"
          required
          defaultValue="3"
          style={{ width: '6vw', padding: '1px 2px' }}>
          <option value="3">Top 3</option>
          <option value="5">Top 5</option>
          <option value="7">Top 7</option>
          <option value="10">Top 10</option>
        </select>
      </div>
      {chartData ? (
        <Bar
          data={{
            labels: chartData.map((customer) => customer.customer_name),
            datasets: [
              {
                label: `Top ${selectedCount} khách hàng mua nhiều đơn hàng nhất`,

                backgroundColor: 'rgba(255, 48, 83,0.4)',
                borderColor: 'rgba(255, 48, 83,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(255, 48, 83,0.6)',
                hoverBorderColor: 'rgba(255, 48, 83,1)',
                data: chartData.map((item) => item.total_orders)
              }
            ]
          }}
          options={{
            layout: {
              padding: 50
            },
            plugins: {
              datalabels: {
                display: true,
                color: 'black',
                font: {
                  size: 14
                },
                formatter: (value, context) => {
                  return value; // Hiển thị số lượng và đơn vị 'cuốn'
                },
                anchor: 'center', // Vị trí của số liệu trên mỗi phần tử
                align: 'start' // Căn chỉnh vị trí của số liệu trên mỗi phần tử ('start', 'center', 'end')
              },
              legend: {
                labels: {
                  font: {
                    size: 18
                  },
                  boxPadding: 0
                }
              }
            },
            maintainAspectRatio: false,
            scales: {
              y: {
                ticks: {
                  beginAtZero: true
                }
              }
            },
            title: {
              display: true,
              text: 'Top khách hàng mua nhiều đơn hàng nhất theo từng tháng năm 2023'
            },
            // barThickness là độ rộng của các cột, maxBarThickness là độ rộng tối đa của cột
            barThickness: 40,
            maxBarThickness: 40
          }}
          height={200}
          width={400}
          plugins={[ChartDataLabels]}
        />
      ) : (
        <div className="ms-2">Không có dữ liệu...</div>
      )}
    </>
  );
}
