import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { ShoppingReturnListModalStyled } from "./styled";
import {
    IShoppingReturnInventory,
    IShoppingReturnListModal,
    IShoppingReturnListModalResponse,
} from "../../../../../models/interface/IDelivery";
import Swal from "sweetalert2";
import { deliveryPostApi } from "../../../../../api/DeliveryApi/postApi";
import { DeliveryShopping } from "../../../../../api/api";

interface IDeliveryModalProps {
    refundId: number;
    changeApproved: (data: IShoppingReturnInventory) => void;
}

export const ShoppingReturnListModalDe: FC<IDeliveryModalProps> = ({ refundId, changeApproved }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [detail, setDetail] = useState<IShoppingReturnListModal>();

    useEffect(() => {
        returnDetail();
    }, []);

    const returnDetail = async () => {
        const data = { refundId: refundId };
        const result = await deliveryPostApi<IShoppingReturnListModalResponse>(
            DeliveryShopping.shoppingReturnModal,
            data
        );
        setDetail(result.deliveryReturnModalList[0]);
        console.log(result.deliveryReturnModalList);
    };

    const changeConfirm = () => {
        Swal.fire({
            title: "재고처리 하시겠습니까?",
            icon: "question",
            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
            cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
            confirmButtonText: "확인", // confirm 버튼 텍스트 지정
            cancelButtonText: "취소", // cancel 버튼 텍스트 지정
            reverseButtons: false, // 버튼 순서 거꾸로
        }).then((result) => {
            if (result.isConfirmed) {
                changeInventory();
            }
        });
    };

    const changeInventory = () => {
        const data = {
            refundId: refundId,
            warehouseId: detail.warehouseId,
            supplyName: detail.supplyName,
            productNumber: detail.productNumber,
            quantity: detail.count,
        };
        changeApproved(data);
    };

    return (
        <ShoppingReturnListModalStyled>
            <div className='container'>
                <dt className='signtitle'>
                    <strong>주문 반품 목록 상세</strong>
                </dt>
                {detail ? (
                    <>
                        <table>
                            <tr>
                                <th>번호</th>
                                <th>장비번호</th>
                                <th>장비구분</th>
                                <th>모델명</th>
                                <th>제조사</th>
                                <th>단가</th>
                                <th>개수</th>
                                <th>총 금액</th>
                                <th>창고</th>
                            </tr>
                            <tr>
                                <td>{detail?.refundId}</td>
                                <td>{detail?.productNumber}</td>
                                <td>{detail?.detailName}</td>
                                <td>{detail?.productName}</td>
                                <td>{detail?.supplyName}</td>
                                <td>{detail?.price}</td>
                                <td>{detail?.count}</td>
                                <td>{detail?.totalPrice}</td>
                                <td>{detail?.warehouseName}</td>
                            </tr>
                        </table>
                        <div className='bottomButtonArea'>
                            <button onClick={changeConfirm}>재고 처리</button>
                            <button
                                style={{ width: "80px" }}
                                onClick={() => setModal(!modalState)}
                                className='cancelButton'
                            >
                                닫기
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div className='refresh-button'>
                            <span className='refresh-icon'></span>
                            목록 불러오는중...
                        </div>
                    </div>
                )}
            </div>
        </ShoppingReturnListModalStyled>
    );
};
