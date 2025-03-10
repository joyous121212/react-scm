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

export const ProductInfoMain = () => {
    const [updateModal, setUpdateModal] = useRecoilState(modalState);
    const productIdRef = useRef("");

    const { searchKeyword, setSearchKeyword } = useContext(ProductInfoContext);

    const [productList, setProductList] = useState();
    const [productCnt, setProductCnt] = useState();

    const columns = [
        { key: "productNumber", title: "제품번호" },
        { key: "name", title: "제품명" },
        { key: "supplier", title: "납품업체" },
        { key: "sellPrice", title: "판매가" },
    ] as Column<any>[];

    useEffect(() => {
        // map.put("productList", productList);
        // map.put("productCnt", productCnt

        async function initFnc() {
            const res: any = await searchProductListApi(ProductInfo.productList, searchKeyword);
            setProductList(res.productList);
            setProductCnt(res.productCnt);
        }
        initFnc();
    }, [searchKeyword]);

    useEffect(() => {
        console.log(updateModal);
    }, [updateModal]);

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
