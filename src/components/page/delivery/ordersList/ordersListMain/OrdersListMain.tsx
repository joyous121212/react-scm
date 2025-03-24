import { useContext, useEffect, useState } from "react";
import { delivery, DeliveryOrders } from "../../../../../api/api";
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
import { DeliveryContext } from "../../../../../api/Provider/DeliveryProvider";
import { deliveryPostApi } from "../../../../../api/DeliveryApi/postApi";

export const OrdersListMain = () => {
    const [ordersList, setOrdersList] = useState<IOrdersList[]>([]);
    const [ordersListCnt, setOrdersListCnt] = useState<number>(0);
    const [ordersListDetail, setOrdersListDetail] = useState<IOrdersListDetail[]>([]);
    const [ordersInventory, setOrdersInventory] = useState<IOrdersInventory[]>([]);
    const [flagIndex, setFlagIndex] = useState<number>(-1);
    const [cPage, setCPage] = useState<number>(0);
    // 각 행별로 창고 상태 관리
    const [selectedInventory, setSelectedInventory] = useState<{ [key: number]: number }>({});
    const { searchKeyword } = useContext(DeliveryContext);

    useEffect(() => {
        searchOrdersList();
        setOrdersListDetail(null);
    }, [searchKeyword]);

    const searchOrdersList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const result = await deliverySearchApi<IOrdersListResponse>(delivery.searchOrdersList, {
            ...searchKeyword,
            currentPage: String(currentPage),
            pageSize: "5",
        });

        if (result) {
            const updatedItems = result.orderDirectionGroup.map((item, index) => ({
                ...item, // 기존 객체의 내용을 유지
                index: index + currentPage, // 순서에 맞게 index 값을 추가
            }));
            setOrdersList(updatedItems);
            setOrdersListCnt(result.orderDirectionGroupCnt);
            setCPage(currentPage);
        }
        axios.get("/delivery/inventoryList.do").then((res) => {
            setOrdersInventory(res.data);
        });
    };

    const openGrid = (supplyId: number, orderDirectionDate: string, index: number) => {
        if (!ordersListDetail) {
            setFlagIndex(index);
            OrdersDetail(supplyId, orderDirectionDate);
            setSelectedInventory({});
        } else {
            if (flagIndex === index) {
                setFlagIndex(-1);
                setOrdersListDetail(null);
                setSelectedInventory({});
            } else {
                setSelectedInventory({});
                setFlagIndex(index);
                OrdersDetail(supplyId, orderDirectionDate);
            }
        }
    };

    const OrdersDetail = async (supplyId: number, orderDirectionDate: string) => {
        const data = { supplyId: supplyId, orderDirectionDate: orderDirectionDate };
        const result = await deliveryPostApi<IOrdersListDetailResponse>(DeliveryOrders.ordersDetial, data);
        setOrdersListDetail(result.orderDirectionDetail);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>, orderId: number) => {
        const value = Number(e.target.value); // 선택된 창고 ID
        setSelectedInventory((prev) => ({
            ...prev,
            [orderId]: value, // orderId 별로 창고 ID 저장
        }));
    };

    const updateConfirm = () => {
        if (Object.keys(selectedInventory).length < ordersListDetail.length) {
            Swal.fire("창고를 선택해주세요!", "", "warning");
            return;
        }
        const hasEmptyValue = Object.values(selectedInventory).some((value) => value === 0);
        if (hasEmptyValue) {
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
                Swal.fire("발주처리 되었습니다.", "", "success");
                updateInventory();
            }
        });
    };

    const updateInventory = async () => {
        const data = ordersListDetail.map((item) => ({
            productId: String(item.productId),
            supplyId: String(item.supplyId),
            orderId: String(item.orderId),
            warehouseId: String(selectedInventory[item.orderId] || ""), // orderId에 해당하는 창고Id를 찾기
            productCnt: String(item.count),
        }));
        axios.post("/delivery/orderInventoryUpdate.do", data);
        setOrdersListDetail(null);
        setSelectedInventory(null);
        searchOrdersList(cPage);
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
                renderCell={(row, column) => {
                    if (column.key === "totalAmount") {
                        return `${row.totalAmount.toLocaleString("ko-KR")}원`;
                    }
                    return row[column.key as keyof IOrdersList];
                }}
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
                                if (column.key === "sellPrice") {
                                    return `${row.sellPrice.toLocaleString("ko-KR")}원`;
                                }
                                if (column.key === "supply") {
                                    if (row.orderId) {
                                        return (
                                            <select
                                                className='select'
                                                value={selectedInventory[row.orderId] || 0} // 선택된 창고 값 유지
                                                onChange={(e) => handleChange(e, row.orderId)}
                                            >
                                                <option value={0}>창고 선택</option>
                                                {ordersInventory.map((value) => (
                                                    <option key={value.warehouseId} value={value.warehouseId}>
                                                        {value.warehouseName}
                                                    </option>
                                                ))}
                                            </select>
                                        );
                                    }
                                }
                                return row[column.key as keyof IOrdersListDetail];
                            }}
                        />
                        <div className='gridButtonArea'>
                            <StyledButton variant='danger' onClick={updateConfirm}>
                                발주처리
                            </StyledButton>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </OrdersListMainStyled>
    );
};
