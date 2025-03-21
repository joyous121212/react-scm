import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { SupplierInfo } from "../../../../../api/api";
import { searchSupplyDetailApi } from "../../../../../api/SupplierInfoApi/searchSupplyDetailApi";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { SupplierInfoContext } from "../../../../../api/Provider/SupplierInfoProviderS";
import { useContext } from "react";
export const SupplierInfoListMain = () => {
    const navigate = useNavigate();
    const { search } = useLocation();

    const [cPage, setCPage] = useState<number>(0);
    const { detailSearchKeyword, setDetailSearchKeyword } = useContext(SupplierInfoContext);

    const columns = [
        { key: "supplyName", title: "납품업체명" },
        { key: "detailName", title: "제품분류" },
        { key: "productNumber", title: "제품번호" },
        { key: "name", title: "제품명" },
        { key: "sellPrice", title: "납품단가" },
    ] as Column<any>[];

    const [productList, setProductList] = useState([]);
    const [productCnt, setProductCnt] = useState();
    const { supplyId } = useParams();

    async function searchFnc(currentPage?: number) {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("supplyId", supplyId);
        searchParam.append("pageSize", "5");
        searchParam.append("currentPage", currentPage.toString());

        console.log(searchParam);

        const res: any = await searchSupplyDetailApi(SupplierInfo.searchSupplierDetailList, searchParam);
        console.log(res);

        if (res) {
            setProductList(res.productList);
            setProductCnt(res.productCnt);
            setCPage(currentPage);
        }
    }

    useEffect(() => {
        if (supplyId != undefined) {
            searchFnc();
        }
    }, [supplyId]);

    return (
        <>
            <CommonCodeMainStyled>
                {productList != null ? (
                    <>
                        <StyledTable data={productList} columns={columns} />
                    </>
                ) : (
                    <></>
                )}
            </CommonCodeMainStyled>

            <PageNavigate totalItemsCount={productCnt} onChange={searchFnc} itemsCountPerPage={5} activePage={cPage} />

            <div className='' style={BtnArea}>
                <StyledButton
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    뒤로가기
                </StyledButton>
            </div>
        </>
    );
};

const BtnArea: React.CSSProperties = {};

const Marigin: React.CSSProperties = {
    marginTop: "0px !important",
};
