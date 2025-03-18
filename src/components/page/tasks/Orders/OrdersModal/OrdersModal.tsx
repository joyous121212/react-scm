import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { OrdersModalStyled } from "./styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { IOrdersDetail, IOrdersDetailResponse } from "../../../../../models/interface/IOrders";
import { searchApi } from "../../../../../api/OrdersApi/searchApi";
import { Orders } from "../../../../../api/api";

interface IOrdersModalProps {
    orderId: number;
    setOrderId: React.Dispatch<React.SetStateAction<number>>;
}

export const OrdersModal: FC<IOrdersModalProps> = ({ orderId, setOrderId }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [ordersDetail, setOrdersDetail] = useState<IOrdersDetail>();

    useEffect(() => {
        orderId && searchOrdersDetail();

        return () => {
            setOrderId(0);
        };
    }, []);

    const searchOrdersDetail = async () => {
        const result = await searchApi<IOrdersDetailResponse>(Orders.orderDetail, {
            orderId: orderId,
        });

        if (result) {
            setOrdersDetail(result.detailValue);
        }
    };

    return (
        <OrdersModalStyled>
            <div className='container'>
                <dt>
                    <strong>발주 지시서</strong>
                </dt>
                <table>
                    <tbody>
                        <tr>
                            <th>제품 번호</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='productId'
                                    type='text'
                                    defaultValue={ordersDetail?.orderId}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                제품명<span className='font_red'>*</span>
                            </th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='count'
                                    type='text'
                                    defaultValue={ordersDetail?.productName}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>발주업체명</th>
                            <td colSpan={5}>
                                <StyledInput
                                    size='modal'
                                    name='customerName'
                                    type='text'
                                    defaultValue={ordersDetail?.supplyName}
                                    readOnly
                                    style={{ width: "100%" }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>날짜</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='deliveryManager'
                                    type='text'
                                    defaultValue={ordersDetail?.orderDate?.split(" ")[0]}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>개수</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='paymentStatus'
                                    type='text'
                                    defaultValue={ordersDetail?.count}
                                    readOnly
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='button-container'>
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </OrdersModalStyled>
    );
};
