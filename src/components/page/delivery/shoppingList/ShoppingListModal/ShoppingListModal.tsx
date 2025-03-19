import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { ShoppingListModalStyled } from "./styled";
import {
    IShoppingList,
    IShoppingListModal,
    IShoppingListModalresponse,
    IShoppingState,
} from "../../../../../models/interface/IDelivery";
import Swal from "sweetalert2";
import { deliveryPostApi } from "../../../../../api/DeliveryApi/postApi";
import { DeliveryShopping } from "../../../../../api/api";

interface IDeliveryModalProps {
    changeDeliveryState: (data: IShoppingState) => void;
    listDetail: IShoppingList;
}

export const ShoppingListModal: FC<IDeliveryModalProps> = ({ changeDeliveryState, listDetail }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [detail, setDetail] = useState<IShoppingListModal>();

    useEffect(() => {
        deliveryDetail();
    }, []);

    const deliveryDetail = async () => {
        const data = { deliveryId: listDetail.deliveryId };
        const result = await deliveryPostApi<IShoppingListModalresponse>(DeliveryShopping.shoppingModal, data);
        setDetail(result.shoppingDeliveryModal);
    };

    const updateConfirm = async () => {
        Swal.fire({
            title: "배송완료로 변경하시겠습니까?",
            icon: "question",
            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
            cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
            confirmButtonText: "확인", // confirm 버튼 텍스트 지정
            cancelButtonText: "취소", // cancel 버튼 텍스트 지정
            reverseButtons: false, // 버튼 순서 거꾸로
        }).then((result) => {
            if (result.isConfirmed) {
                updateDeliveryState();
            }
        });
    };

    const updateDeliveryState = () => {
        const data = {
            ...listDetail,
            output: detail.count,
            deliveryState: "배송완료",
            salesState: "deliveryComplete",
        };
        changeDeliveryState(data);
    };

    return (
        <ShoppingListModalStyled>
            <div className='container'>
                <dt className='signtitle'>
                    <strong>주문 배송 목록 상세</strong>
                </dt>
                {detail ? (
                    <>
                        <table>
                            <tr>
                                <th>제품명</th>
                                <th>제품수량</th>
                            </tr>
                            <tr>
                                <td>{detail?.productName}</td>
                                <td>{detail?.count}</td>
                            </tr>
                        </table>
                        <div className='bottomButtonArea'>
                            {listDetail.deliveryState !== "배송완료" ? (
                                <button onClick={updateConfirm}>배송완료</button>
                            ) : (
                                <></>
                            )}
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
        </ShoppingListModalStyled>
    );
};
