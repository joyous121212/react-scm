import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { ShoppingListModalStyled } from "./styled";
import { IShoppingListModal, IShoppingListModalresponse } from "../../../../../models/interface/IDelivery";

interface IDeliveryModalProps {
    deliveryId: number;
    deliveryState: string;
    changeDeliveryState: () => void;
}

export const ShoppingListModal: FC<IDeliveryModalProps> = ({ deliveryId, deliveryState, changeDeliveryState }) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [detail, setDetail] = useState<IShoppingListModal>();

    useEffect(() => {
        deliveryDetail();
    }, []);

    const deliveryDetail = () => {
        axios
            .get("/delivery/shoppingDeliveryModal.do", { params: { deliveryId: deliveryId } })
            .then((res: AxiosResponse<IShoppingListModalresponse>) => {
                setDetail(res.data.shoppingDeliveryModal);
                console.log(res.data.shoppingDeliveryModal);
            });
    };

    const updateDeliveryState = () => {
        axios.get("/delivery/updateDeliveryState.do", {
            params: { deliveryId: deliveryId, deliveryState: "배송완료" },
        });
        changeDeliveryState();
        // setModal(!modal);
    };

    return (
        <ShoppingListModalStyled>
            <div className='container'>
                <dt className='signtitle' style={{ textAlign: "center", marginBottom: "25px" }}>
                    <strong style={{ fontSize: "140%" }}>주문 배송 목록 상세</strong>
                </dt>
                <table>
                    <tr>
                        <th>제품명</th>
                        <th>제품수량</th>
                    </tr>
                    <tr>
                        <td>{detail?.productName}</td>
                        <td>{detail?.count}</td>
                    </tr>
                </table>
                <div style={{ textAlign: "center", marginTop: "15px" }}>
                    <button style={{ width: "80px" }} onClick={() => setModal(!modalState)}>
                        닫기
                    </button>
                    {deliveryState !== "배송완료" ? <button onClick={updateDeliveryState}>배송완료</button> : <></>}
                </div>
            </div>
        </ShoppingListModalStyled>
    );
};
