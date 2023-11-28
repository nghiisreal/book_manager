/* eslint-disable no-unused-vars */
/* eslint-disable multiline-ternary */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
import React, { useEffect, useState } from 'react';
import Modal from '../../Modal/Modal';
import { Table } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

export default function AddInventory(props) {
  const history = useHistory();
  const params = useParams();
  const [state, setState] = useState({
    book_id: 0,
    book_title: '',
    quantity: 1,
    price: 0,
    totalPrice: 0
  });
  const [notice, setNotice] = useState('');
  const [ircID, setIrcID] = useState('');
  useEffect(() => {
    getIrcId();
  }, []);

  // console.log(state);
  const getIrcId = async (e) => {
    try {
      const result = await axios.get(
        'https://localhost:7208/api/InventoryReceipts/GetNewInventoryReceiptId'
      );
      setIrcID(result.data);
      // console.log(result);
    } catch (err) {
      alert(err.response.data);
    }
  };
  useEffect(() => {
    getBookId();
  }, [params.id]);
  // console.log(params.id);
  const getBookId = async () => {
    try {
      const id = params.id;

      const result = await axios.get(`https://localhost:7208/api/Books/GetBookId/${id}`);
      setState({
        ...state,
        book_id: result.data.book_id,
        book_title: result.data.book_title
      });
      // console.log(result);
    } catch (err) {
      alert(err.response.data);
    }
  };
  const validate = () => {
    const mess = {};

    // Tên khách hàng
    if (state.quantity === '') {
      mess.quantity = 'Vui lòng nhập số lượng sách';
    }
    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;
    // Kiểm tra số đầu tiên nếu là số 0
    if (name === 'quantity' && formattedValue.length === 1 && value[0] === '0') {
      formattedValue = '';
    }
    setState((prevState) => ({
      ...prevState,
      [name]: formattedValue
    }));
    // console.log(name, value);
  };
  const addInventory = async (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return true;
    }
    try {
      await axios.post('https://localhost:7208/api/InventoryReceipts/CreateInventoryReceipt', {
        irc_id: ircID,
        book_id: state.book_id,
        book_title: 'state.book_title',
        quantity: state.quantity,
        price: state.price,
        totalPrice: state.totalPrice
      });

      history.push('/home/inventory');
    } catch (err) {
      alert(err.response.data);
    }
  };
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span
            className="navbar-brand mb-0 h1"
            style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            Phiếu nhập kho
          </span>
        </div>
      </nav>

      <h1 className="text-center">
        {' '}
        <i className="fa fa-sticky-note" />
      </h1>
      <div>
        <form onSubmit={addInventory} id="formAddOrder">
          <div className="container mb-3 mt-3 text-center">
            <div className="row justify-content-center">
              <div className="col-12 mt-2 w-50">
                <label htmlFor="ircID" className="form-label">
                  <b>Mã phiếu nhập kho</b>
                </label>
                <input
                  type="text"
                  className="form-control text-center"
                  id="ircID"
                  name="irc_id"
                  aria-describedby="orderIDHelp"
                  placeholder="Mã phiếu nhập kho..."
                  value={ircID}
                  disabled
                  readOnly
                />
                <p className="text-danger">{}</p>
                <div className="d-flex justify-content-start">
                  <div className="col-9">
                    <label htmlFor="ircID" className="form-label">
                      <b>Tên sách</b>
                    </label>
                    <input
                      type="text"
                      className="form-control text-center"
                      id="ircID"
                      name="irc_id"
                      aria-describedby="orderIDHelp"
                      placeholder="Tên sách..."
                      value={state.book_title}
                      disabled
                      readOnly
                    />
                    <p className="text-danger">{}</p>
                  </div>
                  <div className="col-1">
                    <label htmlFor="ircQuantity" className="form-label">
                      <b>SL</b>
                    </label>
                    <input
                      type="tel"
                      style={{
                        height: '38px',
                        lineHeight: '38px',
                        width: '60px',
                        marginLeft: '3px'
                      }}
                      className="form-control"
                      name="quantity"
                      aria-describedby="ircQuantityHelp"
                      pattern="[0-9]{1,4}"
                      maxLength={4}
                      value={state.quantity}
                      onChange={handleInputChange}
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
                          !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete'].includes(
                            event.key
                          )
                        ) {
                          event.preventDefault();
                        }
                      }}></input>
                  </div>
                  <p className="text-danger">{notice.quantity}</p>
                  <div className="col-2 justify-content-end">
                    <label htmlFor="ircQuantity" className="form-label">
                      <b>ĐGN</b>
                    </label>
                    <input
                      type="tel"
                      style={{
                        height: '38px',
                        lineHeight: '38px',
                        width: '90px',
                        marginRight: 0,
                        marginLeft: '17px'
                      }}
                      className="form-control"
                      name="price"
                      aria-describedby="ircPriceHelp"
                      pattern="[0-9]{1,7}"
                      maxLength={7}
                      value={state.price}
                      onChange={handleInputChange}
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
                          !['ArrowLeft', 'ArrowRight', 'Backspace', 'Tab', 'Delete'].includes(
                            event.key
                          )
                        ) {
                          event.preventDefault();
                        }
                      }}></input>
                    (VNĐ)
                  </div>
                </div>
              </div>
              <div className="col-12 mt-2">
                <p className="text-danger">
                  <b>
                    Tổng số tiền:{' '}
                    <span>
                      {(state.totalPrice = state.price * state.quantity).toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND'
                      })}
                    </span>
                  </b>
                </p>
              </div>
              <div className="col-12 mt-3">
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
                  <button type="submit" className="btn btn-primary" onClick={addInventory}>
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
