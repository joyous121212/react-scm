import { ShoppingModalStyled } from "./styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { IShoppingDetail, IShoppingDetailResponse } from "../../../../../models/interface/IShopping";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { searchApi } from "../../../../../api/ShoppingApi/searchApi";
import { Shopping } from "../../../../../api/api";

interface IShoppingModalProps {
    deliveryId: number;
    setDeliveryId: React.Dispatch<React.SetStateAction<number>>;
}

export const ShoppingModal: FC<IShoppingModalProps> = ({ deliveryId, setDeliveryId }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [shoppingDetail, setShoppingDetail] = useState<IShoppingDetail>();

    useEffect(() => {
        deliveryId && searchShoppingDetail();

        return () => {
            setDeliveryId(0);
        };
    }, []);

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
                        <tr>
                            <th>주문 번호</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='productId'
                                    type='text'
                                    defaultValue={deliveryId}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>
                                주문 수량<span className='font_red'>*</span>
                            </th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='count'
                                    type='text'
                                    defaultValue={shoppingDetail?.count}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>고객기업</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='customerName'
                                    type='text'
                                    defaultValue={shoppingDetail?.customerName}
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
                                    name='productName'
                                    type='text'
                                    defaultValue={shoppingDetail?.productName}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>배송 담당자</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='deliveryManager'
                                    type='text'
                                    defaultValue={shoppingDetail?.deliveryManager}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>입금여부</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='paymentStatus'
                                    type='text'
                                    value={shoppingDetail?.paymentStatus === 0 ? "입금" : "미입금"}
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
        </ShoppingModalStyled>
    );
};
