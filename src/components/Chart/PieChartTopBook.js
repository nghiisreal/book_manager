/* eslint-disable multiline-ternary */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
// Thư viện thêm số liệu lên biểu đồ
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChartTopBook() {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    getChartData();
  }, []);
  const getChartData = async () => {
    try {
      const result = await axios.get(
        'https://localhost:7208/api/Statistics/GetTopSellingBooks/TopSellingBooks'
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
  return (
    <>
      {chartData ? (
        <Pie
          data={{
            labels: chartData.map((item) => item.title),
            datasets: [
              {
                label: 'Số lượng mua',
                data: chartData.map((item) => item.total_quantity),
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(165, 185, 66, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(165, 185, 66, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
              }
            ]
          }}
          options={{
            layout: {
              padding: 20
            },
            plugins: {
              datalabels: {
                display: true,
                color: 'black',
                font: {
                  size: 12
                },
                formatter: (value, context) => {
                  return value + ' cuốn'; // Hiển thị số lượng và đơn vị 'cuốn'
                },
                anchor: 'end', // Đặt vị trí label ở cuối
                align: 'start', // Căn chỉnh label theo chiều ngang
                offset: 8 // Khoảng cách giữa pie chart và label bên ngoài
              },
              title: {
                display: true,
                text: 'Top 5 cuốn sách bán chạy',
                font: {
                  size: 20
                }
              },
              legend: {
                labels: {
                  // This more specific font property overrides the global property
                  font: {
                    size: 12
                  }
                }
              }
            },
            maintainAspectRatio: false
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
