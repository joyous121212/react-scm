import { FC, useEffect, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { ShoppingOrders } from "../../../../../api/api";
import { postApi } from "../../../../../api/tradeApi/postApi";
import Swal from "sweetalert2";
import { searchApi } from "../../../../../api/tradeApi/searchApi";
import {
    ISelectOption,
    IShoppingOrder,
    IShoppingOrdersDeliveryDetailResponse,
    IWarehouseList,
    IWarehouseValue,
} from "../../../../../models/interface/IShoppingOrders";
import { ShoppingOrdersDeliveryModalStyled } from "./styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledSelectBox } from "../../../../common/StyledSelectBox/StyledSelectBox";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { Spinner } from "../../../../common/Spinner/spinner";
import { WarehouseList } from "./warehouseList";

interface IShoppingOrderModalProps {
    postSuccess: () => void;
    shoppingOrderId: number;
}

export const ShoppingOrdersDeliveryModal: FC<IShoppingOrderModalProps> = ({ postSuccess, shoppingOrderId }) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [warehouseOptions, setWarehouseOptions] = useState<ISelectOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [managerOptions, setManagerOptions] = useState<ISelectOption[]>([]);
    const [deliveryDetail, setDeliveryDetail] = useState<IShoppingOrder[]>([]);
    const [selectWarehouseValueList, setSelectWarehouseValueList] = useState<IWarehouseValue[]>([]);
    const [warehouseName, setWarehouseName] = useState<string>("");
    const [warehouseId, setWarehouseId] = useState<number>(0);
    const [warehouseList, setWarehouseList] = useState<IWarehouseList[]>([]);
    const [selectManagerValue, setSelectManagerValue] = useState<string>("");
    const [totalProductStock, setTotalProductStock] = useState<number>(0);
    const [limitOrderCount, setLimitOrderCount] = useState<number>(0);
    const [orderCount, setOrderCount] = useState<number>(0);

    const orderColumns = [
        { key: "orderId", title: "주문번호" }, // 6.15%
        { key: "salesDate", title: "주문일자" }, // 9.23%
        { key: "customerName", title: "고객명" }, // 9.23%
        { key: "productName", title: "상품명" }, // 10%
        { key: "count", title: "주문수량" }, // 8.46%
        { key: "deliveryManager", title: "배송담당자" }, // 9.23
    ] as Column<IShoppingOrder>[];

    //모달 초기 정보를 가져오는 useEffect
    useEffect(() => {
        setIsLoading(true);
        shoppingDeliveryModal();
    }, []);

    useEffect(() => {}, [warehouseList]);

    useEffect(() => {
        if (warehouseOptions.length > 0) {
            const value = warehouseOptions[0].value as string;
            const firstValue = JSON.parse(value);
            setWarehouseName(firstValue.warehouseName);
            setTotalProductStock(firstValue.totalProductStock);
            setWarehouseId(firstValue.warehouseId);
        }
    }, [warehouseOptions]);

    useEffect(() => {
        if (managerOptions.length > 0) {
            setSelectManagerValue(managerOptions[0]?.value as string);
        }
    }, [managerOptions]);

    const deliverOrderList = (data: IShoppingOrder): IShoppingOrder[] => {
        const deliverOrderList: IShoppingOrder[] = []; // ✅ 배열 타입 명시
        deliverOrderList.push(data); // ✅ put() → push() 변경
        return deliverOrderList;
    };

    const shoppingDeliveryModal = async () => {
        try {
            const result = await searchApi<IShoppingOrdersDeliveryDetailResponse>(ShoppingOrders.searchDeliveryDetail, {
                orderId: shoppingOrderId,
            });

            if (result) {
                setLimitOrderCount(result.deliveryOrder.count);
                const orderList = deliverOrderList(result.deliveryOrder);
                setDeliveryDetail(orderList);
                const warehouseOptions = result.warehouseSelectList.map((warehouse) => ({
                    label: `${warehouse.name}(${result.deliveryOrder.productName}) `,
                    value: JSON.stringify({
                        warehouseName: `${warehouse.name}(${result.deliveryOrder.productName}) `,
                        warehouseId: warehouse.warehouseId,
                        totalProductStock: warehouse.totalProductStock,
                    }), // ✅ 객체를 문자열로 변환하여 저장
                }));
                setWarehouseOptions(warehouseOptions);

                const managerOptions = result.deliveryManager.map((manager) => ({
                    label: manager.name,
                    value: manager.name,
                }));

                setManagerOptions(managerOptions);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateShoppingDelivery = async () => {
        if (limitOrderCount > 0) {
            console.log(limitOrderCount);
            Swal.fire({
                icon: "warning",
                title: "주문 수량이 맞지 않습니다.",
                confirmButtonText: "확인",
            });
            return;
        }
        const result = await Swal.fire({
            icon: "question",
            title: "알람",
            text: "배송 요청하시겠습니까?",
            showCancelButton: true, // cancel 버튼 보이기
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "예",
            cancelButtonText: "아니오",
        });

        // 사용자가 "예"를 눌렀을 경우 API 호출
        if (result.isConfirmed) {
            const response = await postApi(ShoppingOrders.saveDelivers, {
                deliveryManager: selectManagerValue,
                warehouseList: selectWarehouseValueList,
                productId: deliveryDetail[0].productId,
                orderId: deliveryDetail[0].orderId,
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

    const handlerWarehouseOptions = (newValue) => {
        setWarehouseName(newValue.warehouseName);
        setWarehouseId(newValue.warehouseId);
        setTotalProductStock(newValue.totalProductStock);
    };

    const deleteAllWareHouseList = () => {
        const newLimitOrderCount = deliveryDetail[0].count;
        setLimitOrderCount(newLimitOrderCount);
        setWarehouseList([]);
    };

    const deleteWarehouseList = (warehouseId: number, closeCount: number) => {
        setWarehouseList((prevList) => prevList.filter((item) => item.warehouseId !== warehouseId));
        setSelectWarehouseValueList((prevList) => prevList.filter((item) => item.warehouseId !== warehouseId));
        setLimitOrderCount(limitOrderCount + closeCount);
    };

    const handlerOrderCount = () => {
        if (orderCount <= 0) {
            Swal.fire({
                icon: "warning",
                title: "주문 수량은 0 이상입니다.",
                confirmButtonText: "확인",
            });
            return;
        } else if (orderCount > limitOrderCount) {
            Swal.fire({
                icon: "warning",
                title: `주문 가능 수량은 ${limitOrderCount}개입니다.`,
                confirmButtonText: "확인",
            });
            return;
        } else if (orderCount > totalProductStock) {
            Swal.fire({
                icon: "warning",
                title: `주문 가능 수량은 ${totalProductStock}개입니다.`,
                confirmButtonText: "확인",
            });
            return;
        }

        const selectWarehouseValue: IWarehouseValue = {
            orderCount,
            warehouseId,
        };

        setSelectWarehouseValueList((prevList) => {
            const existingIndex = prevList.findIndex((item) => item.warehouseId === warehouseId);
            if (existingIndex !== -1) {
                const updatedList = [...prevList];
                const newOrderCount = updatedList[existingIndex].orderCount + orderCount;
                if (newOrderCount > totalProductStock) {
                    alert(`최대 주문 가능 수량은 ${totalProductStock}개입니다.`);
                    return prevList; // 🚨 기존 상태 그대로 유지 (변경 없음)
                }

                updatedList[existingIndex] = {
                    ...updatedList[existingIndex],
                    orderCount: newOrderCount,
                };
                return updatedList;
            } else {
                return [...prevList, selectWarehouseValue];
            }
        });

        const warehouseListData: IWarehouseList = {
            warehouseId,
            warehouseName,
            totalProductStock,
            orderCount,
        };
        setWarehouseList((prevList) => {
            const existingIndex = prevList.findIndex((item) => item.warehouseName === warehouseName);
            if (existingIndex !== -1) {
                const updatedList = [...prevList];
                const newOrderCount = updatedList[existingIndex].orderCount + orderCount;
                if (newOrderCount > totalProductStock) {
                    alert(`최대 주문 가능 수량은 ${totalProductStock}개입니다.`);
                    return prevList; // 🚨 기존 상태 그대로 유지 (변경 없음)
                }

                updatedList[existingIndex] = {
                    ...updatedList[existingIndex],
                    orderCount: newOrderCount,
                };
                return updatedList;
            } else {
                return [...prevList, warehouseListData];
            }
        });
        setLimitOrderCount(limitOrderCount - orderCount);
        setOrderCount(0);
    };

    return (
        <ShoppingOrdersDeliveryModalStyled>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className='container'>
                    <dt>
                        <strong>배송지시서 작성 창</strong>
                    </dt>
                    <div className='deliveryOrder'>
                        <label>배송지시서</label>
                        <StyledTable
                            data={deliveryDetail}
                            columns={orderColumns}
                            renderCell={(row, column) => {
                                if (column.key === "deliveryManager") {
                                    return (
                                        <StyledSelectBox
                                            options={managerOptions}
                                            value={selectManagerValue}
                                            onChange={setSelectManagerValue}
                                        />
                                    );
                                }
                                return row[column.key as keyof IShoppingOrder];
                            }}
                        />
                        <div className='button-container'>
                            <StyledButton size='small' onClick={updateShoppingDelivery}>
                                저장
                            </StyledButton>
                            <StyledButton variant='danger' size='small' onClick={deleteAllWareHouseList}>
                                수정
                            </StyledButton>
                        </div>
                    </div>

                    <label>창고별 품목 추가</label>
                    <div className='warehouseSelect'>
                        <StyledSelectBox
                            options={warehouseOptions}
                            onChange={(e: string | undefined) => {
                                if (!e) return; // ✅ 값이 없으면 실행하지 않음
                                try {
                                    const parsedValue = JSON.parse(e);
                                    handlerWarehouseOptions(parsedValue);
                                } catch (error) {
                                    console.error("JSON 파싱 오류:", error);
                                }
                            }}
                        />
                        <span>총 재고 건수</span>
                        <StyledInput size='tiny' type='number' value={totalProductStock ?? 0} readOnly />
                        <span>주문 개수 입력</span>
                        <StyledInput
                            size='tiny'
                            type='number'
                            max={limitOrderCount}
                            min={0}
                            value={orderCount ?? 0} // ✅ undefined 방지
                            onChange={(e) => {
                                const newValue = Number(e.target.value);
                                setOrderCount(isNaN(newValue) ? 0 : newValue); // ✅ NaN 방지
                            }}
                        />
                        <StyledButton size='small' variant='secondary' onClick={handlerOrderCount}>
                            추가
                        </StyledButton>
                    </div>
                    <div className='warehouseList'>
                        {!!warehouseList.length && (
                            <WarehouseList warehouseList={warehouseList} deleteWarehouseList={deleteWarehouseList} />
                        )}{" "}
                    </div>
                    <div className='button-container'>
                        <StyledButton size='small' onClick={() => setModal(!modal)}>
                            취소
                        </StyledButton>
                    </div>
                </div>
            )}
        </ShoppingOrdersDeliveryModalStyled>
    );
};
