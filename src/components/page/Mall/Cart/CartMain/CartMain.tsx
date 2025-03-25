import { useEffect, useState } from "react";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable"
import HorizonLine, { CartMainStyled } from "./styled"
import { ICart, ICartDetailWithImage, ICartListBodyResponse } from "../../../../../models/interface/ICart";
import { searchApi } from "../../../../../api/MallApi/searchApi";
import { Cart } from "../../../../../api/api";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { postApi } from "../../../../../api/MallApi/postApi";
import Swal from "sweetalert2";
import noData from "../../../../../assets/noData.png";

export const CartMain= () => {
    const [cartList, setCartList] = useState<ICartDetailWithImage[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [cartdetailIdList, setCartdetailIdList] = useState<any[]>([]);
    
    const columns = [
        { key: "select", title: (<><input type="checkbox" 
                                        onChange={(e) => {selectAll((e.target as HTMLInputElement).checked)}}
                                        checked={selectedRows.length === cartList.length && cartList.length > 0}></input> 선택 </>) },
        { key: "image", title: "제품사진"},
        { key: "name", title: "제품명"},
        { key: "price", title: "가격"},
        { key: "count", title: "수량"},
        { key: "totalPrice", title: "총금액"},
        { key: "requestedDeliveryDate", title: "납품 희망날짜"},
        { key: "actions", title: "삭제"},
    ] as Column<ICart>[];

    useEffect(() => {
        searchCart();        
    }, []);

    const searchCart = async (currentPage?: number) => {   
        currentPage = currentPage || 1; 
        const result = await searchApi<ICartListBodyResponse>(Cart.searchList, {
            currentPage,
            pageSize: 5,
        })
        if(result) {
            setCartList(result.cartDetailWithImage);
            calculateTotalAmount(result.cartDetailWithImage);
            calculateSelectedPrice(selectedRows, result.cartDetailWithImage);
        }
    };

    const calculateTotalAmount = (cartData: ICartDetailWithImage[]) => {
        const total = cartData.reduce((sum, item) => sum + item.cartDetail.count * item.cartDetail.price, 0);
        setTotalAmount(total);
    };

    const calculateSelectedPrice = (selectedIds: number[], cartData: ICartDetailWithImage[]) => {
        const selectedTotal = cartData
            .filter(item => selectedIds.includes(item.cartDetail.cartdetailId))
            .reduce((sum, item) => sum + item.cartDetail.count * item.cartDetail.price, 0);
        setSelectedPrice(selectedTotal);
    };

    const handlerCheckboxChange = (cartdetailId: number) => {
        setSelectedRows(prev => 
            {const newSelected = prev.includes(cartdetailId) 
                ? prev.filter(id => id !== cartdetailId) 
                : [...prev, cartdetailId];

                calculateSelectedPrice(newSelected, cartList);
                setCartdetailIdList(newSelected);
                return newSelected;
            }
        );
    };

    const deleteCartDetail = async (cartdetailId) => {
        const confirm = await Swal.fire({
            icon: "question",
            title: "알람",
            text: "삭제하시겠습니까?",
            showCancelButton: true, // cancel 버튼 보이기
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "예",
            cancelButtonText: "아니오",
        });        
        
        if(!confirm.isConfirmed) {
            return;
        } else {
            const result = await postApi(Cart.deleteCartDetail, { cartdetailId });
            if (result.result === "success") {
                Swal.fire({
                    icon: "success",
                    title: "삭제 완료",
                    confirmButtonText: "확인",
                }).then(() => {
                    postSuccess(); // 승인 후 실행할 함수                    
                });
            }
        }        
    };

    const postSuccess = () => {
        searchCart();
        setSelectedRows([]);
    };

    const order = async () => {

        const cartdetailIdListString = cartdetailIdList.map(String);
        
        if(selectedRows.length < 1) {
            Swal.fire({
                icon: "warning",
                title: '선택한 상품이 없습니다.',
                confirmButtonText: "확인",
            });
            return;
        }

        const confirm = await Swal.fire({
            icon: "question",
            title: "알람",
            text: "입금하시겠습니까?",
            showCancelButton: true, // cancel 버튼 보이기
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "예",
            cancelButtonText: "아니오",
        });

        if(!confirm.isConfirmed) {
            return;
        } else {
            const result = await postApi(Cart.historysSave, cartdetailIdListString);
            if (result.result === "success") {
                Swal.fire({
                    icon: "success",
                    title: "주문 완료",
                    confirmButtonText: "확인",
                }).then(() => {
                    postSuccess(); // 승인 후 실행할 함수
                });
            }
        }
        
    }

    const selectAll = (checked: boolean) => {
        if (checked) {
            const allIds = cartList.map(item => item.cartDetail.cartdetailId);
            setSelectedRows(allIds);
            setCartdetailIdList(allIds);
            calculateSelectedPrice(allIds, cartList);
        } else {
            setSelectedRows([]);
            setCartdetailIdList([]);
            calculateSelectedPrice([], cartList);
        }
    }

    const selectDelete = async(cartdetailIdList) => {
        if(selectedRows.length === 0) {
            await Swal.fire({
                icon: "warning",
                title: "선택한 상품이 없습니다.",
                confirmButtonText: "확인",
            })
            return;
        }
        const confirm = await Swal.fire({
            icon: "question",
            title: "알람",
            text: "삭제하시겠습니까?",
            showCancelButton: true, // cancel 버튼 보이기
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "예",
            cancelButtonText: "아니오",
        });        
        
        if(!confirm.isConfirmed) {
            return;
        } else {
            const result = await postApi(Cart.deleteCartDetail, { cartdetailIdList });
            if (result.result === "success") {
                Swal.fire({
                    icon: "success",
                    title: "삭제 완료",
                    confirmButtonText: "확인",
                }).then(() => {
                    postSuccess(); // 승인 후 실행할 함수
                });
            }
        }  
    }

    return (
        <CartMainStyled>
            <StyledTable
                data={cartList.map(item => ({
                    ...item.cartDetail,
                    image: item?.image?.logicalPath || null,
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
                    if (column.key === "image") {
                        return (
                            <img 
                                src={row.image || noData} 
                                onError={(e) => {
                                    e.currentTarget.src = noData;
                                }}
                                style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                        );
                    }
                    if (column.key === "totalPrice") {
                        const totalPrice = row.count * row.price;
                        return `${totalPrice.toLocaleString("ko-KR")}원`;
                    }
                    if (column.key === "price") {
                        return `${row.price.toLocaleString("ko-KR")}원`;
                    }
                    if (column.key === "requestedDeliveryDate") {
                        return row.requestedDeliveryDate.split(" ")[0]; // 날짜 부분만 출력
                    }
                    return row[column.key as keyof ICart];
                }}
                renderAction={(row) => (
                    <StyledButton size='small' onClick={() => deleteCartDetail(row.cartdetailId)}>
                        삭제
                    </StyledButton>
                )}
            />
            {cartList.length !== 0 && <div className="divAllCancel">
                <StyledButton variant="danger" onClick={() => selectDelete(cartdetailIdList)}>선택삭제</StyledButton>
            </div>}
            

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                <h3>장바구니 총액</h3>  
                <HorizonLine style={{ width: "200px" }}/>     
                <div className="divToAmt" style={{ marginBottom: "20px"}}>
                    <label><strong>전체금액:<br></br></strong></label>
                    <StyledInput size="small" value={`${totalAmount.toLocaleString("ko-KR")}원`} readOnly/>  
                </div>
                <div className="divToAmt">
                    <label><strong>선택금액:<br></br></strong> </label>
                    <StyledInput size="small" value={`${selectedPrice.toLocaleString("ko-KR")}원`} readOnly/>
                </div>   
                          
                <div className="divOrder">
                    <StyledButton onClick={order}>주문</StyledButton>
                </div>
                
            </div>
        </CartMainStyled>
    )
};