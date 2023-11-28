/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Table } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

import Select from 'react-select';
import Modal from '../../Modal/Modal';
import axios from 'axios';
import '../../Add/addItem.css';
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#80bdff' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : provided.boxShadow
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px', // giới hạn chiều cao của menu
    overflowY: 'auto' // hiển thị thanh cuộn khi quá dài
  })
};
const bookStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '50px',
    borderColor: state.isFocused ? '#80bdff' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0, 123, 255, 0.25)' : provided.boxShadow
  }),

  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px', // giới hạn chiều cao của menu
    overflowY: 'auto' // hiển thị thanh cuộn khi quá dài
  })
};
export default function UpdateOrder(props) {
  const history = useHistory();
  const params = useParams();
  const [optionsCustomer, setOptionsCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [optionsBook, setOptionsBook] = useState([]);
  const [selectedBook, setSelectedBook] = useState([]);
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [orderItems, setOrderItems] = useState([{}]);
  const selectRef = useRef(null);
  // Tính tổng tiền
  const [totalPrice, setTotalPrice] = useState(0);
  const [state, setState] = useState({
    order_id: '',
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_email: '',
    order_date: '',
    payment: '',
    status: '',
    total_price: 0,
    orderItems: []
  });
  const [notice, setNotice] = useState('');
  const loadData = async () => {
    try {
      // categories, publishers, authors, book
      const [customers, books, order] = await Promise.all([getCustomer(), getBook(), getOrderId()]);
      // console.log(order.order_id);
      const optionsCustomer = customers.map((c) => ({
        value: c.id,
        label: c.customer_name
      }));
      const optionsBook = books.map((b) => ({
        value: b.book_id,
        label: b.book_title,
        book_quantity: b.book_quantity,
        book_price: b.book_price
      }));
      setOptionsBook(optionsBook);
      setSelectedBook(
        optionsBook.filter((b) => order.orderItems.some((item) => item.book_id === b.value)) || null
      );
      // console.log(optionsCustomer);
      // console.log(optionsBook);
      setOptionsCustomer(optionsCustomer);
      // console.log(optionsCustomer);
      setOptionsCustomer(optionsCustomer);
      setSelectedCustomer(optionsCustomer.find((c) => c.value === order.customer_id) || null);
      // console.log(order.customer_id);
      // console.log(selectedCustomer);

      // console.log(selectedBook);
      setState({
        order_id: order.order_id,
        customer_id: order.customer_id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        customer_address: order.customer_address,
        customer_email: order.customer_email,
        order_date: order.order_date,
        payment: order.payment,
        status: order.status,
        total_price: order.total_price,
        orderItems: order.orderItems.map((orderItem) => ({
          book_id: orderItem.book_id,
          quantity: orderItem.quantity
        }))
      });

      const newOrderItems = order.orderItems.map((item) => ({
        book_id: item.book_id,
        quantity: item.quantity
      }));

      setOrderItems(newOrderItems);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const getCustomer = async () => {
    try {
      const result = await axios.get(`https://localhost:7208/api/Customers/GetCustomersAll?page=0`);
      return result.data.result;
      // console.log(result.data.result);
    } catch (err) {
      console.log(err.response.data);
      return {};
    }
  };
  const getBook = async () => {
    try {
      const result = await axios.get(`https://localhost:7208/api/Books/GetBooksAll?page=0`);
      return result.data.result;
      // console.log(result.data.result);
    } catch (err) {
      console.log(err.response.data);
      return {};
    }
  };
  const getOrderId = async () => {
    try {
      const id = params.id;
      const result = await axios.get(
        `https://localhost:7208/api/Orders/GetOrderWithOrderItems/${id}`
      );
      // console.log(result.data);
      return result.data;
    } catch (err) {
      console.log(err.response.data);
      return {};
    }
  };

  // Không render lại quá nhiều lần
  useEffect(() => {
    calculateTotalPrice();
  }, [
    orderItems,
    selectedBookIds,
    optionsBook,
    selectedCustomer,
    selectedBook,
    state.order_id,
    state.orderItems.quantity
  ]);

  // console.log(optionsCustomer);
  // Khi người dùng chọn một giá trị khác trên Select component
  const handleCustomerChange = (selectedOption) => {
    // console.log(selectedOption);
    setSelectedCustomer(selectedOption);
    setState((prevState) => ({
      ...prevState,
      customer_id: selectedOption ? selectedOption.value : null,
      customer_name: selectedOption ? selectedOption.label : null,
      // Lấy giá trị của trường customer_phone từ selectedOption
      customer_phone: selectedOption ? selectedOption.phone : null,
      customer_address: selectedOption ? selectedOption.address : null,
      customer_email: selectedOption ? selectedOption.email : null
    }));
  };

  // console.log(state);
  // Lọc khi điền vào Select
  const filterOptionCustomer = (option, inputValueCustomer) => {
    return option.label.toLowerCase().includes(inputValueCustomer.toLowerCase());
  };

  // console.log(customQuantity);
  const handleBookChange = (selectedOption, index) => {
    // Tạo một mảng chứa tất cả các book_id đã có trong đơn hàng cũ
    const selectedBookIdsFromOrder = state.orderItems.map((orderItem) => orderItem.book_id);

    // Kiểm tra selectedOption.value đã tồn tại trong selectedBookIdsFromOrder chưa
    if (selectedBookIdsFromOrder.includes(selectedOption.value)) {
      alert('Bạn đã chọn sách này cho đơn hàng cũ');
      selectRef.current.select.clearValue(); // Reset giá trị của select box
      return;
    }

    // Cập nhật selectedBook và selectedBookIds cho dòng mới được thêm vào
    setSelectedBook((prevSelectedBook) => ({ ...prevSelectedBook, [index]: selectedOption }));
    setSelectedBookIds((prevSelectedBookIds) => {
      const newSelectedBookIds = [...prevSelectedBookIds];
      newSelectedBookIds[index] = selectedOption.value;
      return newSelectedBookIds;
    });

    const newOrderItems = [...orderItems];
    const bookQuantity = selectedOption ? selectedOption.book_quantity : 0;

    if (bookQuantity === 0) {
      newOrderItems[index] = {
        ...newOrderItems[index],
        book_id: selectedOption.value,
        quantity: null,
        disabled: bookQuantity === 0 // set disabled nếu bookQuantity bằng 0
      };
      alert('Sản phẩm này đã hết hàng!');
      selectRef.current.select.clearValue(); // Reset giá trị của select box
      return;
    } else {
      newOrderItems[index] = {
        ...newOrderItems[index],
        book_id: selectedOption.value,
        quantity: newOrderItems[index].quantity
      };
    }
    setOrderItems(newOrderItems);
    setState((prevState) => ({
      ...prevState,
      orderItems: newOrderItems
    }));
  };
  // console.log(state);
  // console.log(orderItems);
  // console.log(selectedBook);
  // console.log(optionsBook[1].book_quantity);
  // Lọc khi điền vào Select
  const filterOptionBook = (option, inputValueBook) => {
    return option.label.toLowerCase().includes(inputValueBook.toLowerCase());
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;

    if (name === 'order_date') {
      // Chuyển đổi định dạng ngày-tháng-năm
      const date = new Date(value);
      formattedValue = format(date, 'dd-MM-yyyy');
    }

    setState((prevState) => ({
      ...prevState,
      [name]: formattedValue
    }));
    // console.log(name, value);
  };
  const handleInputQuantityChange = (event, index) => {
    const newOrderItems = [...orderItems];
    // console.log(newOrderItems[index].quantity);
    const value = parseInt(event.target.value);
    newOrderItems[index] = {
      ...newOrderItems[index],
      quantity: value
    };

    setOrderItems(newOrderItems);
    setState((prevState) => ({
      ...prevState,
      orderItems: newOrderItems
    }));
    // console.log(value);
  };
  const [numRows, setNumRows] = useState(state.orderItems.length); // Khởi tạo state numRows với giá trị ban đầu là 1
  const addNewRow = () => {
    setState((prevState) => ({
      ...prevState,
      orderItems: [
        ...prevState.orderItems,
        {
          book_id: null,
          quantity: 1
        }
      ]
    }));
    setOrderItems([...orderItems, { book_id: null, quantity: 1 }]);
    // Tạo mảng selectedBookIds từ những book_id đã được chọn
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setNumRows(numRows + 1); // Tăng số lượng dòng hiện có lên 1
    addNewRow();
  };
  // console.log(state);
  // console.log(orderItems);
  const handleRemoveProduct = (index) => (e) => {
    e.preventDefault();
    // console.log(orderItems);
    const newOrderItems = [...orderItems];
    const removedOrderItem = newOrderItems[index];
    // console.log(removedOrderItem);
    // Xóa dòng trắng

    const removedBookId = newOrderItems[index].book_id;

    // Kiểm tra nếu dòng này có book_id thì mới cập nhật options cho Select
    if (removedBookId) {
      // Cập nhật mảng lưu trữ các book_id đã được chọn
      const newSelectedBookIds = selectedBookIds.filter(
        (selectedBookId) => selectedBookId !== removedBookId
      );
      setSelectedBookIds(newSelectedBookIds);

      // Cập nhật options cho Select
      const options = [...optionsBook];
      const removedOptionIndex = options.findIndex((option) => option.value === removedBookId);

      options[removedOptionIndex].isDisabled = false; // Bỏ disable option đã bị disable
      setOptionsBook([...options]);
    }
    // xóa dòng trống thông tin
    newOrderItems.splice(index, 1);
    setOrderItems(newOrderItems);

    setState((prevState) => ({
      ...prevState,
      orderItems: newOrderItems
    }));
  };
  // Tính tổng tiền đơn hàng
  const calculateTotalPrice = () => {
    const totalPriceByBook = {};
    orderItems.forEach((item) => {
      const quantity = item.quantity || 0;
      const bookId = item.book_id;
      const book = optionsBook?.find((book) => book.value === bookId);
      const price = book ? book.book_price : 0;
      if (bookId) {
        totalPriceByBook[bookId] = totalPriceByBook[bookId] || 0;
        totalPriceByBook[bookId] += quantity * price;
      }
    });
    let total = 0;
    Object.keys(totalPriceByBook).forEach((bookId) => {
      total += totalPriceByBook[bookId];
    });
    // console.log(total);
    setTotalPrice(total);
    setState((prevState) => ({
      ...prevState,
      total_price: total
    }));
  };
  const validate = () => {
    const mess = {};

    // Tên khách hàng
    if (selectedCustomer === null) {
      mess.customer_name = 'Vui lòng nhập tên khách hàng';
    }
    if (state.status === '') {
      mess.status = 'Vui lòng chọn tình trạng đơn hàng';
    }
    if (selectedBook === null) {
      mess.orderItem = 'Vui lòng nhập sản phẩm';
    }
    setNotice(mess);
    console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  // console.log(state);
  const updateOrder = async (e) => {
    e.preventDefault();
    const id = params.id;
    const isValid = validate();
    if (!isValid) {
      return true;
    }
    // kiểm tra để loại bỏ những orderItem không có thông tin sản phẩm trước khi gửi request PUT lên server
    const cleanOrderItems = orderItems.filter((item) => {
      return (
        // các trường hợp ko id, ko số lượng, ko nhập số lượng
        item.book_id && item.quantity !== null && !isNaN(item.quantity)
      );
    });

    try {
      await axios.put(`https://localhost:7208/api/Orders/Updateid/${id}`, {
        order_id: state.order_id,
        customer_id: state.customer_id,
        order_date: state.order_date,
        payment: state.payment,
        status: state.status,
        orderItems: cleanOrderItems
      });

      history.push('/home/orders');
    } catch (err) {
      alert(err.response.data);
    }
  };
  const renderTableRows = () => {
    return state.orderItems.map((orderItem, index) => {
      const selectBook = optionsBook.find((option) => option?.value === orderItem.book_id) || null;
      const bookQuantity = selectBook ? selectBook.book_quantity : '--';
      const bookPrice = selectBook ? selectBook.book_price : '--';
      // console.log(selectedBook);
      // console.log(orderItem);
      // console.log(optionsBook);
      // console.log(index);
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td
            style={{
              minHeight: '50px',
              lineHeight: '20px',
              minWidth: '10vw'
            }}>
            <Select
              key={index}
              ref={selectRef}
              id={`inputOrderBook_${index}`}
              placeholder="Sản phẩm..."
              filterOption={filterOptionBook}
              // isDisabled của option sẽ được set thành true nếu book_id của option đó đã có trong selectedBookIds, và false nếu không có
              options={optionsBook.map((option) => ({
                ...option,
                isDisabled: selectedBookIds.includes(option.value)
              }))}
              styles={bookStyles}
              // Cho menu list nằm ra ngoài table cho dễ chọn lựa
              menuPortalTarget={document.body}
              value={selectBook}
              onChange={(selectedOption) => handleBookChange(selectedOption, index)} // Xử lý khi người dùng chọn giá trị khác
              required
            />

            <p className="text-danger">{notice.orderItem}</p>
          </td>

          {state.orderItems.length === 0 ? (
            <td style={{ width: '120px' }}>
              <input
                type="tel"
                style={{
                  height: '50px',
                  lineHeight: '50px',
                  width: '60px',
                  margin: 'auto'
                }}
                className="form-control"
                id={`inputQuantity${index}`}
                name="quantity"
                aria-describedby="quantityHelp"
                disabled></input>
            </td>
          ) : (
            <td style={{ width: '120px' }}>
              <input
                type="tel"
                style={{
                  height: '50px',
                  lineHeight: '50px',
                  width: '60px',
                  margin: 'auto'
                }}
                className="form-control"
                id={`inputQuantity${index}`}
                name="quantity"
                aria-describedby="quantityHelp"
                pattern="[0-9]{1,3}"
                maxLength={3}
                value={orderItems[index]?.quantity || ''}
                onChange={(event) => handleInputQuantityChange(event, index)}
                disabled={orderItems[index].disabled} // thêm thuộc tính disabled
                onKeyDown={(event) => {
                  if (event.ctrlKey && event.key.toLowerCase() === 'a') {
                    // Cho phép người dùng sử dụng tổ hợp phím Ctrl + A để chọn toàn bộ nội dung trong trường nhập liệu
                    return;
                  }
                  if (event.ctrlKey && event.key.toLowerCase() === 'c') {
                    // Cho phép người dùng sử dụng tổ hợp phím Ctrl + C
                    return;
                  }
                  if (event.ctrlKey && event.key.toLowerCase() === 'v') {
                    // Cho phép người dùng sử dụng tổ hợp phím Ctrl + V
                    return;
                  }
                  if (
                    isNaN(Number(event.key)) &&
                    !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete'].includes(event.key)
                  ) {
                    event.preventDefault();
                  }
                }}></input>
            </td>
          )}

          <td id={`bookQuantity_${index}`}>{bookQuantity}</td>
          <td id={`bookPrice_${index}`}>
            {' '}
            {bookPrice.toLocaleString('it-IT', {
              style: 'currency',
              currency: 'VND'
            })}
          </td>

          <td>
            <button onClick={handleRemoveProduct(index)} className="btn btn-dark m-0">
              <i className="fa fa-times"></i>
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span
            className="navbar-brand mb-0 h1"
            style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            Cập nhật đơn hàng có mã: {params.id}
          </span>
        </div>
      </nav>

      <h1 className="text-center">
        {' '}
        <i className="fa fa-money-check-alt"></i>
      </h1>

      <div>
        <form onSubmit={updateOrder} id="formAddOrder">
          <div className="container mb-3 mt-3 text-start">
            <div className="row">
              <div className="col-6 mt-2">
                <label htmlFor="orderID" className="form-label">
                  <b>Mã đơn hàng</b>
                </label>
                <input
                  type="text"
                  className="form-control text-center"
                  id="orderID"
                  name="order_id"
                  aria-describedby="orderIDHelp"
                  placeholder="Mã đơn hàng..."
                  value={state.order_id}
                  disabled
                  readOnly
                />
                <p className="text-danger">{}</p>
                <label htmlFor="inputCustomerName" className="form-label">
                  Tên khách hàng <span className="text-danger">(*)</span>
                </label>
                <Select
                  id="inputCustomerName"
                  placeholder="Tên khách hàng..."
                  filterOption={filterOptionCustomer}
                  options={optionsCustomer}
                  styles={customStyles}
                  value={selectedCustomer} // Set giá trị mặc định cho Select component
                  onChange={handleCustomerChange} // Xử lý khi người dùng chọn giá trị khác
                  required
                />
                <p className="text-danger">{notice.customer_name}</p>

                <label htmlFor="inputAddress" className="form-label">
                  Địa chỉ <span className="text-danger">(*)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputAddress"
                  name="customer_address"
                  aria-describedby="addressHelp"
                  placeholder="Địa chỉ..."
                  value={state.customer_address || ''} // set giá trị của address vào input
                  onChange={(event) => {
                    setState((prevState) => ({
                      ...prevState,
                      customer_address: event.target.value
                    }));
                  }}
                  disabled
                  readOnly
                />
              </div>
              <div className="col-6 mt-2">
                <label htmlFor="inputPhone" className="form-label">
                  Số điện thoại <span className="text-danger">(*)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputPhone"
                  name="customer_phone"
                  aria-describedby="phoneHelp"
                  placeholder="Số điện thoại..."
                  value={state.customer_phone || ''} // set giá trị của phone vào input
                  onChange={(event) => {
                    setState((prevState) => ({
                      ...prevState,
                      customer_phone: event.target.value
                    }));
                  }}
                  disabled
                  readOnly
                />
                <p className="text-danger">{}</p>
                <label htmlFor="inputEmail" className="form-label">
                  Email <span className="text-danger">(*)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inputEmail"
                  name="customer_email"
                  aria-describedby="emailHelp"
                  placeholder="Email..."
                  value={state.customer_email || ''} // set giá trị của email vào input
                  onChange={(event) => {
                    setState((prevState) => ({
                      ...prevState,
                      customer_email: event.target.value
                    }));
                  }}
                  disabled
                  readOnly
                />
                <p className="text-danger">{}</p>
                <div className="row">
                  {' '}
                  <div className="col-6">
                    <label htmlFor="inputOrderStatus" className="form-label">
                      Tình trạng đơn hàng <span className="text-danger">(*)</span>
                    </label>
                    <div className="select">
                      <select
                        id="orderStatus-select"
                        onChange={handleInputChange}
                        name="status"
                        required
                        style={{ fontWeight: 600, color: 'black' }}
                        defaultValue="Đang xử lý"
                        disabled>
                        <option value="Đang xử lý">Đang xử lý</option>
                      </select>
                      <p className="text-danger">{notice.status}</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <label htmlFor="inputPayment" className="form-label">
                      Thanh toán <span className="text-danger">(*)</span>
                    </label>
                    <div className="select">
                      <select
                        id="payment-select"
                        onChange={handleInputChange}
                        name="payment"
                        required
                        style={{ fontWeight: 600, color: 'black' }}
                        defaultValue="Chưa thanh toán">
                        <option value="Chưa thanh toán">Chưa thanh toán</option>
                        <option value="Đã thanh toán">Đã thanh toán</option>
                      </select>
                      <p className="text-danger">{notice.payment}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="d-flex justify-content-end mb-2 text-danger">
                <b>Tổng tiền: </b>{' '}
                <span className="ms-2">
                  {totalPrice.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND'
                  })}
                </span>
              </p>

              <div
                className="col-12 mt-1"
                style={{
                  height: '400px',
                  overflowY: 'auto'
                }}>
                <Table striped bordered hover style={{ marginBottom: '5px' }}>
                  <thead style={{ backgroundColor: '#cfe2ff' }}>
                    <tr>
                      <th>#</th>
                      <th>Sản phẩm</th>
                      <th>Số lượng đặt</th>
                      <th>Số lượng kho</th>
                      <th>Giá tiền</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>{renderTableRows()}</tbody>
                  <button onClick={handleAddProduct} className="btn btn-dark mt-4">
                    <i className="fa fa-plus"></i>
                  </button>
                </Table>
              </div>

              <div className="col-12">
                <div className="d-flex justify-content-evenly">
                  <button
                    type="button"
                    className="btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    <i className="fa fa-arrow-left"></i>
                  </button>
                  <button type="reset" className="btn btn-danger">
                    <i className="fa fa-sync"></i>
                  </button>
                  <button type="submit" className="btn btn-primary" onClick={updateOrder}>
                    <i className="fa fa-save"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Modal />
    </>
  );
}
