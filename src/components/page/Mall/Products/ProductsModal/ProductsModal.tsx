import { useRecoilState } from 'recoil';
import { modalState } from '../../../../../stores/modalState';
import { FC, useEffect, useRef, useState } from 'react';
import { ProductsModalStyled } from './styled';
import { StyledInput } from '../../../../common/StyledInput/StyledInput';
import { StyledButton } from '../../../../common/StyledButton/StyledButton';
import styled from 'styled-components';
import { StyledInputStyled } from '../../../../common/StyledInput/styled';
import { searchApi } from '../../../../../api/ProductsApi/searchApi';
import { Products } from '../../../../../api/api';
import { IProducts, IProductsBodyResponse, IProductsDetail } from '../../../../../models/interface/IProducts';
import { Column, StyledTable } from '../../../../common/StyledTable/StyledTable';
import { ChangeEvent } from 'react';

const HorizontalContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px; // 요소 간 간격
  margin-bottom: 15px; // 다음 입력 필드와의 간격
`;

// 라벨과 입력 필드를 그룹화하는 컴포넌트
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; // 공간을 균등하게 차지
`;

interface IProductsModalProps {
    productId: number;
    postSuccess: () => void;
    setProductId: React.Dispatch<React.SetStateAction<number>>;
}

const initProducts = {
    productId: 0,
    supplyId: 0,
    productNumber: "",
    name: "",
    sellPrice: 0,
    description: "",
    categoryName: "",
    supplyName: "",
    fileName: null,
    fileSize: 0,
    logicalPath: null, 
}

export const ProductsModal: FC<IProductsModalProps> = ({productId, postSuccess, setProductId}) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const formRef = useRef<HTMLFormElement>(null);
    const [imageUrl, setImageUrl] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [detail, setDetail] = useState<IProducts>(initProducts);
    const [attachment, setAttachment] = useState<IProducts>();
    const [sellPrice, setSellPrice] = useState<string>("");

    useEffect(() => {
        productId && productsDetail();
        console.log("detail=", detail);

        return () => {
            setProductId(0);
        }
    }, [productId]);
    
    // detail 값이 변경되면 sellPrice도 업데이트
    useEffect(() => {
        if (detail?.sellPrice) {
            setSellPrice(detail.sellPrice.toLocaleString());
        }
    }, [detail]); // detail이 변경될 때만 실행

    const productsDetail = async () => {
        try {
            const result = await searchApi<IProductsBodyResponse>(
                Products.searchDetail,
                {productId}
            );
            console.log(result);

            if(result) {
                setDetail(result.detailValue);
                setAttachment(result.attachmentValue);
                console.log("detail 설정됨:", result.detailValue);
                console.log("attachment 설정됨:", result.attachmentValue);

                const { fileType, logicalPath } = result.attachmentValue;
                if (fileType === "jpg" || fileType === "gif" || fileType === "png") {
                    setImageUrl(logicalPath);
                } else {
                    setImageUrl("");
                }
            }
        } catch (error) {
            console.error("searchDetail 오류:", error);
        }
    }

    const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        if (fileInfo?.length > 0) {
            const fileSplit = fileInfo[0].name.split(".");
            const fileType = fileSplit[1].toLowerCase();

            if (fileType === "jpg" || fileType === "gif" || fileType === "png") {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            }
            setFileName(fileInfo[0].name)
        }
    }

    return (
        <ProductsModalStyled>
            <div className="container">
            <table>
                <tbody>
                    <tr>
                        <th rowSpan={3}>
                            <img className="product-image" src="product_image_url" alt="상품 이미지" />
                        </th>
                        <th>제품 번호</th>
                        <td><StyledInput size="modal" type="text" defaultValue={productId} readOnly/></td>
                        <th>주문 수량<span className="font_red">*</span></th>
                        <td><StyledInput size="modal" type="text" placeholder='수량 입력 필수'/></td>
                    </tr>
                    <tr>    
                        <th>제조사</th>
                        <td><StyledInput size="modal" type="text" defaultValue={detail.supplyName} readOnly/></td>
                        
                        <th>납품 희망일자<span className="font_red">*</span></th>
                        <td><StyledInput size="modal" type="date"/></td>
                    </tr>
                    <tr>
                        <th>판매 가격</th>
                        <td><StyledInput size="modal" type="text" defaultValue={sellPrice}  readOnly/></td>
                    </tr>
                    <tr>
                        <th colSpan={5}>제품 상세 정보</th>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <textarea className="text-area" defaultValue={detail.description} readOnly></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="button-container">
                <button>장바구니 담기</button>
                <button>주문</button>
                <button onClick={() => setModal(!modal)}>취소</button>
            </div>
        </div>

        </ProductsModalStyled>
    )
}
