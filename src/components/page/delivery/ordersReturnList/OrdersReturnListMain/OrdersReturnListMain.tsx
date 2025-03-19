import { useContext, useEffect, useState } from "react";
import {
    IOrdersReturnDetail,
    IOrdersReturnDetailResponse,
    IOrdersReturnList,
    IOrdersReturnListResponse,
} from "../../../../../models/interface/IDelivery";
import { delivery, DeliveryOrders } from "../../../../../api/api";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import Swal from "sweetalert2";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { OrderReturnMainStyled } from "./styled";
import { DeliveryContext } from "../../../../../api/Provider/DeliveryProvider";
import { deliverySearchApi } from "../../../../../api/DeliveryApi/searchApi";
import { deliveryPostApi } from "../../../../../api/DeliveryApi/postApi";

export const OrdersReturnListMain = () => {
    const [ordersReturnList, setOrdersReturnList] = useState<IOrdersReturnList[]>([]);
    const [ordersReturnListCnt, setOrdersReturnListCnt] = useState<number>();
    const [orderReturnDetail, setOrderReturnDetail] = useState<IOrdersReturnDetail[]>([]);
    const [orderReturnDetailCnt, setOrderReturnDetailCnt] = useState<number>();
    const [flagIndex, setFlagIndex] = useState<number>(-1);
    const [cPage, setCPage] = useState<number>(0);
    const { searchKeyword } = useContext(DeliveryContext);

    useEffect(() => {
        searchOrdersReturnList();
        setOrderReturnDetail([]);
    }, [searchKeyword]);

    const searchOrdersReturnList = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const result = await deliverySearchApi<IOrdersReturnListResponse>(delivery.searchOrdersReturnList, {
            ...searchKeyword,
            currentPage: String(currentPage),
            pageSize: "5",
        });

        if (result) {
            const updatedItems = result.orderReturnGroup.map((item, index) => ({
                ...item, // 기존 객체의 내용을 유지
                index: index + currentPage, // 순서에 맞게 index 값을 추가
            }));
            setOrdersReturnList(updatedItems);
            setOrdersReturnListCnt(result.orderReturnGroupCnt);
            setCPage(currentPage);
        }
    };

    const openGrid = (supplyId: string, orderReturnDate: string, index: number) => {
        if (orderReturnDetail.length < 1) {
            setFlagIndex(index);
            ordersReturnDetail(supplyId, orderReturnDate);
        } else {
            if (flagIndex === index) {
                setFlagIndex(-1);
                setOrderReturnDetail([]);
            } else {
                setFlagIndex(index);
                ordersReturnDetail(supplyId, orderReturnDate);
            }
        }
    };

    const ordersReturnDetail = async (supplyId: string, orderReturnDate: string) => {
        const data = { supplyId: supplyId, orderReturnDate: orderReturnDate, page: 1, isFirstLoat: true };
        const result = await deliveryPostApi<IOrdersReturnDetailResponse>(DeliveryOrders.ordersReturnDetail, data);
        const updatedItems = result.orderReturnDetail.map((item, index) => ({
            ...item, // 기존 객체의 내용을 유지
            index: index + 1, // 순서에 맞게 index 값을 추가
        }));
        setOrderReturnDetail(updatedItems);
    };

    useEffect(() => {
        if (orderReturnDetail.length > 0) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth", // 부드럽게 스크롤
            });
        }
    }, [ordersReturnDetail]);

    const returnConfirm = () => {
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
                returnProduct();
            }
        });
    };

    const returnProduct = async () => {
        const data = orderReturnDetail.reduce((acc, list) => {
            acc[list.returnId] = String(list.returnId); // 원하는 키로 값 할당 (예: product를 키로, price를 값으로)
            return acc;
        }, {});

        const result = await deliveryPostApi<{ result: string }>(DeliveryOrders.updateInventory, data);
        if (result.result === "fail") {
            Swal.fire("재고처리 실패!", "", "error");
        } else {
            Swal.fire("재고처리 성공!", "", "success");
            setOrderReturnDetail([]);
            searchOrdersReturnList(cPage);
        }
    };

    const columns = [
        { key: "index", title: "번호" },
        { key: "supplyName", title: "업체명" },
        { key: "totalAmount", title: "총액" },
        { key: "orderReturnDate", title: "반품처리일" },
    ] as Column<IOrdersReturnList>[];
    const columns2 = [
        { key: "index", title: "번호" },
        { key: "categoryCode", title: "장비번호" },
        { key: "categoryName", title: "장비구분" },
        { key: "productNumber", title: "모델번호" },
        { key: "productName", title: "모델명" },
        { key: "sellPrice", title: "판매가격" },
        { key: "count", title: "수량" },
    ] as Column<IOrdersReturnDetail>[];

    return (
        <OrderReturnMainStyled>
            <StyledTable
                data={ordersReturnList}
                columns={columns}
                onRowClick={(row) => {
                    openGrid(row.supplyId, row.orderReturnDate, row.index);
                }}
                renderCell={(row, column) => {
                    if (column.key === "totalAmount") {
                        return `${row.totalAmount.toLocaleString("ko-KR")}원`;
                    }
                    return row[column.key as keyof IOrdersReturnList];
                }}
            />
            <PageNavigate
                totalItemsCount={ordersReturnListCnt}
                onChange={searchOrdersReturnList}
                itemsCountPerPage={5}
                activePage={cPage}
            />
            {orderReturnDetail.length > 0 ? (
                <div style={{ marginTop: "130px" }}>
                    <StyledTable
                        data={orderReturnDetail}
                        columns={columns2}
                        renderCell={(row, column) => {
                            if (column.key === "sellPrice") {
                                return `${row.sellPrice.toLocaleString("ko-KR")}원`;
                            }
                            return row[column.key as keyof IOrdersReturnDetail];
                        }}
                    />
                    <div className='gridButtonArea'>
                        <StyledButton variant='danger' onClick={returnConfirm}>
                            재고처리
                        </StyledButton>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </OrderReturnMainStyled>
    );
};
