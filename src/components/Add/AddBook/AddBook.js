/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import Modal from '../../Modal/Modal';
import '../addItem.css';
import AsyncCreatableSelect from 'react-select/async-creatable';
import axios from 'axios';
import isEmpty from 'validator/lib/isEmpty';
import { format } from 'date-fns';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

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
export default function AddBook() {
  const history = useHistory();
  // Lưu giá trị được chọn trong select
  const [selectedOptionCate, setSelectedOptionCate] = useState(null);
  const [selectedOptionPublisher, setSelectedOptionPublisher] = useState(null);
  const [selectedOptionAuthor, setSelectedOptionAuthor] = useState(null);
  // Lưu giá trị nhập vào select
  const [inputValueCate, setInputValueCate] = useState('');
  const [inputValuePublisher, setInputValuePublisher] = useState('');
  const [inputValueAuthor, setInputValueAuthor] = useState('');
  // Lưu trữ danh sách dùng để select GET từ database
  const [optionsCate, setOptionsCate] = useState([]);
  const [optionsPublisher, setOptionsPublisher] = useState([]);
  const [optionsAuthor, setOptionsAuthor] = useState([]);
  // Chọn hình ảnh
  const [selectedImage, setSelectedImage] = useState(null);
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
    category_name: '',
    publisher_name: '',
    author_name: ''
  });
  // console.log(state.isbn.length);
  // console.log(state);
  const [notice, setNotice] = useState('');
  // Load dữ liệu từ database lên
  useEffect(() => {
    loadOptionsAuthor('', (options) => setOptionsAuthor(options));
    loadOptionsCate('', (options) => setOptionsCate(options));
    loadOptionsPublisher('', (options) => setOptionsPublisher(options));
  }, []);
  // Load dữ liệu loại sách lên
  const loadOptionsCate = async (inputValueCate, callback) => {
    try {
      const result = await axios.get('https://localhost:7208/api/Categories/GetAllCate?page=0');
      const optionsData = result.data.result.map((option) => ({
        label: option.category_name,
        value: option.category_id
      }));
      setOptionsCate(optionsData);
      // Để hiển thị dữ liệu lên giao diện ngay lập tức và tiếp tục hành động tiếp theo
      // thay vì phải đợi load dữ liệu từ api
      callback(optionsData);
    } catch (error) {
      console.log(error);
    }
  };
  // Tạo mới loại sách
  const handleCreateCate = async (inputValueCate) => {
    try {
      const result = await axios.post('https://localhost:7208/api/Categories/CreateNewCate', {
        category_name: inputValueCate
      });
      // lưu trữ thông tin về loại sách mới được tạo
      const newOption = {
        label: result.data.category_name,
        value: result.data.category_id
      };

      // Lấy lại danh sách loại sách mới nhất
      loadOptionsCate(inputValueCate, (optionsData) => {
        // Cập nhật danh sách loại mới nhất khi đã thêm vào loại sách mới
        setOptionsCate(optionsData);
        // Cập nhật state hiển thị trên select là tên loại sách vừa tạo
        setSelectedOptionCate(newOption);
        // Xóa giá trị đã nhập vào trường nhập liệu cho loại sách mới
        setInputValueCate('');

        // Cập nhật giá trị của category_name vào state
        setState((prevState) => ({
          ...prevState,
          category_name: newOption.label
        }));
      });
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(state);
  const handleChangeCate = (selectedOptionCate) => {
    setSelectedOptionCate(selectedOptionCate);
    setState((prevState) => ({
      ...prevState,
      category_name: selectedOptionCate.label
    }));
  };

  const handleInputChangeCate = (inputValueCate) => {
    setInputValueCate(inputValueCate);
  };

  // Load dữ liệu NXB lên
  const loadOptionsPublisher = async (inputValuePublisher, callback) => {
    try {
      const result = await axios.get('https://localhost:7208/api/Publishers/GetAllPublishers');
      const optionsData = result.data.result.map((option) => ({
        label: option.publisher_name,
        value: option.publisher_id
      }));
      setOptionsPublisher(optionsData);
      callback(optionsData);
    } catch (error) {
      console.log(error);
    }
  };
  // Tạo mới NXB
  const handleCreatePublisher = async (inputValuePublisher) => {
    try {
      const result = await axios.post('https://localhost:7208/api/Publishers/CreateNewPublisher', {
        publisher_name: inputValuePublisher,
        publisher_address: '',
        publisher_phone: ''
      });
      const newOption = {
        label: result.data.publisher_name,
        value: result.data.publisher_id
      };
      // Lấy lại danh sách NXB mới nhất
      loadOptionsPublisher(inputValuePublisher, (optionsData) => {
        setOptionsPublisher(optionsData);
        setSelectedOptionPublisher(newOption);
        setInputValuePublisher('');

        // Cập nhật giá trị của publisher_name vào state
        setState((prevState) => ({
          ...prevState,
          publisher_name: newOption.label
        }));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePublisher = (selectedOptionPublisher) => {
    setSelectedOptionPublisher(selectedOptionPublisher);
    setState((prevState) => ({
      ...prevState,
      publisher_name: selectedOptionPublisher.label
    }));
  };

  const handleInputChangePublisher = (inputValuePublisher) => {
    setInputValuePublisher(inputValuePublisher);
  };
  // Load dữ liệu tác giả lên
  const loadOptionsAuthor = async (inputValueAuthor, callback) => {
    try {
      const result = await axios.get('https://localhost:7208/api/Authors/GetAllAuthors');
      const optionsData = result.data.result.map((option) => ({
        label: option.author_name,
        value: option.author_id
      }));
      setOptionsAuthor(optionsData);
      callback(optionsData);
    } catch (error) {
      console.log(error);
    }
  };

  // Tạo mới tác giả
  const handleCreateAuthor = async (inputValueAuthor) => {
    try {
      const result = await axios.post('https://localhost:7208/api/Authors/CreateNewAu', {
        author_name: inputValueAuthor
      });
      const newOption = {
        label: result.data.author_name,
        value: result.data.author_id
      };
      // Lấy lại danh sách tác giả mới nhất
      loadOptionsAuthor(inputValueAuthor, (optionsData) => {
        setOptionsAuthor(optionsData);
        setSelectedOptionAuthor(newOption);
        setInputValueAuthor('');

        // Cập nhật giá trị của author_name vào state
        setState((prevState) => ({
          ...prevState,
          author_name: newOption.label
        }));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeAuthor = (selectedOptionAuthor) => {
    setSelectedOptionAuthor(selectedOptionAuthor);
    setState((prevState) => ({
      ...prevState,
      author_name: selectedOptionAuthor.label
    }));
  };

  const handleInputChangeAuthor = (inputValueAuthor) => {
    setInputValueAuthor(inputValueAuthor);
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
      setSelectedImage(file);
    } else {
      setSelectedImage(null); // Không có hình ảnh set null
    }
    setImage(URL.createObjectURL(event.target.files[0]));
    // console.log(image);
  };

  const validate = () => {
    const mess = {};
    const regexString = /^[a-zA-Z0-9\s\u00C0-\u1EF9-()&!.,:%$]+$/; // regex tiếng việt, số có các ký tự đặc biệt
    // console.log(regexString.test(state.book_title));
    // Tên sách
    if (!state.book_title || isEmpty(state.book_title)) {
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
    if (!state.num_pages || isEmpty(state.num_pages)) {
      mess.num_pages = 'Vui lòng nhập số trang';
    }
    if (!state.book_price || isEmpty(state.book_price)) {
      mess.book_price = 'Vui lòng nhập giá sách';
    }
    if (!state.user_book || isEmpty(state.user_book)) {
      mess.user_book = 'Vui lòng chọn đối tượng sử dụng';
    }

    if (!state.category_name || isEmpty(state.category_name)) {
      mess.category_name = 'Vui lòng nhập loại sách';
    }
    if (!state.publisher_name || isEmpty(state.publisher_name)) {
      mess.publisher_name = 'Vui lòng nhập tên nhà xuất bản';
    }
    if (!state.author_name || isEmpty(state.author_name)) {
      mess.author_name = 'Vui lòng nhập tên tác giả';
    }
    // Ngày xuất bản
    if (!state.public_date || isEmpty(state.public_date)) {
      mess.public_date = 'Vui lòng nhập ngày xuất bản';
    }
    // Mã ISBN
    const regexNumber = /^[0-9]+$/; // regex số, - , . /
    if (!state.isbn || isEmpty(state.isbn)) {
      mess.isbn = 'Vui lòng nhập mã ISBN';
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
    if (!selectedImage) {
      mess.book_image = 'Vui lòng chọn một hình ảnh';
    }
    setNotice(mess);
    // console.log(notice);
    if (Object.keys(mess).length > 0) {
      return false;
    }
    return true;
  };

  const addBook = async (e) => {
    e.preventDefault();
    // console.log(authorName);
    const bookPrice = parseInt(state.book_price);
    const numPages = parseInt(state.num_pages);
    // const quantity = parseInt(state.book_quantity);
    const isValid = validate();
    if (!isValid) {
      return true;
    }
    try {
      await axios.post('https://localhost:7208/api/Books/CreateNewBookWithAuthor', {
        isbn: state.isbn.toString(),
        book_title: state.book_title,
        book_price: bookPrice,
        // book_quantity: quantity,
        num_pages: numPages,
        book_des: state.book_des,
        book_image: state.book_image, // Xử lý upload image từ local
        user_book: state.user_book,
        public_date: state.public_date,
        category_name: state.category_name,
        publisher_name: state.publisher_name,
        author_name: state.author_name
      });

      history.push('/home/books');
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
            Thêm sách
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
              <form onSubmit={addBook} id="formAddBook">
                <div className="container mb-3 mt-3 text-start d-flex justify-content-around">
                  <div className="row">
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
                        onChange={handleInputChange}
                      />
                      <p className="text-danger">{notice.public_date}</p>
                    </div>
                    <div className="col-4">
                      <label htmlFor="inputDesBook" className="form-label">
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
                        onChange={handleInputChange}
                      />
                      <label className="text-danger">{notice.book_des}</label>

                      <label
                        htmlFor="formFile"
                        className="form-label"
                        style={{
                          marginBottom: '0.5rem',
                          marginTop: '1rem'
                        }}>
                        {' '}
                        Hình ảnh <span className="text-danger">(*)</span>
                      </label>
                      {/* Khi chuyển image về dạng string base 64 thì ko sử dụng value */}
                      <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        required
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
                            src={image}
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
                          onChange={handleInputChange}
                          name="user_book"
                          required
                          defaultValue="">
                          <option disabled hidden></option>
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

                      {/* "author_name": "string" */}
                      <label htmlFor="inputCategoryName" className="form-label">
                        Loại sách <span className="text-danger">(*)</span>
                      </label>
                      <AsyncCreatableSelect
                        filterOption={filterOptionCate}
                        id="inputCategoryName"
                        value={selectedOptionCate}
                        options={optionsCate}
                        onCreateOption={handleCreateCate}
                        onInputChange={handleInputChangeCate}
                        onChange={handleChangeCate}
                        inputValue={inputValueCate}
                        placeholder="Chọn hoặc tạo mới"
                        styles={customStyles}
                        loadOptions={loadOptionsCate}
                        // Load danh sách từ database lên
                        defaultOptions={optionsCate}
                        required
                      />
                      <p className="text-danger">{notice.category_name}</p>

                      <label htmlFor="inputPublisherName" className="form-label">
                        Nhà xuất bản <span className="text-danger">(*)</span>
                      </label>
                      <AsyncCreatableSelect
                        filterOption={filterOptionPublisher}
                        id="inputPublisherName"
                        value={selectedOptionPublisher}
                        options={optionsPublisher}
                        onCreateOption={handleCreatePublisher}
                        onInputChange={handleInputChangePublisher}
                        onChange={handleChangePublisher}
                        inputValue={inputValuePublisher}
                        placeholder="Chọn hoặc tạo mới"
                        styles={customStyles}
                        loadOptions={loadOptionsPublisher}
                        // Load danh sách từ database lên
                        defaultOptions={optionsPublisher}
                        required
                      />
                      <p className="text-danger">{notice.publisher_name}</p>

                      <label htmlFor="inputAuthorBook" className="form-label">
                        Tác giả <span className="text-danger">(*)</span>
                      </label>
                      <AsyncCreatableSelect
                        filterOption={filterOptionAuthor}
                        id="inputAuthorBook"
                        value={selectedOptionAuthor}
                        options={optionsAuthor}
                        onCreateOption={handleCreateAuthor}
                        onInputChange={handleInputChangeAuthor}
                        onChange={handleChangeAuthor}
                        inputValue={inputValueAuthor}
                        placeholder="Chọn hoặc tạo mới"
                        styles={customStyles}
                        loadOptions={loadOptionsAuthor}
                        // Load danh sách từ database lên
                        defaultOptions={optionsAuthor}
                        required
                      />
                      <p className="text-danger">{notice.author_name}</p>
                    </div>
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
                        <button type="submit" className="btn btn-primary" onClick={addBook}>
                          <i className="fa fa-save"></i>
                        </button>
                      </div>
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
                            src={image}
                            style={{ width: '100vw' }}
                            alt={`photo ${state.book_title}`}
                          />
                        </div>
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
