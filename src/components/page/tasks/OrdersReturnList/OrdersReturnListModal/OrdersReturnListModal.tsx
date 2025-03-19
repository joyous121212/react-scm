import { FC, useEffect, useState } from "react";
import { OrdersReturnListModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import {
    IOrdersReturnModal,
    IOrdersReturnModalResponse,
    IOrdersReturnListResponse,
} from "../../../../../models/interface/IOrdersReturnList";
import { searchApi } from "../../../../../api/OrdersReturnListApi/searchApi";
import { OrdersReturnList } from "../../../../../api/api";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import Swal from "sweetalert2";
import React from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

interface IOrdersReturnListModalProps {
    orderRequestsId: number;
    setOrderRequestsId: React.Dispatch<React.SetStateAction<number>>;
}

export const OrdersReturnListModal: FC<IOrdersReturnListModalProps> = ({ orderRequestsId, setOrderRequestsId }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [ordersReturnListDetail, setOrdersReturnListDetail] = useState<IOrdersReturnModal[]>([]);

    const formatDate = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const columns = [
        { label: "반품번호", key: "orderRequestsId" },
        { label: "반품회사", key: "supplyName" },
        { label: "반품제품", key: "productName" },
        { label: "반품수량", key: "count" },
        { label: "날짜", key: "requestsOrderDate", format: formatDate },
    ];

    useEffect(() => {
        if (orderRequestsId) {
            searchOrdersReturnListDetail();
        }

        if (ordersReturnListDetail?.[0]?.orderState === "return") {
            setIsSubmitted(true);
        }

        if (isSubmitted) {
            setModal(false);
        }

        return () => {
            setOrderRequestsId(0);
        };
    }, [orderRequestsId, ordersReturnListDetail, isSubmitted]);

    const searchOrdersReturnListDetail = async () => {
        const result = await searchApi<IOrdersReturnModalResponse>(OrdersReturnList.searchModal, {
            orderRequestsId: orderRequestsId,
        });

        if (result) {
            setOrdersReturnListDetail(
                Array.isArray(result.ordersReturnModal) ? result.ordersReturnModal : [result.ordersReturnModal]
            );
        }
    };

    const handleStatusUpdate = async (productId, orderRequestsId) => {
        try {
            const result = await searchApi<IOrdersReturnListResponse>(OrdersReturnList.returnUpdate, {
                productId,
                orderRequestsId,
            });

            if (result?.result === "success") {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error("반품지시서 전송 중 오류 발생:", error);
        }
    };

    return (
        <OrdersReturnListModalStyled>
            <div className='container'>
                <dt>
                    <strong>발주반품 지시서</strong>
                </dt>
                <table>
                    <tbody>
                        {ordersReturnListDetail.map((order, index) => (
                            <React.Fragment key={index}>
                                {columns.map((column) => (
                                    <tr key={column.key}>
                                        <th>{column.label}</th>
                                        <td>
                                            <StyledInput
                                                size='modal'
                                                name={column.key}
                                                type='text'
                                                value={
                                                    column.format ? column.format(order[column.key]) : order[column.key]
                                                }
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className='button-container'>
                    <StyledButton
                        onClick={() => {
                            Swal.fire({
                                icon: "warning",
                                title: "발주반품 지시서 전송 하시겠습니까?",
                                confirmButtonText: "확인",
                                showCancelButton: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    handleStatusUpdate(
                                        ordersReturnListDetail?.[0]?.productId,
                                        ordersReturnListDetail?.[0]?.orderRequestsId
                                    );
                                }
                            });
                        }}
                    >
                        발주반품 지시서 전송
                    </StyledButton>
                    <StyledButton onClick={() => setModal(!modal)}>나가기</StyledButton>
                </div>
            </div>
        </OrdersReturnListModalStyled>
    );
};
