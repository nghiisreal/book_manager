/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import Select from 'react-select';
import Modal from '../../Modal/Modal';
import '../addItem.css';
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
export default function AddOrder(props) {
  const history = useHistory();
  const [optionsCustomer, setOptionsCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [optionsBook, setOptionsBook] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [orderItems, setOrderItems] = useState([{}]);
  // Tính tổng tiền
  const [totalPrice, setTotalPrice] = useState(0);
  const [state, setState] = useState({
    order_id: '',
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    customer_address: '',
    customer_email: '',
    payment: 'Chưa thanh toán',
    status: 'Đang xử lý',
    total_price: 0,
    orderItems: []
  });
  const [notice, setNotice] = useState('');

  // Load dữ liệu khách hàng lên
  const loadOptionsCustomer = async (inputValueCustomer, callback) => {
    try {
      const result = await axios.get('https://localhost:7208/api/Customers/GetCustomersAll?page=0');
      const optionsData = result.data.result.map((option) => ({
        // Load dữ liệu các truòng thông tin tương ứng
        label: option.customer_name,
        value: option.id,
        phone: option.customer_phone,
        address: option.customer_address,
        email: option.customer_email
      }));
      setOptionsCustomer(optionsData);
      callback(optionsData);
    } catch (error) {
      console.log(error);
    }
  };
  // Load dữ liệu từ database lên
  useEffect(() => {
    getOrderId();
    loadOptionsCustomer('', (options) => setOptionsCustomer(options));
    loadOptionsBook('', (options) => setOptionsBook(options));
  }, []);
  // Không render lại quá nhiều lần
  useEffect(() => {
    calculateTotalPrice();
  }, [orderItems, selectedBookIds, optionsBook]);

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
  // Load dữ liệu sách lên
  const loadOptionsBook = async (inputValueBook, callback) => {
    try {
      const result = await axios.get('https://localhost:7208/api/Books/GetBooksAll?page=0');
      const optionsData = result.data.result.map((option) => ({
        label: option.book_title,
        value: option.book_id,
        book_price: option.book_price,
        book_quantity: option.book_quantity
      }));

      setOptionsBook(optionsData);
      callback(optionsData);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(customQuantity);
  const handleBookChange = (selectedOption, index) => {
    // console.log(selectedOption);
    setSelectedBook(selectedOption);
    // Lưu book_id của option được chọn vào mảng selectedBookIds

    // Tức là những book_id đã được select rồi thì sẽ không được chọn lại nữa
    const newSelectedBookIds = [...selectedBookIds];
    newSelectedBookIds[index] = selectedOption.value;
    setSelectedBookIds(newSelectedBookIds);

    const newOrderItems = [...orderItems];
    const bookQuantity = selectedOption ? selectedOption.book_quantity : 0;

    if (bookQuantity === 0) {
      newOrderItems[index] = {
        ...newOrderItems[index],
        book_id: selectedOption ? selectedOption.value : null,
        quantity: null,
        disabled: bookQuantity === 0 // set disabled nếu bookQuantity bằng 0
      };
      alert('Sản phẩm này đã hết hàng!');
    } else {
      newOrderItems[index] = {
        ...newOrderItems[index],
        book_id: selectedOption ? selectedOption.value : null,
        quantity: newOrderItems[index]?.quantity || 1 // gán giá trị mặc định là 1 nếu quantity là null hoặc undefined
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
  // console.log(optionsBook);
  // console.log(optionsBook[1].book_quantity);
  // Lọc khi điền vào Select
  const filterOptionBook = (option, inputValueBook) => {
    return option.label.toLowerCase().includes(inputValueBook.toLowerCase());
  };
  const getOrderId = async (e) => {
    try {
      const result = await axios.get('https://localhost:7208/api/Orders/GetNewOrderId');
      setState({
        ...state,
        order_id: result.data
      });
      // console.log(result);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
    // console.log(name, value);
  };
  const handleInputQuantityChange = (event, index) => {
    const newOrderItems = [...orderItems];
    // Lấy số lượng quyển sách trong kho
    const bookQuantity = selectedBook ? selectedBook.book_quantity : null;
    let value = parseInt(event.target.value);
    // So sánh xem sl nhập vào > số lượng trong kho
    if (value > bookQuantity) {
      // gán bằng số lượng kho
      value = parseInt(bookQuantity);
    }

    newOrderItems[index] = {
      ...newOrderItems[index],
      quantity: value
    };

    setOrderItems(newOrderItems);
    setState((prevState) => ({
      ...prevState,
      orderItems: newOrderItems
    }));
  };
  const [numRows, setNumRows] = useState(1); // Khởi tạo state numRows với giá trị ban đầu là 1

  const handleAddProduct = (e) => {
    e.preventDefault();
    setNumRows(numRows + 1); // Tăng số lượng dòng hiện có lên 1
    setOrderItems([...orderItems, { book_id: null, quantity: 1 }]);
  };
  const handleRemoveProduct = (index) => (e) => {
    e.preventDefault();
    // Xóa dòng trắng
    const newOrderItems = [...orderItems];
    newOrderItems.splice(index, 1);
    setOrderItems(newOrderItems);

    const removedBookId = newOrderItems[index].book_id;
    // Cập nhật mảng lưu trữ các book_id đã được chọn
    const newSelectedBookIds = selectedBookIds.filter(
      (selectedBookId) => selectedBookId !== removedBookId
    );
    setSelectedBookIds(newSelectedBookIds);

    // Cập nhật options cho Select
    const options = [...optionsBook];
    const removedOptionIndex = options.findIndex((option) => option.value === removedBookId);
    options[removedOptionIndex].isDisabled = false; // Bỏ disable option đã bị disable
    setOptionsBook(options);

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
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };

  const addOrder = async (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return true;
    }

    // console.log('Sending order data: ', {
    //     order_id: state.order_id,
    //     customer_name: state.customer_name,
    //     customer_phone: state.customer_phone,
    //     customer_address: state.customer_address,
    //     customer_email: state.customer_email,
    //     order_date: state.order_date,
    //     orderItems
    // });

    // kiểm tra để loại bỏ những orderItem không có thông tin sản phẩm trước khi gửi request POST lên server
    const cleanOrderItems = orderItems.filter((item) => {
      return (
        // các trường hợp ko id, ko số lượng, ko nhập số lượng
        item.book_id &&
        selectedBookIds.includes(item.book_id) &&
        item.quantity !== null &&
        !isNaN(item.quantity)
      );
    });
    try {
      await axios.post('https://localhost:7208/api/Orders/CreateNewOrder', {
        order_id: state.order_id,
        customer_name: state.customer_name,
        customer_phone: state.customer_phone,
        customer_address: state.customer_address,
        customer_email: state.customer_email,
        total_price: state.total_price,
        payment: state.payment,
        status: state.status,
        orderItems: cleanOrderItems
      });

      history.push('/home/orders');
    } catch (err) {
      console.log(err.response.data);
    }
  };
  // console.log(state);
  const renderTableRows = () => {
    return orderItems.map((orderItem, index) => {
      const selectBook = optionsBook.find((option) => option.value === orderItem.book_id);
      const bookQuantity = selectBook ? selectBook.book_quantity : '--';
      const bookPrice = selectBook ? selectBook.book_price : '--';

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
              value={
                orderItem.book_id
                  ? optionsBook.find((option) => option.value === orderItem.book_id)
                  : null
              }
              onChange={(selectedOption) => handleBookChange(selectedOption, index)} // Xử lý khi người dùng chọn giá trị khác
              loadOptions={loadOptionsBook}
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
                disabled={orderItems[index]?.disabled} // thêm thuộc tính disabled
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
            Thêm đơn hàng
          </span>
        </div>
      </nav>

      <h1 className="text-center">
        {' '}
        <i className="fa fa-money-check-alt"></i>
      </h1>
      <div>
        <form onSubmit={addOrder} id="formAddOrder">
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
                  loadOptions={loadOptionsCustomer}
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
                  maxheight: '400px',
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
                  <button type="submit" className="btn btn-primary" onClick={addOrder}>
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
