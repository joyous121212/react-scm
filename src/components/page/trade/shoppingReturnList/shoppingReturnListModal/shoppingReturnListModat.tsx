import { FC, useEffect, useState } from "react";
import { StyledInput } from "../../../../common/StyledInput/StyledInput";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../../stores/modalState";
import { searchApi } from "../../../../../api/CommonCodeApi/searchApi";
import { CommonCode } from "../../../../../api/api";
import { postApi } from "../../../../../api/CommonCodeApi/postApi";
import { ICommonCode } from "../../../../../models/interface/ICommonCode";
import { ShoppingReturnListModalStyle } from "./styled";

interface IShoppingReturnListModalProps {
    postSuccess: () => void;
}

export const ShoppingReturnModal: FC<IShoppingReturnListModalProps> = ({ postSuccess }) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [shoppingReturn, setShoppingReturn] = useState();

    useEffect(() => {}, []);

    const commonCodeDetail = async () => {};

    const updateCommonCode = async () => {};

    return <ShoppingReturnListModalStyle></ShoppingReturnListModalStyle>;
};
