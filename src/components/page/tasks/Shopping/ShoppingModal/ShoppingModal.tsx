import { ShoppingModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { IShoppingDetail, IShoppingDetailResponse } from "../../../../../models/interface/IShopping";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { searchApi } from "../../../../../api/ShoppingApi/searchApi";
import { Shopping } from "../../../../../api/api";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";

interface IShoppingModalProps {
    deliveryId: number;
    setDeliveryId: React.Dispatch<React.SetStateAction<number>>;
}

export const ShoppingModal: FC<IShoppingModalProps> = ({ deliveryId, setDeliveryId }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [shoppingDetail, setShoppingDetail] = useState<IShoppingDetail>();

    const columns = [
        { label: "주문 번호", key: "productId", value: deliveryId },
        { label: "주문 수량", key: "count", value: shoppingDetail?.count },
        { label: "고객기업", key: "customerName", value: shoppingDetail?.customerName },
        { label: "제품명", key: "productName", value: shoppingDetail?.productName },
        { label: "배송 담당자", key: "deliveryManager", value: shoppingDetail?.deliveryManager },
        {
            label: "입금여부",
            key: "paymentStatus",
            value: shoppingDetail?.paymentStatus === 0 ? "입금" : "미입금",
        },
    ];

    useEffect(() => {
        deliveryId && searchShoppingDetail();

        return () => {
            setDeliveryId(0);
        };
    }, [deliveryId]);

    const searchShoppingDetail = async () => {
        const result = await searchApi<IShoppingDetailResponse>(Shopping.deliveryDetail, {
            deliveryId: deliveryId,
        });

        if (result) {
            setShoppingDetail(result.detailValue);
        }
    };

    return (
        <ShoppingModalStyled>
            <div className='container'>
                <dt>
                    <strong>주문배송 지시서</strong>
                </dt>
                <table>
                    <tbody>
                        {columns.map((column, index) => (
                            <tr key={index}>
                                <th>
                                    {column.label}
                                    {column.label === "주문 수량" || column.label === "제품명" ? (
                                        <span className='font_red'>*</span>
                                    ) : null}
                                </th>
                                <td>
                                    <StyledInput
                                        size='modal'
                                        name={column.key}
                                        type='text'
                                        defaultValue={column.value}
                                        readOnly
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='button-container'>
                    <StyledButton onClick={() => setModal(!modal)}>나가기</StyledButton>
                </div>
            </div>
        </ShoppingModalStyled>
    );
};
