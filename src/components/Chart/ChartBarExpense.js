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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export default function ChartBarExpense() {
  // Lấy năm hiện tại
  const [inputYear, setInputYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    getChartData();
  }, [inputYear]);
  const getChartData = async () => {
    try {
      if (!inputYear) return; // nếu inputYear không có giá trị thì không gọi API
      const result = await axios.get(
        `https://localhost:7208/api/Statistics/GetTotalExpenseMonthYear/TotalExpenseMonthYear?year=${inputYear}`
      );
      if (result.data) {
        setChartData(result.data);
      } else {
        // Xử lý trường hợp không có dữ liệu
        setChartData(null);
        // console.log('Không có dữ liệu cho năm đã nhập');
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };
  // console.log(chartData);
  const handleInputChange = (e) => {
    e.preventDefault();
    // console.log(e.target.value);
    setInputYear(e.target.value);
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
        <span>Năm: </span>
        <input
          type="text"
          className="input__statis mt-2 me-3 text-center"
          value={inputYear}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Nhập năm"
        />
      </div>
      {/* kiểm tra chartData, chartData.monthRevenue và chartData.monthRevenue.length trước khi truy cập thuộc tính year và hiển thị biểu đồ */}
      {chartData && chartData.length > 0 ? (
        <Bar
          data={{
            labels: chartData.map((item) => {
              const month = item.month < 10 ? `0${item.month}` : item.month; // nếu tháng là số đơn vị thì thêm số 0 phía trước để đảm bảo nhãn có 2 ký tự
              return `${month}/${item.year}`;
            }),
            datasets: [
              {
                label: `Chi phí nhập kho theo từng tháng - ${chartData[0].year}`,
                backgroundColor: 'rgba(58,19,192,0.4)',
                borderColor: 'rgba(58,19,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(58,19,192,0.6)',
                hoverBorderColor: 'rgba(58,19,192,1)',
                data: chartData.map((item) => item.expense)
              }
            ]
          }}
          options={{
            layout: {
              padding: 50
            },
            plugins: {
              legend: {
                labels: {
                  // This more specific font property overrides the global property
                  font: {
                    size: 18
                  },
                  boxPadding: 0
                }
              }
            },
            maintainAspectRatio: false,
            scales: {
              yAxis: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            },
            title: {
              display: true,
              text: 'Chi phí nhập kho năm 2023'
            },
            // barThickness là độ rộng của các cột, maxBarThickness là độ rộng tối đa của cột
            barThickness: 40,
            maxBarThickness: 40
          }}
          // giảm kích thước của biểu đồ bằng cách giảm kích thước của thẻ canvas
          // ở đây giảm 30% so với kích thước mặc định
          height={200}
          width={400}
        />
      ) : (
        <div className="ms-2">Không có dữ liệu...</div>
      )}
    </>
  );
}
