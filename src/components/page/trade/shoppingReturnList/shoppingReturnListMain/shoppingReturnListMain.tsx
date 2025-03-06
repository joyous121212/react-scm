import { useContext, useEffect, useState } from "react";
import { StyledButton } from "../../../../common/StyledButton/StyledButton";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { useNavigate } from "react-router-dom";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { ICommonCode, ICommonCodeResponse } from "../../../../../models/interface/ICommonCode";
import { Column, StyledTable } from "../../../../common/StyledTable/StyledTable";
import { ShoppingReturnListMainStyled } from "./styled";
import { ShoppingReturnListContext } from "../../../../../api/Provider/trade/ShoppingReturnListProvider";

export const ShoppingReturnListMain = () => {
    const { searchKeyword } = useContext(ShoppingReturnListContext);
    const [shoppingReturnList, setShoppingReturnList] = useState([]);
    const [modal, setModal] = useRecoilState(modalState);
    const [shoppingReturnId, setShoppingReturnId] = useState<number>(0);
    const navigate = useNavigate();

    // const columns = [
    //     { key: "groupIdx", title: "번호" },
    //     { key: "groupCode", title: "그룹코드" },
    //     { key: "groupName", title: "그롭코드명" },
    //     { key: "note", title: "그룹코드설명" },
    //     { key: "createdDate", title: "등록일" },
    //     { key: "useYn", title: "사용여부" },
    //     { key: "actions", title: "비고" },
    // ] as Column<ICommonCode>[];

    useEffect(() => {
        console.log(searchKeyword);
        searchShoppingReturn();
    }, [searchKeyword]);

    const searchShoppingReturn = async (currentPage?: number) => {};

    const handlerModal = (id: number) => {
        setModal(!modal);
        setShoppingReturnId(id);
    };

    const postSuccess = () => {
        setModal(!modal);
        searchShoppingReturn();
    };

    return <ShoppingReturnListMainStyled></ShoppingReturnListMainStyled>;
};
