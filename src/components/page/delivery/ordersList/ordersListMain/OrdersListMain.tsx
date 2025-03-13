import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { delivery } from "../../../../../api/api";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import axios, { AxiosResponse } from "axios";
import {
    IOrdersInventory,
    IOrdersList,
    IOrdersListDetail,
    IOrdersListDetailResponse,
    IOrdersListResponse,
} from "../../../../../models/interface/IDelivery";
import { StyledTable, StyledTd, StyledTh } from "../../../../common/styled/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import Swal from "sweetalert2";
import { OrdersListMainStyled } from "./styled";

export const OrdersListMain = () => {
    const [ordersList, setOrdersList] = useState<IOrdersList[]>([]);
    const [ordersListCnt, setOrdersListCnt] = useState<number>(0);
    const [detailFalg, setDetailFlag] = useState<Boolean>(false);
    const [ordersListDetail, setOrdersListDetail] = useState<IOrdersListDetail>();
    const [ordersInventory, setOrdersInventory] = useState<IOrdersInventory[]>([]);
    const [cPage, setCPage] = useState<number>(0);
    const [selectedInventory, setSelectedInventory] = useState();
    const { search } = useLocation();

    useEffect(() => {
        searchOrdersList();
        setDetailFlag(false);
    }, [search]);

    const searchOrdersList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");

        const result = await deliverySearchApi<IOrdersListResponse, URLSearchParams>(
            delivery.searchOrdersList,
            searchParam
        );

        if (result) {
            setOrdersList(result.orderDirectionGroup);
            setOrdersListCnt(result.orderDirectionGroupCnt);
            setCPage(currentPage);
        }
    };

    const openGrid = (supplyId: number, orderDirectionDate: string) => {
        if (detailFalg === false) {
            setDetailFlag(true);
            OrdersDetail(supplyId, orderDirectionDate);
        } else {
            setDetailFlag(false);
        }
    };

    const OrdersDetail = (supplyId: number, orderDirectionDate: string) => {
        axios
            .get("/delivery/orderDirectionDetailListBody.do", {
                params: { supplyId: supplyId, orderDirectionDate: orderDirectionDate },
            })
            .then((res: AxiosResponse<IOrdersListDetailResponse>) => {
                setOrdersListDetail(res.data.orderDirectionDetail[0]);
            });
        axios.get("/delivery/inventoryList.do").then((res) => {
            setOrdersInventory(res.data);
            console.log(res.data);
        });
    };

    const handleChange = (event) => {
        setSelectedInventory(event.target.value);
    };

    const updateInventory = () => {
        if (!selectedInventory) {
            // alert("창고를 선택해주세요!");
            Swal.fire("창고를 선택해주세요!", "", "warning");
            return;
        }
        Swal.fire({
            title: "발주 처리 하시겠습니까?",
            icon: "question",
            showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
            confirmButtonColor: "#3085d6", // confrim 버튼 색깔 지정
            cancelButtonColor: "#d33", // cancel 버튼 색깔 지정
            confirmButtonText: "확인", // confirm 버튼 텍스트 지정
            cancelButtonText: "취소", // cancel 버튼 텍스트 지정
            reverseButtons: false, // 버튼 순서 거꾸로
        }).then((result) => {
            if (result.isConfirmed) {
                // 만약 모달창에서 confirm 버튼을 눌렀다면

                Swal.fire("발주처리 되었습니다.", "", "success");
                const data = [
                    {
                        productId: String(ordersListDetail.productId), // Integer를 String으로 변환
                        supplyId: String(ordersListDetail.supplyId),
                        orderId: String(ordersListDetail.orderId),
                        warehouseId: String(selectedInventory),
                        productCnt: String(ordersListDetail.count),
                    },
                ];
                axios.post("/delivery/orderInventoryUpdate.do", data);
                setDetailFlag(false);
                setTimeout(() => {
                    searchOrdersList(cPage);
                }, 500);
            }
        });
    };

    return (
        <OrdersListMainStyled>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={10}>번호</StyledTh>
                        <StyledTh size={30}>업체명</StyledTh>
                        <StyledTh size={40}>총액</StyledTh>
                        <StyledTh size={30}>발주처리일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {ordersList?.length > 0 ? (
                        ordersList.map((list, index) => {
                            return (
                                <tr key={index} onClick={() => openGrid(list.supplyId, list.orderDirectionDate)}>
                                    <StyledTd>{index + 1}</StyledTd>
                                    <StyledTd>{list.supplyName}</StyledTd>
                                    <StyledTd>{list.totalAmount}</StyledTd>
                                    <StyledTd>{list.orderDirectionDate}</StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={4}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <div style={{ marginBottom: "10px" }}></div>
            <PageNavigate
                totalItemsCount={ordersListCnt}
                onChange={searchOrdersList}
                itemsCountPerPage={5}
                activePage={cPage}
            />

            {detailFalg ? (
                <div style={{ marginTop: "80px" }}>
                    <StyledTable>
                        <thead>
                            <tr>
                                {/* <StyledTh size={10}>번호</StyledTh> */}
                                <StyledTh size={30}>장비번호</StyledTh>
                                <StyledTh size={30}>장비구분</StyledTh>
                                <StyledTh size={30}>모델번호</StyledTh>
                                <StyledTh size={30}>모델명</StyledTh>
                                <StyledTh size={30}>판매가격</StyledTh>
                                <StyledTh size={20}>수량</StyledTh>
                                <StyledTh size={40}>발주창고</StyledTh>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersListDetail ? (
                                <>
                                    <StyledTd>{ordersListDetail.categoryNumber}</StyledTd>
                                    <StyledTd>{ordersListDetail.categoryName}</StyledTd>
                                    <StyledTd>{ordersListDetail.productNumber}</StyledTd>
                                    <StyledTd>{ordersListDetail.productName}</StyledTd>
                                    <StyledTd>{ordersListDetail.sellPrice}</StyledTd>
                                    <StyledTd>{ordersListDetail.count}</StyledTd>
                                    <StyledTd>
                                        <select className='select' value={selectedInventory} onChange={handleChange}>
                                            <option>창고 선택</option>
                                            {ordersInventory.map((value, index) => (
                                                <option key={index} value={value.warehouseId}>
                                                    {value.warehouseName}
                                                </option>
                                            ))}
                                        </select>
                                    </StyledTd>
                                </>
                            ) : (
                                <tr>{/* <StyledTd colSpan={7}>데이터가 없습니다.</StyledTd> */}</tr>
                            )}
                        </tbody>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "700%",
                                marginTop: "10px",
                            }}
                        >
                            <StyledButton onClick={updateInventory}>발주처리</StyledButton>
                            {/* <StyledButton onClick={() => setDetailFlag(false)}>닫기</StyledButton> */}
                        </div>
                    </StyledTable>
                </div>
            ) : (
                <></>
            )}
        </OrdersListMainStyled>
    );
};
