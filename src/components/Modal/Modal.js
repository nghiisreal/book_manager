/* eslint-disable multiline-ternary */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';

function Modal(props) {
    const history = useHistory();
    const params = useParams();
    // console.log(params.types);
    const [showModal, setShowModal] = useState(false);
    const handleAgree = () => {
        setShowModal(false);
        history.push(`/home/${params.types}`);
        window.location.reload();
    };

    return (
        <div>
            {/* Modal */}
            <div
                className={`modal fade ${showModal ? 'show' : ''}`}
                id="exampleModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden={!showModal}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-danger" id="exampleModalLabel">
                                Cảnh báo !!!
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            Dữ liệu bạn đang nhập sẽ bị hủy nếu bạn quay trở về trang trước. Bạn
                            chắc chắn?
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleAgree}>
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default React.memo(Modal);
