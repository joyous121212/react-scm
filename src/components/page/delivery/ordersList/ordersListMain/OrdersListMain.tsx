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
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import Swal from "sweetalert2";
import { OrdersListMainStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";

export const OrdersListMain = () => {
    const [ordersList, setOrdersList] = useState<IOrdersList[]>([]);
    const [ordersListCnt, setOrdersListCnt] = useState<number>(0);
    const [ordersListDetail, setOrdersListDetail] = useState<IOrdersListDetail[]>([]);
    const [ordersInventory, setOrdersInventory] = useState<IOrdersInventory[]>([]);
    const [flagIndex, setFlagIndex] = useState<number>(-1);
    const [cPage, setCPage] = useState<number>(0);
    const [selectedInventory, setSelectedInventory] = useState(0);
    const { search } = useLocation();

    useEffect(() => {
        searchOrdersList();
        setOrdersListDetail(null);
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
            const updatedItems = result.orderDirectionGroup.map((item, index) => ({
                ...item, // 기존 객체의 내용을 유지
                index: index + currentPage, // 순서에 맞게 index 값을 추가
            }));
            setOrdersList(updatedItems);
            setOrdersListCnt(result.orderDirectionGroupCnt);
            setCPage(currentPage);
        }
    };

    const openGrid = (supplyId: number, orderDirectionDate: string, index: number) => {
        if (!ordersListDetail) {
            setFlagIndex(index);
            OrdersDetail(supplyId, orderDirectionDate);
            setSelectedInventory(0);
        } else {
            if (flagIndex === index) {
                setFlagIndex(-1);
                setOrdersListDetail(null);
                setSelectedInventory(0);
            } else {
                setSelectedInventory(0);
                setFlagIndex(index);
                OrdersDetail(supplyId, orderDirectionDate);
            }
        }
    };

    const OrdersDetail = (supplyId: number, orderDirectionDate: string) => {
        axios
            .get("/delivery/orderDirectionDetailListBody.do", {
                params: { supplyId: supplyId, orderDirectionDate: orderDirectionDate },
            })
            .then((res: AxiosResponse<IOrdersListDetailResponse>) => {
                setOrdersListDetail(res.data.orderDirectionDetail);
            });
        axios.get("/delivery/inventoryList.do").then((res) => {
            setOrdersInventory(res.data);
        });
    };

    const handleChange = (event) => {
        setSelectedInventory(event.target.value);
    };

    const updateInventory = () => {
        if (!selectedInventory || selectedInventory === 0) {
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
                        productId: String(ordersListDetail[0].productId), // Integer를 String으로 변환
                        supplyId: String(ordersListDetail[0].supplyId),
                        orderId: String(ordersListDetail[0].orderId),
                        warehouseId: String(selectedInventory),
                        productCnt: String(ordersListDetail[0].count),
                    },
                ];
                axios.post("/delivery/orderInventoryUpdate.do", data);
                // setDetailFlag(false);
                setOrdersListDetail(null);
                setSelectedInventory(null);
                setTimeout(() => {
                    searchOrdersList(cPage);
                }, 500);
            }
        });
    };

    const columns = [
        { key: "index", title: "No." },
        { key: "supplyName", title: "업체명" },
        { key: "totalAmount", title: "총액" },
        { key: "orderDirectionDate", title: "발주처리일" },
    ] as Column<IOrdersList>[];

    const columns2 = [
        // { key: "index", title: "번호" },
        { key: "categoryNumber", title: "장비번호" },
        { key: "categoryName", title: "장비구분" },
        { key: "productNumber", title: "모델번호" },
        { key: "productName", title: "모델명" },
        { key: "sellPrice", title: "판매가격" },
        { key: "count", title: "수량" },
        { key: "supply", title: "발주창고" },
    ] as Column<IOrdersListDetail>[];

    return (
        <OrdersListMainStyled>
            <StyledTable
                data={ordersList}
                columns={columns}
                onRowClick={(row) => openGrid(row.supplyId, row.orderDirectionDate, row.index)}
            />
            <PageNavigate
                totalItemsCount={ordersListCnt}
                onChange={searchOrdersList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {ordersListDetail ? (
                <div>
                    <div style={{ marginTop: "130px" }}>
                        <StyledTable
                            data={ordersListDetail.map((item) => ({
                                ...item,
                                supply: <select></select>,
                            }))}
                            columns={columns2}
                            renderCell={(row, column) => {
                                if (column.key === "supply") {
                                    return (
                                        <select className='select' value={selectedInventory} onChange={handleChange}>
                                            <option>창고 선택</option>
                                            {ordersInventory.map((value, index) => (
                                                <option key={index} value={value.warehouseId}>
                                                    {value.warehouseName}
                                                </option>
                                            ))}
                                        </select>
                                    );
                                }
                                return row[column.key as keyof IOrdersListDetail];
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                marginTop: "-40px",
                            }}
                        >
                            <StyledButton variant='danger' onClick={updateInventory}>
                                발주처리
                            </StyledButton>
                            {/* <StyledButton onClick={() => setDetailFlag(false)}>닫기</StyledButton> */}
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </OrdersListMainStyled>
    );
};
