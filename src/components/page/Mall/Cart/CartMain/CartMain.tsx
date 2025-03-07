import { useEffect, useState } from "react";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable"
import { CartMainStyled } from "./styled"
import { ICart, ICartDetailWithImage, ICartListBodyResponse } from "../../../../../models/interface/ICart";
import { searchApi } from "../../../../../api/MallApi/searchApi";
import { Cart } from "../../../../../api/api";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";

export const CartMain= () => {
    const [cartList, setCartList] = useState<ICartDetailWithImage[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const columns = [
        { key: "select", title: "선택" },
        { key: "image", title: "제품사진"},
        { key: "name", title: "제품명"},
        { key: "price", title: "가격"},
        { key: "count", title: "수량"},
        { key: "totalPrice", title: "총금액"},
        { key: "requestedDeliveryDate", title: "납품 희망날짜"},
        { key: "delete", title: "삭제"},
    ] as Column<ICart>[];

    useEffect(() => {
        searchCart();
        console.log(cartList);
    }, []);

    const searchCart = async (currentPage?: number) => {   
        currentPage = currentPage || 1; 
        const result = await searchApi<ICartListBodyResponse>(Cart.searchList, {
            currentPage,
            pageSize: 5,
        })
        if(result) {
            setCartList(result.cartDetailWithImage);
            console.log(cartList);
        }
    };

    const handlerCheckboxChange = (cartdetailId) => {
        setSelectedRows(prev => 
            prev.includes(cartdetailId) ? prev.filter(id => id !== cartdetailId) : [...prev, cartdetailId]
        );
    };

    return (
        <CartMainStyled>
            <StyledTable
                data={cartList.map(item => ({
                    ...item.cartDetail,
                    image: item.image.logicalPath || "default_image_url",
                    select: <input type="checkbox"></input>
                }))}
                columns={columns}
                renderCell={(row, column) => {
                    if (column.key === "select") {
                        return (
                            <input
                                type="checkbox"
                                checked={selectedRows.includes(row.cartdetailId)}
                                onChange={() => handlerCheckboxChange(row.cartdetailId)}
                            />
                        );
                    }
                    if (column.key === "totalPrice") {
                        const totalPrice = row.count * row.price;
                        return totalPrice.toLocaleString("ko-KR");
                    }
                    return row[column.key as keyof ICart];
                }}
            />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                <h3>장바구니 총액</h3>            
                전체금액: 
                <StyledInput size="small" readOnly/>  
                선택금액: 
                <StyledInput size="small" readOnly/>          
                <StyledButton>주문</StyledButton>
            </div>

        </CartMainStyled>
    )
}