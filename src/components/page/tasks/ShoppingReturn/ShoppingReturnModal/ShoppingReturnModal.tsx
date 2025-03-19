import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { ShoppingReturnModalStyled } from "./styled";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import {
    IShoppingReturnDetailResponse,
    shoppingReturnDetailList,
} from "../../../../../models/interface/IShoppingReturn";
import { searchApi } from "../../../../../api/ShoppingReturnApi/searchApi";
import { ShoppingReturn } from "../../../../../api/api";

interface IShoppingReturnModalProps {
    refundId: number;
    setRefundId: React.Dispatch<React.SetStateAction<number>>;
}

export const ShoppingReturnModal: FC<IShoppingReturnModalProps> = ({ refundId, setRefundId }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [shoppingDetail, setShoppingDetail] = useState<shoppingReturnDetailList>();

    const columns = [
        { key: "refundId", title: "제품 번호" },
        { key: "productName", title: "제품명" },
        { key: "price", title: "단가" },
        { key: "count", title: "개수" },
        { key: "totalPrice", title: "총금액" },
        { key: "isApproved", title: "처리상태" },
        { key: "returnsRequestDate", title: "날짜" },
    ];

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
                        {columns.map((column) => {
                            let value = "";

                            if (column.key === "price" || column.key === "totalPrice") {
                                value = shoppingDetail?.[column.key]?.toLocaleString("ko-KR") + "원";
                            }

                            if (column.key === "returnsRequestDate") {
                                value = shoppingDetail?.[column.key]?.split(" ")[0];
                            }

                            if (column.key === "isApproved") {
                                const approvalStatus = [
                                    "SCM 승인 대기중",
                                    "임원 승인 대기중",
                                    "임원 승인 완료",
                                    "창고 이동 완료",
                                ];
                                value = approvalStatus[shoppingDetail?.[column.key]] || "알 수 없음";
                            } else {
                                value = shoppingDetail?.[column.key] ?? "";
                            }

                            return (
                                <tr key={column.key}>
                                    <th>{column.title}</th>
                                    <td>
                                        <StyledInput
                                            size='modal'
                                            name={column.key}
                                            type='text'
                                            value={value}
                                            readOnly
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className='button-container'>
                    <StyledButton onClick={() => setModal(!modal)}>나가기</StyledButton>
                </div>
            </div>
        </ShoppingReturnModalStyled>
    );
};
