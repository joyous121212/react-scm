import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersListModalStyled } from "./styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import axios, { AxiosResponse } from "axios";
import { IOrdersDetail, IOrdersDetailResponse } from "../../../../../models/interface/IOrders";
import { searchApi } from "../../../../../api/OrdersListApi/searchApi";
import { OrdersList } from "../../../../../api/api";
import { IOrdersListResponse } from "../../../../../models/interface/IOrdersList";

interface IOrdersModalProps {
    orderId: number;
    setOrderId: React.Dispatch<React.SetStateAction<number>>;
    postSuccess: () => void;
}

export const OrdersListModal: FC<IOrdersModalProps> = ({ orderId, setOrderId, postSuccess }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    // const [fileName, setFileName] = useState<string>("");
    const [ordersListDetail, setOrdersListDetail] = useState<IOrdersDetail>();

    useEffect(() => {
        orderId && searchOrdersDetail();

        return () => {
            setOrderId(0);
        };
    }, []);

    const searchOrdersDetail = async () => {
        const result = await searchApi<IOrdersDetailResponse>(OrdersList.searchModal, {
            orderId: orderId,
        });

        if (result) {
            setOrdersListDetail(result.detailValue);
        }
    };

    const handleStatusUpdate = async (orderId) => {
        try {
            const result = await searchApi<IOrdersListResponse>(OrdersList.statdUpdate, { orderId });

            console.log("전송할 orderId:", orderId);

            if (result?.result === "success") {
                // alert("발주서 전송 성공");
                setIsSubmitted(true);
            } else {
                console.error("발주서 전송 실패");
            }
        } catch (error) {
            console.error("발주서 전송 중 오류 발생:", error);
        }
    };

    return (
        <OrdersListModalStyled>
            <div className='container'>
                <table>
                    <tbody>
                        <tr>
                            <th>발주번호</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='productId'
                                    type='text'
                                    defaultValue={ordersListDetail?.orderId}
                                    readOnly
                                />
                            </td>
                            <th>
                                제품명<span className='font_red'>*</span>
                            </th>
                            <td colSpan={5}>
                                <StyledInput
                                    size='modal'
                                    name='count'
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
                                    name='customerName'
                                    type='text'
                                    defaultValue={ordersListDetail?.supplyName}
                                    readOnly
                                />
                            </td>
                            <th>제품번호</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='customerName'
                                    type='text'
                                    defaultValue={ordersListDetail?.productNumber}
                                    readOnly
                                />
                            </td>
                            <th>제품수량</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='customerName'
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
                        onClick={() => handleStatusUpdate(ordersListDetail.orderId)}
                        disabled={isSubmitted}
                        // style={{
                        //     pointerEvents: isSubmitted ? "none" : "auto",
                        //     cursor: isSubmitted ? "default" : "pointer",
                        //     opacity: isSubmitted ? 0.6 : 1,
                        //     backgroundColor: isSubmitted ? "#4CAF50" : "#3bb2ea",
                        //     transition: "background-color 0.3s ease",
                        // }}
                        className={isSubmitted ? "submitted" : ""}
                    >
                        {isSubmitted ? "발주서 전송 완료" : "발주서 전송"}
                    </button>
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </OrdersListModalStyled>
    );
};
