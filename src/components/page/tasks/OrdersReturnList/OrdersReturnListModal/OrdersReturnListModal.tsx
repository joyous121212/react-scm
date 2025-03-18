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

interface IOrdersReturnListModalProps {
    orderRequestsId: number;
    setOrderRequestsId: React.Dispatch<React.SetStateAction<number>>;
    postSuccess: () => void;
}

export const OrdersReturnListModal: FC<IOrdersReturnListModalProps> = ({
    orderRequestsId,
    setOrderRequestsId,
    postSuccess,
}) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [ordersReturnListDetail, setOrdersReturnListDetail] = useState<IOrdersReturnModal[]>([]);

    useEffect(() => {
        if (orderRequestsId) {
            searchOrdersReturnListDetail();
        }

        if (ordersReturnListDetail?.[0]?.orderState === "return") {
            setIsSubmitted(true);
        }

        if (isSubmitted) {
            setModal(false); // isSubmitted가 true로 변경되었을 때 모달을 닫음
        }

        return () => {
            setOrderRequestsId(0);
        };
    }, [orderRequestsId, ordersReturnListDetail, isSubmitted]);

    const searchOrdersReturnListDetail = async () => {
        console.log("보내는 데이터:", { orderRequestsId });

        const result = await searchApi<IOrdersReturnModalResponse>(OrdersReturnList.searchModal, {
            orderRequestsId: orderRequestsId,
        });

        if (result) {
            // 단일 객체 타입인 IOrdersReturnModal이 객체배열 [{...}]로 반환중이라 ordersReturnListDetail.orderRequestsId로 접근이 안됨.
            // 배열 IOrdersReturnModal[]로 변환하여 useState
            setOrdersReturnListDetail(
                Array.isArray(result.ordersReturnModal) ? result.ordersReturnModal : [result.ordersReturnModal]
            );
            console.log("result.ordersReturnModal :", result.ordersReturnModal);
        }
    };

    const handleStatusUpdate = async (productId, orderRequestsId) => {
        try {
            const result = await searchApi<IOrdersReturnListResponse>(OrdersReturnList.returnUpdate, {
                productId,
                orderRequestsId,
            });
            console.log("전송할 productId :", productId);

            if (result?.result === "success") {
                setIsSubmitted(true);
            } else {
                console.error("반품지시서 전송 실패");
            }
        } catch (error) {
            console.error("반품지시서 전송 중 오류 발생:", error);
        }
    };

    const formatDate = (date: string) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return (
        <OrdersReturnListModalStyled>
            <div className='container'>
                <>
                    <dt>
                        <strong>발주반품 지시서</strong>
                    </dt>
                    <table>
                        <tbody>
                            {ordersReturnListDetail.map((order, index) => (
                                <>
                                    <tr key={index}>
                                        <th>반품번호</th>
                                        <td>
                                            <StyledInput
                                                size='modal'
                                                name='orderRequestsId'
                                                type='text'
                                                value={order.orderRequestsId}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                    <tr key={index + 1}>
                                        <th>반품회사</th>
                                        <td>
                                            <StyledInput
                                                size='modal'
                                                name='supplyName'
                                                type='text'
                                                value={order.supplyName}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                    <tr key={index + 2}>
                                        <th>반품제품</th>
                                        <td>
                                            <StyledInput
                                                size='modal'
                                                name='productName'
                                                type='text'
                                                value={order.productName}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                    <tr key={index + 3}>
                                        <th>반품수량</th>
                                        <td>
                                            <StyledInput
                                                size='modal'
                                                name='count'
                                                type='text'
                                                value={order.count}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                    <tr key={index + 4}>
                                        <th>날짜</th>
                                        <td>
                                            <StyledInput
                                                size='modal'
                                                name='requestsOrderDate'
                                                type='text'
                                                value={formatDate(order.requestsOrderDate)}
                                                readOnly
                                            />
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </>
                <div className='button-container'>
                    <button
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
                    </button>
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </OrdersReturnListModalStyled>
    );
};
