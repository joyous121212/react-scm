import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ShoppingReturnListModalStyled } from "./styled";
import { IShoppingReturnListModal, IShoppingReturnListModalResponse } from "../../../../../models/interface/IDelivery";
import Swal from "sweetalert2";

interface IDeliveryModalProps {
    refundId: number;
    changeApproved: () => void;
}

export const ShoppingReturnListModalDe: FC<IDeliveryModalProps> = ({ refundId, changeApproved }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [detail, setDetail] = useState<IShoppingReturnListModal>();

    useEffect(() => {
        returnDetail();
    }, []);

    const returnDetail = () => {
        axios
            .get("/delivery/deliveryReturnModalListBody.do", { params: { refundId: refundId } })
            .then((res: AxiosResponse<IShoppingReturnListModalResponse>) => {
                console.log(res.data.deliveryReturnModalList[0]);
                setDetail(res.data.deliveryReturnModalList[0]);
            });
    };

    const changeInventory = () => {
        Swal.fire({
            title: "재고처리 하시겠습니까?",
            icon: "question",
            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
            cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
            confirmButtonText: "확인", // confirm 버튼 텍스트 지정
            cancelButtonText: "취소", // cancel 버튼 텍스트 지정
            reverseButtons: false, // 버튼 순서 거꾸로
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get("/delivery/deliveryReturnInsertInventory.do", {
                    params: {
                        refundId: refundId,
                        warehouseId: detail.warehouseId,
                        supplyName: detail.supplyName,
                        productNumber: detail.productNumber,
                        quantity: detail.count,
                    },
                });
                changeApproved();
            }
        });
    };

    return (
        <ShoppingReturnListModalStyled>
            <div className='container'>
                <dt className='signtitle' style={{ textAlign: "center", marginBottom: "25px" }}>
                    <strong style={{ fontSize: "140%" }}>주문 반품 목록 상세</strong>
                </dt>
                {detail ? (
                    <>
                        <table>
                            <tr>
                                <th>번호</th>
                                <th>장비번호</th>
                                <th>장비구분</th>
                                <th>모델명</th>
                                <th>제조사</th>
                                <th>단가</th>
                                <th>개수</th>
                                <th>총 금액</th>
                                <th>창고</th>
                            </tr>
                            <tr>
                                <td>{detail?.refundId}</td>
                                <td>{detail?.productNumber}</td>
                                <td>{detail?.detailName}</td>
                                <td>{detail?.productName}</td>
                                <td>{detail?.supplyName}</td>
                                <td>{detail?.price}</td>
                                <td>{detail?.count}</td>
                                <td>{detail?.totalPrice}</td>
                                <td>{detail?.warehouseName}</td>
                            </tr>
                        </table>
                        <div style={{ textAlign: "center", marginTop: "15px" }}>
                            <button onClick={changeInventory}>재고 처리</button>
                            <button
                                style={{ width: "80px" }}
                                onClick={() => setModal(!modalState)}
                                className='cancelButton'
                            >
                                닫기
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ width: "100%", textAlign: "center" }}>목록 불러오는중...</div>
                )}
            </div>
        </ShoppingReturnListModalStyled>
    );
};
