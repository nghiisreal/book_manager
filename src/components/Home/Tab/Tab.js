/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Statistic from '../Statistic/Statistic';
import BookTable from '../Book/BookTable';
import AuthorTable from '../Author/AuthorTable';
import CategoryTable from '../Category/CategoryTable';
import PublisherTable from '../Publisher/PublisherTable';
import './Tab.css';
import { NavLink, useHistory } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import OrderTable from '../Order/OrderTable';
import CustomerTable from '../Customer/CustomerTable';
import ShippingTable from '../Shipping/ShippingTable';
import InventoryTable from '../Inventory/InventoryTable';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
function Tab(props) {
  const location = useLocation();
  const [role, setRole] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      const role = decodedToken.role; // lấy role từ token api
      setRole(role); // Lưu role vào state
    }
  }, []);
  const history = useHistory();

  // Kiểm tra thời gian hết hạn của token
  useEffect(() => {
    const checkTokenExp = () => {
      const token = localStorage.getItem('token');
      const expTime = localStorage.getItem('expTime');

      if (token && expTime) {
        const nowTime = new Date().getTime();
        const expirationTime = new Date(expTime * 1000).getTime(); // Format lại đúng định dạng thời gian dd/mm/yyy h:m:s
        // console.log(nowTime >= expirationTime);
        if (nowTime > expirationTime) {
          // Token hết hạn tự động remove ở token ở LocalStogare
          localStorage.removeItem('token');
          localStorage.removeItem('expTime');
          history.push('/');
        }
      }
    };

    checkTokenExp();
  }, [history]);
  const handleClick = () => {
    window.location.reload();
  };
  return (
    <div>
      <div className="d-flex align-items-start">
        <div className="col-2">
          <div
            className="nav flex-column nav-pills me-3 side__Bar"
            id="v-pills-tab"
            role="tablist"
            aria-orientation="vertical">
            {/* Gắn class active cho mỗi nút khi click */}

            <div className="mt-5">
              {/* Hiển thị nút Thống kê cho tất cả các role */}
              {role !== 'Người vận chuyển' ? (
                <button
                  className={`nav-link ${
                    location.pathname === '/home' ? 'active' : ''
                  } ms-3 text-start py-0 px-0`}
                  id="v-pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-home"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-home"
                  aria-selected="true"
                  onClick={handleClick}>
                  <NavLink className="tab__nav" to="/home">
                    <i className="fa fa-chart-area mx-1" /> <span>Thống kê</span>
                  </NavLink>
                </button>
              ) : (
                <></>
              )}

              {/* Hiển thị nút Loại sách nếu người dùng là Thủ kho */}
              {role === 'Quản trị viên' || role === 'Quản lý kho' ? (
                <>
                  <button
                    className={`nav-link ${
                      location.pathname === '/home/categories' ? 'active' : ''
                    } ms-3 text-start py-0 px-0`}
                    id="v-pills-category-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-category"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-category"
                    aria-selected="false">
                    <NavLink className="tab__nav" to="/home/categories">
                      <i className="fa fa-layer-group mx-1"></i> <span>Loại sách</span>
                    </NavLink>
                  </button>
                  <button
                    className={`nav-link ${
                      location.pathname === '/home/authors' ? 'active' : ''
                    } ms-3 text-start py-0 px-0`}
                    id="v-pills-author-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-author"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-author"
                    aria-selected="false">
                    <NavLink className="tab__nav" to="/home/authors">
                      <i className="fa fa-user-tie mx-1"></i> <span>Tác giả</span>
                    </NavLink>
                  </button>
                  <button
                    className={`nav-link ${
                      location.pathname === '/home/publishers' ? 'active' : ''
                    } ms-3 text-start py-0 px-0`}
                    id="v-pills-publisher-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-publisher"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-publisher"
                    aria-selected="false">
                    <NavLink className="tab__nav" to="/home/publishers">
                      <i className="fa fa-bookmark mx-1"></i> <span>Nhà xuất bản</span>
                    </NavLink>
                  </button>
                  <button
                    className={`nav-link ${
                      location.pathname === '/home/books' ? 'active' : ''
                    } ms-3 text-start py-0 px-0`}
                    id="v-pills-book-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-book"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-book"
                    aria-selected="false">
                    <NavLink className="tab__nav" to="/home/books">
                      <i className="fa fa-book mx-1"></i> <span>Sách</span>
                    </NavLink>
                  </button>
                  <button
                    className={`nav-link ${
                      location.pathname === '/home/inventory' ? 'active' : ''
                    } ms-3 text-start py-0 px-0`}
                    id="v-pills-inventory-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-inventory"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-inventory"
                    aria-selected="false">
                    <NavLink className="tab__nav" to="/home/inventory">
                      <i className="fa fa-city mx-1"></i> <span>Kho sách</span>
                    </NavLink>
                  </button>
                </>
              ) : (
                <></>
              )}
              {role === 'Quản trị viên' || role === 'NV bán hàng' ? (
                <>
                  <button
                    className={`nav-link ${
                      location.pathname === '/home/customers' ? 'active' : ''
                    } ms-3 text-start py-0 px-0`}
                    id="v-pills-customer-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-customer"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-customer"
                    aria-selected="false">
                    <NavLink className="tab__nav" to="/home/customers">
                      <i className="fa fa-user-friends mx-1"></i> <span>Khách hàng</span>
                    </NavLink>
                  </button>
                  <button
                    className={`nav-link ${
                      location.pathname === '/home/orders' ? 'active' : ''
                    } ms-3 text-start py-0 px-0`}
                    id="v-pills-order-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-order"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-order"
                    aria-selected="false"
                    onClick={handleClick}>
                    <NavLink className="tab__nav" to="/home/orders">
                      <i className="fa fa-money-check-alt mx-1"></i> <span>Đơn hàng</span>
                    </NavLink>
                  </button>
                </>
              ) : (
                <></>
              )}
              {role === 'Quản trị viên' || role === 'Người vận chuyển' ? (
                <button
                  className={`nav-link ${
                    location.pathname === '/home/shipping' ? 'active' : ''
                  } ms-3 text-start py-0 px-0`}
                  id="v-pills-shipping-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#v-pills-shipping"
                  type="button"
                  role="tab"
                  aria-controls="v-pills-shipping"
                  aria-selected="false"
                  onClick={handleClick}>
                  <NavLink className="tab__nav" to="/home/shipping">
                    <i className="fa fa-truck-moving mx-1" />
                    <span>Vận chuyển</span>
                  </NavLink>
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="col-10">
          <div className="tab-content mt-5 mx-0" id="v-pills-tabContent">
            {role !== 'Người vận chuyển' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-home"
                role="tabpanel"
                aria-labelledby="v-pills-home-tab">
                <Statistic />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-home"
                role="tabpanel"
                aria-labelledby="v-pills-home-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'Quản lý kho' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/categories' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-category"
                role="tabpanel"
                aria-labelledby="v-pills-category-tab">
                <CategoryTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/categories' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-category"
                role="tabpanel"
                aria-labelledby="v-pills-category-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'Quản lý kho' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/authors' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-author"
                role="tabpanel"
                aria-labelledby="v-pills-author-tab">
                <AuthorTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/authors' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-author"
                role="tabpanel"
                aria-labelledby="v-pills-author-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'Quản lý kho' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/publishers' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-publisher"
                role="tabpanel"
                aria-labelledby="v-pills-publisher-tab">
                <PublisherTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/publishers' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-publisher"
                role="tabpanel"
                aria-labelledby="v-pills-publisher-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'Quản lý kho' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/books' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-book"
                role="tabpanel"
                aria-labelledby="v-pills-book-tab">
                <BookTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/books' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-book"
                role="tabpanel"
                aria-labelledby="v-pills-book-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'Quản lý kho' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/inventory' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-inventory"
                role="tabpanel"
                aria-labelledby="v-pills-inventory-tab">
                <InventoryTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/inventory' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-inventory"
                role="tabpanel"
                aria-labelledby="v-pills-inventory-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'NV bán hàng' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/customers' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-customer"
                role="tabpanel"
                aria-labelledby="v-pills-customer-tab">
                <CustomerTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/customers' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-customer"
                role="tabpanel"
                aria-labelledby="v-pills-customer-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'NV bán hàng' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/orders' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-order"
                role="tabpanel"
                aria-labelledby="v-pills-order-tab">
                <OrderTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/orders' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-order"
                role="tabpanel"
                aria-labelledby="v-pills-order-tab">
                Không có quyền truy cập
              </div>
            )}
            {role === 'Quản trị viên' || role === 'Người vận chuyển' ? (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/shipping' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-shipping"
                role="tabpanel"
                aria-labelledby="v-pills-shipping-tab">
                <ShippingTable />
              </div>
            ) : (
              <div
                className={`tab-pane ${
                  location.pathname === '/home/shipping' ? 'active' : ''
                } fade show me-2`}
                id="v-pills-shipping"
                role="tabpanel"
                aria-labelledby="v-pills-shipping-tab">
                Không có quyền truy cập
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default React.memo(Tab);
