import { useContext, useEffect, useState } from "react";
import { ApprovalOrderContext } from "../../../../../api/Provider/approval/ApprovalOrderProvider";
import { searchApi } from "../../../../../api/ApprovalApi/searchApi";
import { Approval } from "../../../../../api/api";
import { IApprovalShoppingResponse, IApprovalShoppingReturn } from "../../../../../models/interface/IApproval";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { postApi } from "../../../../../api/ApprovalApi/postApi";
import Swal from "sweetalert2";
import { ApprovalShoppingReturnMainStyled } from "./styled";
import { ApprovalShoppingReturnContext } from "../../../../../api/Provider/approval/ApprovalShoppingReturn";
import { Spinner } from "../../../../common/Spinner/spinner";

export const ApprovalShoppingReturnMain = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { searchKeyword } = useContext(ApprovalShoppingReturnContext);
    const [approvalShoppingReturnCount, setApprovalShoppingReturnCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const [approvalShoppingReturnList, setApprovalShoppingReturnList] = useState<IApprovalShoppingReturn[]>([]);

    const columns = [
        { key: "userName", title: "반품고객" },
        { key: "productName", title: "제품명" },
        { key: "shoppingDate", title: "구매일" },
        { key: "returnDate", title: "반품일" },
        { key: "count", title: "수량" },
        { key: "price", title: "금액" },
        { key: "actions", title: "" },
    ] as Column<IApprovalShoppingReturn>[];

    useEffect(() => {
        searchApprovalShoppingReturn();
    }, [searchKeyword]);

    const handlerButton = async (shoppingReturnId: number) => {
        const result = await postApi(Approval.approvalShoppingReturn, { shoppingReturnId });
        if (result.result === "success") {
            Swal.fire({
                icon: "success",
                title: "승인 완료",
                confirmButtonText: "확인",
            }).then(() => {
                searchApprovalShoppingReturn();
            });
        }
    };

    const searchApprovalShoppingReturn = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        setIsLoading(true);

        try {
            const result = await searchApi<IApprovalShoppingResponse>(Approval.searchShoppingReturn, {
                ...searchKeyword,
                currentPage,
                pageSize: 5,
            });

            if (result) {
                setApprovalShoppingReturnList(result.shoppingReturn);
                setCPage(currentPage);
                setApprovalShoppingReturnCount(result.shoppingReturnCnt);
            }
        } catch (error) {
            console.error("Error fetching shopping orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ApprovalShoppingReturnMainStyled>
            {isLoading ? (
                <Spinner />
            ) : (
                <StyledTable
                    data={approvalShoppingReturnList}
                    columns={columns}
                    renderAction={(row) => (
                        <StyledButton size='small' onClick={() => handlerButton(row.refundId)}>
                            승인
                        </StyledButton>
                    )}
                    renderCell={(row, column) => {
                        if (column.key === "price") {
                            const totalPrice = row.count * row.price;
                            return `${totalPrice.toLocaleString("ko-KR")}원`;
                        }
                        return row[column.key as keyof IApprovalShoppingReturn];
                    }}
                />
            )}
            <PageNavigate
                totalItemsCount={approvalShoppingReturnCount}
                onChange={searchApprovalShoppingReturn}
                itemsCountPerPage={5}
                activePage={cPage}
            />
        </ApprovalShoppingReturnMainStyled>
    );
};
