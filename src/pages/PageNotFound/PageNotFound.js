/* eslint-disable camelcase */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';
import './PageNotFound.css';
// Thư viện để lấy role từ token api
import jwt_decode from 'jwt-decode';
export default function PageNotFound() {
  const [user, setUser] = useState('');
  const match = useRouteMatch();
  useEffect(() => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (token) {
      const decodedToken = jwt_decode(token);
      const role = decodedToken.username; // lấy username từ token api
      setUser(role); // Lưu username vào state
    }
  }, []);
  // Không có token thì bắt quay lại trang đăng nhập
  if (!localStorage.getItem('token')) {
    return (
      <div className="bg-404">
        <Container>
          <Row>
            <Col>
              <div className="error-box">
                <h1>Oops!</h1>
                <h2>404 Không tìm thấy </h2>
                <div className="error-details">
                  Xin lỗi, đã có lỗi xảy ra. Không tìm thấy trang {match.url} được yêu cầu!
                </div>
                <div className="login-btn text-center">
                  <Button variant="primary" href="/login">
                    <i className="fa fa-lock"></i> {''}
                    Quay về trang đăng nhập
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  } else {
    return (
      <div className="bg-404">
        <Container>
          <Row>
            <Col>
              <div className="error-box">
                <h1>Oops!</h1>
                <h2>
                  Bạn đã đăng nhập với tài khoản {''}
                  {user}
                </h2>
                <div className="error-details">
                  Xin lỗi, đã có lỗi xảy ra. Không tìm thấy trang {match.url} được yêu cầu!
                </div>
                <div className="error-btn text-center">
                  <Button variant="primary" href="/home/categories">
                    <i className="fa fa-home"></i> {''}
                    Quay về trang chủ
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
