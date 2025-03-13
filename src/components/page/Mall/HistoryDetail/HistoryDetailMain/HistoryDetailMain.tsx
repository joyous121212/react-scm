import { useLocation, useNavigate } from "react-router-dom";
import { HistoryDetailMainStyled, HistoryDetailStyled } from "./styled"
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { searchApi } from "../../../../../api/MallApi/searchApi";
import { IHistoryDetailList, IHistoryDetailListBodyResponse } from "../../../../../models/interface/IHistory";
import { History } from "../../../../../api/api";
import { useEffect, useState } from "react";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { HistorySearchStyled } from "../../History/HistorySearch/styled";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { Portal } from "../../../../common/potal/Portal";
import { HistoryDetailModal } from "../HistoryDetailModal/HistoryDetailModal";
import { postApi } from "../../../../../api/MallApi/postApi";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";

export const HistoryDetailMain = () => {
    const navigate = useNavigate();
    const [historyDetail, setHistoryDetail] = useState<IHistoryDetailList[]>([]);
    const [returnResultCount, setReturnResultCount] = useState<number>(0);
    const { state } = useLocation();
    const orderId = state.orderId;
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState(modalState);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    

    useEffect(() => {
        searchHistoryDetail();
        console.log(state.salesState);
    }, []);

    const columns = [
        { key: "select", title: "체크" },
        { key: "returnCount", title: "반품 수량" },
        { key: "detailName", title: "제품 구분"},
        { key: "productName", title: "제품명"},
        { key: "supplyName", title: "제조사"},
        { key: "price", title: "제품 가격"},
        { key: "count", title: "주문 수량"},
        { key: "totalPrice", title: "결제 금액"},
    ] as Column<IHistoryDetailList>[];
      
    const searchHistoryDetail = async(currentPage?: number) => {
        setIsLoading(true);
        currentPage = currentPage || 1;
        
        try {
            const result = await searchApi<IHistoryDetailListBodyResponse>(History.searchDetail, {
                currentPage: 1,
                pageSize: 5,
                orderId: state.orderId,
            });
            
            if(result) {
                // 데이터 형식 확인 및 변환
                if (Array.isArray(result.historyDetail)) {
                    setHistoryDetail(result.historyDetail);
                } else if (result.historyDetail) {
                    // 단일 객체인 경우 배열로 변환
                    setHistoryDetail([result.historyDetail]);
                    setReturnResultCount(result.returnResultCount);
                } else {
                    // 데이터가 없는 경우
                    setHistoryDetail([]);
                }
                
                console.log("API Response Type:", typeof result.historyDetail);
                console.log("API Response:", result.historyDetail);
            }
        } catch (error) {
            console.error("Error fetching history details:", error);
            setHistoryDetail([]);
        } finally {
            setIsLoading(false);
        }
    }   
    
    const salesComplete = async() => {
            if (selectedOrders.length === 0) {
                alert("구매 확정할 주문을 선택해주세요.");
                return;
            }

            if(!confirm('구매 확정하시겠습니까?')) {
                return;
            } else {
                const result = await postApi(History.salesComplete, {
                    orderId
                });
        
                if (result.result === "success") {
                    alert("구매 확정되었습니다.");
                    postSuccess();
                }
            }            
        }

    const handlerModal = (id: number, e:React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (selectedOrders.length === 0) {
            alert("반품할 주문을 선택해주세요.");
            return;
        }

        if (count === 0) {
            alert("반품 수량을 1개 이상 입력해주세요.");
            return;
        }
        setModal(!modal);
    }

    

    const postSuccess = () => {
        setModal(!modal);
        navigate("/react/mall/history"); // 리디렉션
    };

    const toggleSelect = (orderId: number) => {
        setSelectedOrders((prev) => 
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handlerButton = () => {
        console.log('handlerButton called'); // 함수 호출 확인 로그
        if (state.salesState === "salesRequest" || state.salesState === "salesComplete" ||
                state.salesState === "mallReturnsRequest" || state.salesState === "mallReturnsComplete") {
            return false;
        } 
        console.log(handlerButton);
        return true;
        
    }

    return (
        <HistoryDetailMainStyled>
            <StyledTable 
                data={historyDetail}
                columns={columns}
                renderCell={(row, column) => {
                    if(state.salesState === "mallReturnsRequest" || state.salesState === "mallReturnsComplete") {
                            if (column.key === "select") {
                                return (
                                    <input type="checkbox" disabled/>
                                )
                            } 
                            if (column.key === "returnCount") {
                            
                                return (
                                    <span className="font_red">{returnResultCount}</span>
                                )
                            }   
                    } else if(state.salesState === "salesRequest" || state.salesState === "salesComplete") {
                        if (column.key === "select") {
                            return (
                                <input type="checkbox" disabled/>
                            )
                        }
                        
                        if (column.key === "returnCount") {
                            
                            return (
                                <span>0</span>
                            )
                        }
                    } else {
                        if (column.key === "select") {
                            return (
                                <input 
                                    type="checkbox"
                                    checked={selectedOrders.includes(row.orderId)}
                                    onChange={() => toggleSelect(row.orderId)}
                                />
                            )
                        }
                        if (column.key === "returnCount") {
                            
                            return (
                                <StyledInput size="small" defaultValue={0} type='number' min={0} max={row.count}
                                    onChange={(e) => {setCount(Number(e.target.value))}}/>
                            )
                        }
                    }
                    
                    if (column.key === "totalPrice") {
                        const totalPrice = row.count * row.price;
                        return totalPrice.toLocaleString("ko-KR");
                    }

                    if (column.key === "price") {
                        return row.price.toLocaleString("ko-KR");
                    }
                    return row[column.key as keyof IHistoryDetailList];
                }}
            />
            <HistoryDetailStyled>
                {handlerButton() && (
                    <StyledButton onClick={(e) => handlerModal(state.orderId, e)}>반품 신청</StyledButton>
                )}
                {handlerButton() && (
                    <StyledButton onClick={salesComplete}>구매 확정</StyledButton>
                )}
                <StyledButton onClick={() => navigate(-1)}>뒤로가기</StyledButton>
            </HistoryDetailStyled>
            {
                modal && (
                    <Portal>
                        <HistoryDetailModal orderId={state.orderId} returnCount={count} postSuccess={postSuccess}/>
                    </Portal>
                )
            }
        </HistoryDetailMainStyled>
    )
}