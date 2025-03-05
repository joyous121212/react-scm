import { ProductsMainStyled } from "./styled"
import { StyledTd, StyledTh } from './../../../../common/styled/StyledTable';
import { searchApi } from "../../../../../api/ProductsApi/searchApi";
import { Products } from "../../../../../api/api";
import { useEffect, useState } from "react";
import { IProducts, IProductsListBodyResponse } from "../../../../../models/interface/IProducts";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductsSearchStyled } from "../ProductsSearch/styled";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { Row } from "react-bootstrap";

export const ProductsMain = () => {
    const {search} = useLocation();
    const [productsList, setProductsList] = useState<IProducts[]>([]);
    const [productsCount, setProductsCount] = useState<number>(0);
    const [cPage, setCPage] = useState<number>(0);
    const navigate = useNavigate();

    const columns = [
        { key: "productId", title: "제품 ID"},
        { key: "categoryName", title: "제품 분류"},
        { key: "productNumber", title: "제품 번호", clickable: true},
        { key: "name", title: "제품명"},
        { key: "supplyName", title: "제조사"},
        { key: "sellPrice", title: "판매 가격"},
    ] as Column<IProducts>[];

    useEffect(() => {
        searchProductsList();
    }, [search]);

    const searchProductsList = async(currentPage?: number) => {
        currentPage = currentPage || 1;
        const searchParam = new URLSearchParams(search);
        searchParam.append("currentPage", currentPage.toString());
        searchParam.append("pageSize", "5"); 

       const result = await searchApi<IProductsListBodyResponse, URLSearchParams>(Products.searchList, searchParam);
        
       if(result) {
        console.log(result);
            setProductsList(result.products);
            setProductsCount(result.productsCnt);
            setCPage(currentPage);
       }
    }

    return (
        <ProductsMainStyled>  
            <StyledTable 
                data={productsList}
                columns={columns}
                onCellClick={(row, column) => {
                    if(column === "productNumber") {
                        // TODO
                        console.log(row.productId);
                    }
                }}
            />

            {/* <StyledTable>
                <thead>
                    <tr>
                        <StyledTh>제품 ID</StyledTh>
                        <StyledTh>제품 분류</StyledTh>
                        <StyledTh>제품 번호</StyledTh>
                        <StyledTh>제품명</StyledTh>
                        <StyledTh>제조사</StyledTh>
                        <StyledTh>판매 가격</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {productsList?.length > 0 ? (
                        productsList.map((product) => {
                            return (
                                <tr key={`${product.productId}-${product.supplyId}`}>
                                    <StyledTd>{product.productId}</StyledTd>
                                    <StyledTd>{product.categoryName}</StyledTd>
                                    <StyledTd>{product.productNumber}</StyledTd>
                                    <StyledTd>{product.name}</StyledTd>
                                    <StyledTd>{product.supplyName}</StyledTd>
                                    <StyledTd>{product.sellPrice}</StyledTd>
                                </tr>
                            )
                        })
                    ): (
                        <tr>
                            <StyledTd colSpan={6}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}

                    
                </tbody>
            </StyledTable> */}
        </ProductsMainStyled>
    )
}