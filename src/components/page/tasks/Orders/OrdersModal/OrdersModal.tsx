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

    const columns = [
        { key: "orderId", title: "제품 번호" },
        { key: "productName", title: "제품명" },
        { key: "supplyName", title: "발주업체명" },
        { key: "orderDate", title: "날짜", format: (value: string) => value?.split(" ")[0] },
        { key: "count", title: "개수" },
    ];

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
                        {columns.map((column) => (
                            <tr key={column.key}>
                                <th>{column.title}</th>
                                <td>
                                    <StyledInput
                                        size='modal'
                                        name={column.key}
                                        type='text'
                                        value={
                                            column.format
                                                ? column.format(ordersDetail?.[column.key])
                                                : (ordersDetail?.[column.key] ?? "")
                                        }
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='button-container'>
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </OrdersModalStyled>
    );
};
