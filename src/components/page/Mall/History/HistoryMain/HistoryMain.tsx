import { useContext, useEffect, useState } from "react";
import { History } from "../../../../../api/api";
import { searchApi } from "../../../../../api/MallApi/searchApi";
import { IHistoryList, IHistoryListBodyResponse } from "../../../../../models/interface/IHistory";
import { HistoryMainStyled } from "./styled"
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { HistoryContext } from "../../../../../api/Provider/HistoryProvider";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { useNavigate } from "react-router-dom";

export const HistoryMain = () => {
    const [historyList, setHistoryList] = useState<IHistoryList[]>([]);
    const [historyCount, setHistoryCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const {searchKeyword} = useContext(HistoryContext);
    const navigate = useNavigate();

    const columns = [
            { key: "orderId", title: "주문 번호"},
            { key: "price", title: "결제 금액"},
            { key: "salesDate", title: "주문 일자"},
            { key: "salesState", title: "주문 상태"},
            { key: "requestedDeliveryDate", title: "배송 희망 일자"},
            { key: "deliveryState", title: "배송 상태"},
            { key: "actions", title: "비고"}
        ] as Column<IHistoryList>[];

    useEffect(() => {
        searchHistory();
    },[searchKeyword]);

    const searchHistory = async(currentPage?: number) => {
        currentPage = currentPage || 1;

        const result = await searchApi<IHistoryListBodyResponse>(History.searchList, {
            ...searchKeyword,
            currentPage,
            pageSize: 5,
        });

        if(result) {
            setHistoryList(result.history);
            setCPage(currentPage);
            setHistoryCount(result.historyCnt);
        }
    }
    
        
    return (
        <HistoryMainStyled>
            <StyledTable 
                data={historyList}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "requestedDeliveryDate") {
                        return row.requestedDeliveryDate.split(" ")[0];
                    }
                    if (column.key === "salesDate") {
                        return row.salesDate.split(".")[0];
                    }
                    if (column.key === "price") {
                        const totalPrice = row.count * row.price;
                        return `${totalPrice.toLocaleString("ko-KR")}원`;
                    }
                    if (column.key === "deliveryState") {
                        return row.deliveryState === null ? 
                            <span style={{color: "blue", fontWeight: "bold"}}>배송 준비중</span> : 
                            <span style={{color: "green", fontWeight: "bold"}}>{row.deliveryState}</span>;
                    }
                    if (column.key === "salesState") {
                        const salesStateMap: { [key: string]: {text: string; color: string } } = {
                            salesRequest: {text: "주문 완료", color: "purple"},
                            delivery: {text: "배송 중", color: "orange"},
                            deliveryComplete: {text: "배송 완료", color: "green"},
                            ordering: {text: "배송 중", color: "orange"},
                            salesComplete: {text: "구매 확인", color: "black"},
                            mallReturnsRequest: {text: "반품 신청", color: "red"},
                            mallReturnsComplete: {text: "반품 완료", color: "gray"},
                        };

                        const salesState = salesStateMap[row.salesState] || { text: row.salesState, color: "black" };                    
                        return <span style={{color: salesState.color, fontWeight: "bold"}}>{salesState.text}</span>
                        
                    }
                    return row[column.key as keyof IHistoryList];
                }}
                renderAction={(row) => (
                    <StyledButton size="small" onClick={() => navigate(`${row.orderId}`, { state: {orderId: row.orderId, salesState: row.salesState }})}>
                        상세보기
                    </StyledButton>
                )}
            />
            <PageNavigate 
                totalItemsCount={historyCount}
                onChange={searchHistory}
                itemsCountPerPage={5}
                activePage={cPage}
            />
        </HistoryMainStyled>
    )
}