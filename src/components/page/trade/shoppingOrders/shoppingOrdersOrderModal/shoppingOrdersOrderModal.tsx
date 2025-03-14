import { FC, useEffect, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { ShoppingOrders, ShoppingReturnList } from "../../../../../api/api";
import { postApi } from "../../../../../api/tradeApi/postApi";
import Swal from "sweetalert2";
import { ShoppingOrdersOrderModalStyled } from "./styled";
import { searchApi } from "../../../../../api/tradeApi/searchApi";
import { IShoppingOrder, IShoppingOrdersOrderDetailResponse } from "../../../../../models/interface/IShoppingOrders";

interface IShoppingOrderModalProps {
    postSuccess: () => void;
    shoppingOrderId: number;
    minimumOrderCount: number;
}

export const ShoppingOrdersOrderModal: FC<IShoppingOrderModalProps> = ({
    postSuccess,
    shoppingOrderId,
    minimumOrderCount,
}) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [orderDetail, setOrderDetail] = useState<IShoppingOrder>();
    const [orderCount, setOrderCount] = useState<number>(minimumOrderCount);
    const [selectValue, setSelectValue] = useState<number>(0);

    useEffect(() => {
        shoppingOrderModal();
    }, []);

    const shoppingOrderModal = async () => {
        const result = await searchApi<IShoppingOrdersOrderDetailResponse>(ShoppingOrders.searchOrderDetail, {
            orderId: shoppingOrderId,
        });

        if (result) {
            setOrderDetail(result.orderingInstruction);
        }
    };

    const updateShoppingOrder = async () => {
        const result = await Swal.fire({
            icon: "question",
            title: "알람",
            text: "발주 요청하시겠습니까?",
            showCancelButton: true, // cancel 버튼 보이기
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "예",
            cancelButtonText: "아니오",
        });

        // 사용자가 "예"를 눌렀을 경우 API 호출
        if (result.isConfirmed) {
            const response = await postApi(ShoppingOrders.saveOrders, {
                orderId: shoppingOrderId,
                count: orderCount,
            });

            if (response.result === "success") {
                Swal.fire({
                    icon: "success",
                    title: "요청 완료",
                    confirmButtonText: "확인",
                }).then(() => {
                    postSuccess();
                });
            }
        }
    };

    return (
        <ShoppingOrdersOrderModalStyled>
            <div className='container'>
                <dt>
                    <strong>발주지시서 작성 창</strong>
                </dt>
                <table>
                    <tbody>
                        <tr>
                            <th>제품번호</th>
                            <td>
                                <StyledInput size='modal' type='text' value={orderDetail?.productNumber} readOnly />
                            </td>
                        </tr>
                        <tr>
                            <th>제품명</th>
                            <td>
                                <StyledInput size='modal' type='text' value={orderDetail?.productName} readOnly />
                            </td>
                        </tr>
                        <tr>
                            <th>발주 수량</th>
                            <td>
                                <StyledInput
                                    size='modal'
                                    type='number'
                                    value={orderCount}
                                    min={minimumOrderCount} // ✅ 브라우저에서 최소값 제한
                                    onChange={(e) => {
                                        const newValue = Math.max(minimumOrderCount, Number(e.target.value)); // ✅ 최소값 이하로 입력되지 않도록 제한
                                        setOrderCount(newValue);
                                    }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className='button-container'>
                    <button onClick={updateShoppingOrder}>신청</button>
                    <button onClick={() => setModal(!modal)}>취소</button>
                </div>
            </div>
        </ShoppingOrdersOrderModalStyled>
    );
};
