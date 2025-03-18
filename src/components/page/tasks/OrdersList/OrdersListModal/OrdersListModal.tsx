import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersListModalStyled } from "./styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { searchApi } from "../../../../../api/OrdersListApi/searchApi";
import { OrdersList } from "../../../../../api/api";
import {
    IOrdersListDetail,
    IOrdersListDetailResponse,
    IOrdersListResponse,
} from "../../../../../models/interface/IOrdersList";
import Swal from "sweetalert2";

interface IOrdersModalProps {
    orderId: number;
    setOrderId: React.Dispatch<React.SetStateAction<number>>;
    postSuccess: () => void;
    orderState: string;
    setOrderState: React.Dispatch<React.SetStateAction<string>>;
}

export const OrdersListModal: FC<IOrdersModalProps> = ({
    orderId,
    setOrderId,
    orderState,
    setOrderState,
    postSuccess,
}) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [ordersListDetail, setOrdersListDetail] = useState<IOrdersListDetail>();
    // const [isApproved, setIsApproved] = useState(ordersListDetail?.isApproved);
    // const [orderStateDetail, setOrderStateDetail] = useState(ordersListDetail?.orderState);

    useEffect(() => {
        orderId && searchOrdersDetail();

        return () => {
            setOrderId(0);
        };
    }, []);

    useEffect(() => {
        if (ordersListDetail) {
            setOrderState(ordersListDetail.orderState);
        }
    }, [ordersListDetail, setOrderState]);

    const searchOrdersDetail = async () => {
        const result = await searchApi<IOrdersListDetailResponse>(OrdersList.searchModal, {
            orderId: orderId,
        });

        if (result) {
            setOrdersListDetail(result.detailValue);
        }
    };

    const handleButtonClick = () => {
        Swal.fire({
            icon: "warning",
            title: "발주서를 전송 하시겠습니까?",
            confirmButtonText: "확인",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // 여기에서 주문 ID 전달
                handleStatusUpdate(orderId);
            }
        });
    };

    const handleStatusUpdate = async (orderId) => {
        try {
            const result = await searchApi<IOrdersListResponse>(OrdersList.statdUpdate, { orderId });

            console.log("전송할 orderId:", orderId);

            if (result?.result === "success") {
                setOrdersListDetail((prev) =>
                    prev ? { ...prev, isApproved: result.isApproved, orderState: result.orderState } : prev
                );
                setModal(!modal);
            } else {
                console.error("발주서 전송 실패");
            }
        } catch (error) {
            console.error("발주서 전송 중 오류 발생:", error);
        }
    };

    console.log("ordersListDetail :", ordersListDetail);
    return (
        <OrdersListModalStyled>
            <div className='container'>
                <dt>
                    <strong>발주 지시서</strong>
                </dt>
                <table>
                    <tbody>
                        <tr>
                            <th>발주번호</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='orderId'
                                    type='text'
                                    defaultValue={ordersListDetail?.orderId}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                제품명<span className='font_red'>*</span>
                            </th>
                            <td colSpan={5}>
                                <StyledInput
                                    size='modal'
                                    name='productName'
                                    type='text'
                                    defaultValue={ordersListDetail?.productName}
                                    readOnly
                                    style={{ width: "100%" }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>발주회사</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='supplyName'
                                    type='text'
                                    defaultValue={ordersListDetail?.supplyName}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>제품번호</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='productNumber'
                                    type='text'
                                    defaultValue={ordersListDetail?.productNumber}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>제품수량</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='count'
                                    type='text'
                                    defaultValue={ordersListDetail?.count}
                                    readOnly
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='button-container'>
                    <button
                        onClick={handleButtonClick}
                        disabled={!(ordersListDetail?.orderState === "purchase" && ordersListDetail?.isApproved === 0)}
                        className={
                            ordersListDetail?.orderState === "purchase" && ordersListDetail?.isApproved === 0
                                ? ""
                                : "submitted"
                        }
                        style={{
                            display:
                                ordersListDetail?.orderState === "purchase" && ordersListDetail?.isApproved === 0
                                    ? "block"
                                    : "none",
                        }}
                    >
                        발주서 전송
                    </button>
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </OrdersListModalStyled>
    );
};
