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
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

interface IOrdersModalProps {
    orderId: number;
    setOrderId: React.Dispatch<React.SetStateAction<number>>;
    orderState: string;
    setOrderState: React.Dispatch<React.SetStateAction<string>>;
}

export const OrdersListModal: FC<IOrdersModalProps> = ({ orderId, setOrderId, orderState, setOrderState }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [ordersListDetail, setOrdersListDetail] = useState<IOrdersListDetail>();

    const columns = [
        { key: "orderId", title: "발주번호" },
        { key: "productName", title: "제품명" },
        { key: "supplyName", title: "발주회사" },
        { key: "productNumber", title: "제품번호" },
        { key: "count", title: "제품수량" },
    ];

    useEffect(() => {
        if (ordersListDetail?.orderId) {
            setOrderId(ordersListDetail.orderId);
        }

        if (orderId) {
            searchOrdersDetail();
        }

        if (ordersListDetail) {
            setOrderState(ordersListDetail.orderState);
        }

        return () => {
            setOrderId(0);
        };
    }, [orderId, ordersListDetail, setOrderState]);

    const searchOrdersDetail = async () => {
        const result = await searchApi<IOrdersListDetailResponse>(OrdersList.searchModal, {
            orderId: orderId,
        });

        if (result) {
            setOrdersListDetail(result.detailValue);
        }
    };

    const handleButtonClick = (orderId: number) => {
        console.log("orderId:", orderId);
        Swal.fire({
            icon: "warning",
            title: "발주서를 전송 하시겠습니까?",
            confirmButtonText: "확인",
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                handleStatusUpdate(orderId);
            }
        });
    };

    const handleStatusUpdate = async (orderId) => {
        try {
            const result = await searchApi<IOrdersListResponse>(OrdersList.statdUpdate, { orderId });

            if (result?.result === "success") {
                setOrdersListDetail((prev) =>
                    prev ? { ...prev, isApproved: result.isApproved, orderState: result.orderState } : prev
                );
                setModal(!modal);
            }
        } catch (error) {
            console.error("발주서 전송 중 오류 발생:", error);
        }
    };

    return (
        <OrdersListModalStyled>
            <div className='container'>
                <dt>
                    <strong>발주 지시서</strong>
                </dt>
                <table>
                    <tbody>
                        {columns.map((column) => (
                            <tr key={column.key}>
                                <th>{column.title}</th>
                                <td>
                                    <StyledInput
                                        size='modal'
                                        name={column.key}
                                        type='text'
                                        value={ordersListDetail?.[column.key] ?? ""}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='button-container'>
                    <StyledButton
                        onClick={() => handleButtonClick(orderId)}
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
                    </StyledButton>
                    <StyledButton onClick={() => setModal(!modal)}>나가기</StyledButton>
                </div>
            </div>
        </OrdersListModalStyled>
    );
};
