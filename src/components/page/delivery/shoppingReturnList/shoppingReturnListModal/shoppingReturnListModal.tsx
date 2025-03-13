import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ShoppingReturnListModalStyled } from "./styled";
import { IShoppingReturnListModal, IShoppingReturnListModalResponse } from "../../../../../models/interface/IDelivery";

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
    };

    return (
        <ShoppingReturnListModalStyled>
            <div className='container'>
                <dt className='signtitle' style={{ textAlign: "center", marginBottom: "25px" }}>
                    <strong style={{ fontSize: "140%" }}>주문 반품 목록 상세</strong>
                </dt>
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
                    <button style={{ width: "80px" }} onClick={() => setModal(!modalState)}>
                        닫기
                    </button>
                    <button onClick={changeInventory}>재고 처리</button>
                </div>
            </div>
        </ShoppingReturnListModalStyled>
    );
};
