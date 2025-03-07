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
    const [detail, setDetail] = useState<IProducts>();

    const columns = [
            { key: "productId", title: "제품 ID", width: "200px"},
            { key: "categoryName", title: "제품 분류", width: "200px"},
            { key: "productNumber", title: "제품 번호", width: "200px"},
            { key: "name", title: "제품명", width: "200px"},
            { key: "supplyName", title: "제조사", width: "200px"},
            { key: "sellPrice", title: "판매 가격", width: "200px"},
        ] as Column<IProducts>[];
    const renderDetails = (row: IProducts) => (
        <textarea value={row.description || ""} readOnly style={{ width: "100%", height: "100px", resize: "none" }} />
    );

    useEffect(() => {
        productId && productsDetail();
        console.log("detail=", detail);

        return () => {
            setProductId(0);
        }
    }, [detail])

    const productsDetail = async () => {
        try {
            const result = await searchApi<IProductsBodyResponse>(
                Products.searchDetail,
                {productId}
            );
            console.log(result);

            if(result) {
                setDetail(result.detailValue);
                console.log("detail 설정됨:", result.detailValue);

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

    return (
        <ProductsModalStyled>
            <div className="container">
            <table>
                <tbody>
                    <tr>
                        <th rowSpan={4}>
                            <img className="product-image" src="product_image_url" alt="상품 이미지" />
                        </th>
                        <th>제품 번호</th>
                        <td><input type="text" value="DS124" /></td>
                    </tr>
                    <tr>
                        <th>제조사</th>
                        <td><input type="text" value="시놀로지" /></td>
                    </tr>
                    <tr>
                        <th>판매 가격</th>
                        <td><input type="text" value="1,240,000" /></td>
                    </tr>
                    <tr>
                        <th>납품 희망일자</th>
                        <td><input type="date" /></td>
                    </tr>
                    <tr>
                        <th colSpan={3}>제품 상세 정보</th>
                    </tr>
                    <tr>
                        <td colSpan={3}>
                            <textarea className="text-area">시놀로지 나스 DS124 1Bay NAS 스토리지 케이스</textarea>
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
