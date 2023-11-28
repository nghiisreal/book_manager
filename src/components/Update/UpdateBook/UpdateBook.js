/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Modal from '../../Modal/Modal';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { format } from 'date-fns';

import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';
import moment from 'moment/moment';
import '../../Add/addItem.css';

import Select from 'react-select';
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
export default function UpdateBook(props) {
  const history = useHistory();
  const params = useParams();
  // console.log(params.id);
  // Hiển thị hình ảnh
  const [image, setImage] = useState('');
  const [state, setState] = useState({
    isbn: '',
    book_title: '',
    book_price: 0,
    // book_quantity: 0,
    num_pages: 0,
    book_des: '',
    book_image: '',
    user_book: '',
    public_date: '',

    category_id: '',
    publisher_id: '',
    author_id: '',
    category_name: '',
    publisher_name: '',
    author_name: ''
  });

  const [optionsCate, setOptionsCate] = useState([]);
  const [selectedCate, setSelectedCate] = useState(null);

  const [optionsPublisher, setOptionsPublisher] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const [optionsAuthor, setOptionsAuthor] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const [notice, setNotice] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;

    if (name === 'public_date') {
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
  const handleImageInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setState((prevState) => ({
        ...prevState,
        book_image: reader.result
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    setImage(URL.createObjectURL(event.target.files[0]));
    console.log(image);
  };
  const loadData = async () => {
    try {
      // categories, publishers, authors, book
      const [categories, publishers, authors, book] = await Promise.all([
        getCategory(),
        getPublisher(),
        getAuthor(),
        getBookId()
      ]);

      const optionsCate = categories.map((c) => ({
        value: c.category_id,
        label: c.category_name
      }));
      const optionsPublisher = publishers.map((p) => ({
        value: p.publisher_id,
        label: p.publisher_name
      }));
      const optionsAuthor = authors.map((a) => ({
        value: a.author_id,
        label: a.author_name
      }));
      setOptionsCate(optionsCate);
      setSelectedCate(optionsCate.find((c) => c.value === book.category_id) || null);

      setOptionsPublisher(optionsPublisher);
      setSelectedPublisher(optionsPublisher.find((p) => p.value === book.publisher_id) || null);
      setOptionsAuthor(optionsAuthor);
      setSelectedAuthor(optionsAuthor.find((a) => a.value === book.author_id) || null);
      setState({
        isbn: book.isbn,
        book_title: book.book_title,
        book_price: book.book_price.toString(),
        // book_quantity: book.book_quantity.toString(),
        num_pages: book.num_pages.toString(),
        book_des: book.book_des,
        book_image: book.book_image,
        user_book: book.user_book,
        public_date: book.public_date,

        category_name: book.category_name,
        category_id: book.category_id,
        publisher_id: book.publisher_id,
        publisher_name: book.publisher_name,
        author_id: book.author_id,
        author_name: book.author_name
      });
    } catch (err) {
      // console.log(err.response.data);
    }
  };
  useEffect(() => {
    loadData();
  }, [params.id]);
  // console.log(state);
  // console.log(optionsCate);
  // console.log(selectedCate);
  // console.log(optionsAuthor);
  // console.log(selectedAuthor);
  // console.log(optionsPublisher);
  // console.log(selectedPublisher);
  const getCategory = async () => {
    try {
      const result = await axios.get('https://localhost:7208/api/Categories/GetAllCate?page=0');
      return result.data.result;
    } catch (err) {
      console.log(err.response.data);
      return [];
    }
  };
  const getAuthor = async () => {
    try {
      const result = await axios.get('https://localhost:7208/api/Authors/GetAllAuthors?page=0');
      return result.data.result;
    } catch (err) {
      console.log(err.response.data);
      return [];
    }
  };
  const getPublisher = async () => {
    try {
      const result = await axios.get(
        'https://localhost:7208/api/Publishers/GetAllPublishers?page=0'
      );
      return result.data.result;
    } catch (err) {
      console.log(err.response.data);
      return [];
    }
  };
  const getBookId = async () => {
    try {
      const id = params.id;
      const result = await axios.get(`https://localhost:7208/api/Books/GetBookId/${id}`);
      return result.data;
    } catch (err) {
      console.log(err.response.data);
      return {};
    }
  };
  // Khi người dùng chọn một giá trị khác trên Select component
  const handleCategoryChange = (selectedOption) => {
    // console.log(selectedOption);
    setSelectedCate(selectedOption);
    setState((prevState) => ({
      ...prevState,
      category_id: selectedOption ? selectedOption.value : null,
      category_name: selectedOption ? selectedOption.label : null
    }));
  };
  // // Khi người dùng chọn một giá trị khác trên Select component
  const handlePublisherChange = (selectedOption) => {
    setSelectedPublisher(selectedOption);
    setState((prevState) => ({
      ...prevState,
      publisher_id: selectedOption ? selectedOption.value : null,
      publisher_name: selectedOption ? selectedOption.label : null
    }));
  };
  // // Khi người dùng chọn một giá trị khác trên Select component
  const handleAuthorChange = (selectedOption) => {
    setSelectedAuthor(selectedOption);
    setState((prevState) => ({
      ...prevState,
      author_id: selectedOption ? selectedOption.value : null,
      author_name: selectedOption ? selectedOption.label : null
    }));
  };
  // Lọc khi điền vào Select
  const filterOptionCate = (option, inputValueCate) => {
    return option.label.toLowerCase().includes(inputValueCate.toLowerCase());
  };
  const filterOptionPublisher = (option, inputValuePublisher) => {
    return option.label.toLowerCase().includes(inputValuePublisher.toLowerCase());
  };
  const filterOptionAuthor = (option, inputValueAuthor) => {
    return option.label.toLowerCase().includes(inputValueAuthor.toLowerCase());
  };
  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z0-9\s\u00C0-\u1EF9-()&!.,:%$]+$/; // regex tiếng việt, số có các ký tự đặc biệt
    // console.log(regexString.test(state.book_title));
    // Tên sách
    if (isEmpty(state.book_title)) {
      mess.book_title = 'Vui lòng nhập tên sách';
    }
    if (!regexString.test(state.book_title.trim())) {
      mess.book_title = 'Tên sách không được chứa ký tự đặc biệt ngoại trừ: "( ) ! - & . , : % $"';
    }
    if (regexString.test(state.book_title.trim())) {
      if (state.book_title.length < 10) {
        mess.book_title = 'Tên sách không được nhỏ hơn 10 ký tự';
      }
    }
    if (isEmpty(state.num_pages)) {
      mess.num_pages = 'Vui lòng nhập số trang';
    }
    if (isEmpty(state.book_price)) {
      mess.book_price = 'Vui lòng nhập giá sách';
    }
    if (state.user_book === '') {
      mess.user_book = 'Vui lòng chọn đối tượng sử dụng';
    }

    if (isEmpty(state.category_name)) {
      mess.category_name = 'Vui lòng nhập loại sách';
    }
    if (isEmpty(state.publisher_name)) {
      mess.publisher_name = 'Vui lòng nhập tên nhà xuất bản';
    }
    if (isEmpty(state.author_name)) {
      mess.author_name = 'Vui lòng nhập tên tác giả';
    }
    // Ngày xuất bản
    if (isEmpty(state.public_date)) {
      mess.public_date = 'Vui lòng nhập ngày xuất bản';
    }

    // Mã ISBN
    const regexNumber = /^[0-9]+$/; // regex số, - , . /
    if (isEmpty(state.isbn)) {
      mess.book_title = 'Vui lòng nhập mã ISBN';
    }
    if (!regexNumber.test(state.isbn.trim())) {
      mess.isbn = 'Mã ISBN chỉ được chứa số';
    }
    if (regexNumber.test(state.isbn.trim())) {
      if (
        ((state.isbn.length < 10 || state.isbn.length > 13) && state.isbn.length === 11) ||
        state.isbn.length === 12
      ) {
        mess.isbn = 'Chỉ có 2 loại mã ISBN là: 10 ký tự (kiểu cũ) hoặc 13 ký tự (kiểu mới)';
      }
    }
    if (isEmpty(state.book_image)) {
      mess.book_manager = 'Vui lòng chọn hình ảnh';
    }
    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };
  const updateBook = async (e) => {
    e.preventDefault();
    const id = params.id;
    const bookPrice = parseInt(state.book_price);
    const numPages = parseInt(state.num_pages);
    // const quantity = parseInt(state.book_quantity);
    const isValid = validate();
    if (!isValid) {
      return true;
    }
    try {
      // console.log(state.publisher_address);
      // console.log(state.publisher_phone);
      await axios.put(`https://localhost:7208/api/Books/Updateid/${id}`, {
        isbn: state.isbn.toString(),
        book_title: state.book_title,
        book_price: bookPrice,
        // book_quantity: quantity,
        num_pages: numPages,
        book_des: state.book_des,
        book_image: state.book_image, // Xử lý upload image từ local
        user_book: state.user_book,
        public_date: state.public_date,

        author_id: selectedAuthor.value,
        publisher_id: selectedPublisher.value,
        category_id: selectedCate.value
      });

      alert(`Cập nhật quyển sách với mã ${id} thành công!`);
      history.push('/home/books');
    } catch (err) {
      alert(err.response.data);
    }
  };

  const renderBookId = () => {
    return (
      <>
        <div className="col-4">
          <label htmlFor="inputIsbnBook" className="form-label">
            Mã ISBN <span className="text-danger">(*)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputIsbnBook"
            name="isbn"
            maxLength={13}
            aria-describedby="isbnBookHelp"
            required
            placeholder="Nhập mã ISBN"
            value={state.isbn}
            onChange={handleInputChange}
          />
          <p className="text-danger">{notice.isbn}</p>
          <label htmlFor="inputTitleBook" className="form-label">
            Tên sách <span className="text-danger">(*)</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="inputTitleBook"
            name="book_title"
            aria-describedby="titleBookHelp"
            required
            placeholder="Nhập tên quyển sách"
            value={state.book_title}
            onChange={handleInputChange}
          />
          <p className="text-danger">{notice.book_title}</p>
          <label htmlFor="inputPriceBook" className="form-label">
            Giá sách <span className="text-danger">(*)</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="inputPriceBook"
            name="book_price"
            required
            aria-describedby="priceBookHelp"
            placeholder="Nhập giá sách"
            value={state.book_price}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === '-' || event.key === 'e') {
                event.preventDefault();
              }
            }}
          />
          <p className="text-danger">{notice.book_price}</p>
          <label htmlFor="inputPageBook" className="form-label">
            Số trang <span className="text-danger">(*)</span>
          </label>
          <input
            type="number"
            className="form-control"
            id="inputPageBook"
            name="num_pages"
            required
            aria-describedby="pageBookHelp"
            placeholder="Nhập số trang quyển sách"
            value={state.num_pages}
            onChange={handleInputChange}
            onKeyDown={(event) => {
              if (event.key === '-' || event.key === 'e') {
                event.preventDefault();
              }
            }}
          />
          <p className="text-danger">{notice.num_pages}</p>
          <label htmlFor="inputPublicBook" className="form-label">
            Ngày xuất bản <span className="text-danger">(*)</span>
          </label>
          <input
            type="date"
            className="form-control"
            id="inputPublicBook"
            name="public_date"
            required
            aria-describedby="publicBookHelp"
            // "moment" là một thư viện JavaScript dùng để định dạng lại định dạng ngày tháng, ở đây là từ định dạng 'DD/MM/YYYY' sang 'YYYY-MM-DD'
            // Vì đây 'YYYY-MM-DD' là đỉnh dạng chuẩn nên phải chuyển sang để không xảy ra lỗi và lưu vào database
            value={moment(state.public_date, 'DD/MM/YYYY').format('YYYY-MM-DD')}
            onChange={handleInputChange}
          />
          <p className="text-danger">{notice.public_date}</p>
        </div>
        <div className="col-4">
          <label htmlFor="inputPageBook" className="form-label">
            Mô tả
          </label>
          <textarea
            style={{ minHeight: '123px' }}
            type="text"
            className="form-control"
            id="inputDesBook"
            name="book_des"
            aria-describedby="desBookHelp"
            placeholder="Nhập mô tả"
            value={state.book_des}
            onChange={handleInputChange}
          />
          <label className="text-danger">{notice.book_des}</label>

          <input type="hidden" name="book_image" value={state.book_image} />
          <label
            htmlFor="formFile"
            className="form-label"
            style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>
            {' '}
            Hình ảnh
          </label>
          {/* Khi chuyển image về dạng string base 64 thì ko sử dụng value */}
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={handleImageInputChange}
            // value={state.book_image}
            accept=".jpg,.jpeg,.png,.webp"
          />
          <p className="text-danger">{notice.book_image}</p>
          <div
            className="d-flex justify-content-center"
            style={{
              border: '1px dotted #d1d1d1',
              borderRadius: '10px'
            }}>
            <a data-bs-toggle="modal" data-bs-target="#imageModal">
              <img
                className="img-thumbnail"
                src={state.book_image}
                style={{
                  width: '6rem',
                  minHeight: '10rem',
                  lineHeight: '5rem',
                  border: 'none'
                }}
                alt={`photo ${state.book_title}`}
              />
            </a>
          </div>
        </div>
        <div className="col-4">
          <label htmlFor="inputUserBook" className="form-label">
            Đối tượng sử dụng <span className="text-danger">(*)</span>
          </label>

          <div className="select">
            <select
              id="standard-select"
              value={state.user_book}
              onChange={handleInputChange}
              name="user_book">
              <option value="Học viên">Học viên</option>
              <option value="Giáo viên">Giáo viên</option>
              <option value="Trẻ em">Trẻ em</option>
              <option value="Thiếu niên">Thiếu niên</option>
              <option value="Người cao tuổi">Người cao tuổi</option>

              <option value="Cha mẹ">Cha mẹ</option>
              <option value="Người đi làm">Người đi làm</option>
              <option value="Khác">Khác</option>
            </select>
            <p className="text-danger">{notice.user_book}</p>
          </div>

          <label htmlFor="inputCategoryName" className="form-label">
            Loại sách <span className="text-danger">(*)</span>
          </label>

          <Select
            id="inputCategoryName"
            placeholder="Chọn loại sách..."
            filterOption={filterOptionCate}
            options={optionsCate}
            styles={customStyles}
            value={selectedCate} // Set giá trị mặc định cho Select component
            onChange={handleCategoryChange} // Xử lý khi người dùng chọn giá trị khác
            required
          />
          <p className="text-danger">{notice.category_name}</p>

          <label htmlFor="inputPublisherName" className="form-label">
            Nhà xuất bản <span className="text-danger">(*)</span>
          </label>

          <Select
            id="inputPublisherName"
            placeholder="Chọn nhà xuất bản..."
            filterOption={filterOptionPublisher}
            options={optionsPublisher}
            styles={customStyles}
            value={selectedPublisher} // Set giá trị mặc định cho Select component
            onChange={handlePublisherChange} // Xử lý khi người dùng chọn giá trị khác
            required
          />
          <p className="text-danger">{notice.publisher_name}</p>

          <label htmlFor="inputAuthorBook" className="form-label">
            Tác giả <span className="text-danger">(*)</span>
          </label>

          <Select
            id="inputAuthorName"
            placeholder="Chọn tên tác giả..."
            filterOption={filterOptionAuthor}
            options={optionsAuthor}
            styles={customStyles}
            value={selectedAuthor} // Set giá trị mặc định cho Select component
            onChange={handleAuthorChange} // Xử lý khi người dùng chọn giá trị khác
            required
          />
          <p className="text-danger">{notice.author_name}</p>
        </div>
        {/* Modal Image click */}
        <div
          className="modal fade modal__image"
          id="imageModal"
          tabIndex="-1"
          aria-labelledby="imageModalLabel"
          aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content modal__image">
              <img
                className="img-thumbnail"
                src={state.book_image}
                style={{ width: '100vw' }}
                alt={`photo ${state.book_title}`}
              />
            </div>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span
            className="navbar-brand mb-0 h1"
            style={{ width: '50%', textAlign: 'center', margin: 'auto' }}>
            Cập nhật sách có mã: {params.id}
          </span>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="card card__style" style={{ minWidth: '70vw' }}>
          <div className="card-body py-1">
            <h1 className="card-title">
              {' '}
              <i className="fa fa-book"></i>
            </h1>
            <div style={{ borderTop: '2px solid #e7e7e7' }}></div>
            <div>
              <form id="formUpdateBook" onSubmit={updateBook}>
                <div className="container mb-3 mt-3 text-start d-flex justify-content-around">
                  <div className="row">
                    {renderBookId()}
                    <div className="col-12">
                      <div className="d-flex justify-content-evenly mt-3">
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
                        <button type="submit" className="btn btn-primary" onClick={updateBook}>
                          <i className="fa fa-save"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Modal />
    </>
  );
}
