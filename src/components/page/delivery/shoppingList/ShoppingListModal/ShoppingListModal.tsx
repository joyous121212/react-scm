import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ShoppingListModalStyled } from "./styled";
import {
    IShoppingList,
    IShoppingListModal,
    IShoppingListModalresponse,
} from "../../../../../models/interface/IDelivery";
import Swal from "sweetalert2";

interface IDeliveryModalProps {
    changeDeliveryState: () => void;
    listDetail: IShoppingList;
}

export const ShoppingListModal: FC<IDeliveryModalProps> = ({ changeDeliveryState, listDetail }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [detail, setDetail] = useState<IShoppingListModal>();

    useEffect(() => {
        deliveryDetail();
        console.log(listDetail);
        console.log(listDetail.count);
    }, []);

    const deliveryDetail = () => {
        axios
            .get("/delivery/shoppingDeliveryModal.do", { params: { deliveryId: listDetail.deliveryId } })
            .then((res: AxiosResponse<IShoppingListModalresponse>) => {
                setDetail(res.data.shoppingDeliveryModal);
            });
    };

    const updateDeliveryState = () => {
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
                axios
                    .get("/delivery/updateDeliveryState.do", {
                        params: {
                            deliveryId: listDetail.deliveryId,
                            deliveryState: "배송완료",
                            salesState: "deliveryComplete",
                            supplyId: listDetail.supplyId,
                            productId: listDetail.productId,
                            output: detail.count,
                            startLocation: listDetail.startLocation,
                            orderId: listDetail.orderId,
                        },
                    })
                    .then((res) => {
                        console.log(res.data);
                    });
                changeDeliveryState();
            }
        });

        // setModal(!modal);
    };

    return (
        <ShoppingListModalStyled>
            <div className='container'>
                <dt className='signtitle' style={{ textAlign: "center", marginBottom: "25px" }}>
                    <strong style={{ fontSize: "140%" }}>주문 배송 목록 상세</strong>
                </dt>
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
                <div style={{ textAlign: "center", marginTop: "15px" }}>
                    {listDetail.deliveryState !== "배송완료" ? (
                        <button onClick={updateDeliveryState}>배송완료</button>
                    ) : (
                        <></>
                    )}
                    <button style={{ width: "80px" }} onClick={() => setModal(!modalState)} className='cancelButton'>
                        닫기
                    </button>
                </div>
            </div>
        </ShoppingListModalStyled>
    );
};
