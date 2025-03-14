import { ProductInfoContext } from "../../../../../api/Provider/ProductInfo/ProductInfoProvider";
import { useContext, useEffect, useState } from "react";
import { searchProductListApi } from "../../../../../api/ProductInfoApi/searchProductListApi";
import { ProductInfo } from "../../../../../api/api";
import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { Column } from "../../../../common/StyledTable/StyledTable";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRef } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { ProductInfoModal } from "../ProductInfoModal/ProductInfoModal";
import { Portal } from "../../../../common/potal/Portal";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { useLocation } from "react-router-dom";

export const ProductInfoMain = () => {
    const { search } = useLocation();
    const [updateModal, setUpdateModal] = useRecoilState(modalState);
    const productIdRef = useRef("");

    const { searchKeyword, setSearchKeyword } = useContext(ProductInfoContext);

    const [productList, setProductList] = useState();
    const [productCnt, setProductCnt] = useState();
    const [cPage, setCPage] = useState<number>(0);
    const columns = [
        { key: "productNumber", title: "제품번호" },
        { key: "name", title: "제품명" },
        { key: "supplier", title: "납품업체" },
        { key: "sellPrice", title: "판매가" },
    ] as Column<any>[];
    async function initFnc(currentPage?: number) {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5");
        searchParam.append("searchOption", searchKeyword.searchOption.toString());
        searchParam.append("searchKeyword", searchKeyword.searchKeyword.toString());

        const res: any = await searchProductListApi(ProductInfo.productList, searchParam);

        if (res) {
            setProductList(res.productList);
            setProductCnt(res.productCnt);
            setCPage(currentPage);
        }
    }
    useEffect(() => {
        initFnc();
    }, [searchKeyword]);

    useEffect(() => {}, [updateModal]);

    return (
        <>
            <CommonCodeMainStyled>
                <StyledTable
                    data={productList}
                    columns={columns}
                    onRowClick={(row) => {
                        console.log(row.productId);
                        productIdRef.current = row.productId;
                        setUpdateModal(!updateModal);
                    }}
                />
            </CommonCodeMainStyled>
            <PageNavigate totalItemsCount={productCnt} onChange={initFnc} itemsCountPerPage={5} activePage={cPage} />

            {updateModal ? (
                <>
                    <Portal>
                        <ProductInfoModal productId={productIdRef.current}></ProductInfoModal>
                    </Portal>
                </>
            ) : (
                <></>
            )}
        </>
    );
};
