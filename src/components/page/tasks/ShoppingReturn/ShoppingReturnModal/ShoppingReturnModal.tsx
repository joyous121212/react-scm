import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { useEffect, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { ShoppingReturnModalStyled } from "./styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import {
    IShoppingReturnDetailResponse,
    shoppingReturnDetailList,
} from "../../../../../models/interface/IShoppingReturn";
import { searchApi } from "../../../../../api/ShoppingReturnApi/searchApi";
import { ShoppingReturn } from "../../../../../api/api";

export const ShoppingReturnModal = ({ refundId, setRefundId, postSuccess }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [shoppingDetail, setShoppingDetail] = useState<shoppingReturnDetailList>();

    useEffect(() => {
        refundId && searchShoppingReturnDetail();

        return () => {
            setRefundId(0);
        };
    }, []);

    const searchShoppingReturnDetail = async () => {
        const result = await searchApi<IShoppingReturnDetailResponse>(ShoppingReturn.shoppingReturnDetail, {
            refundId: refundId,
        });

        if (result) {
            setShoppingDetail(result.shoppingReturnDetailList);
        }
    };

    return (
        <ShoppingReturnModalStyled>
            <div className='container'>
                <dt>
                    <strong>주문반품 지시서</strong>
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
                                    defaultValue={shoppingDetail?.refundId}
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
                                    defaultValue={shoppingDetail?.productName}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>단가</th>
                            <td colSpan={5}>
                                <StyledInput
                                    size='modal'
                                    name='customerName'
                                    type='text'
                                    defaultValue={shoppingDetail?.price}
                                    readOnly
                                    style={{ width: "100%" }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>개수</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='deliveryManager'
                                    type='text'
                                    defaultValue={shoppingDetail?.count}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>총금액</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='paymentStatus'
                                    type='text'
                                    defaultValue={shoppingDetail?.totalPrice}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>처리상태</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='paymentStatus'
                                    type='text'
                                    defaultValue={shoppingDetail?.isApproved}
                                    readOnly
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>날짜</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    name='paymentStatus'
                                    type='text'
                                    defaultValue={shoppingDetail?.returnsRequestDate?.split(" ")[0]}
                                    readOnly
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='button-container'></div>
                <StyledButton onClick={() => setModal(!modal)}>나가기</StyledButton>
            </div>
        </ShoppingReturnModalStyled>
    );
};
