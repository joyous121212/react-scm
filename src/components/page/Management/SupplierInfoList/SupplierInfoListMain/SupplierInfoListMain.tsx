import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { SupplierInfo } from "../../../../../api/api";
import { searchSupplyDetailApi } from "../../../../../api/SupplierInfoApi/searchSupplyDetailApi";
import { StyledTable } from "../../../../common/StyledTable/StyledTable";
import { CommonCodeMainStyled } from "../../CommonCode/CommonCodeMain/styled";
import { StyledButton } from "../../../../common/StyledButton/StyledButton"
import { Column } from "../../../../common/StyledTable/StyledTable";
import { PageNavigate } from "../../../../common/pageNavigation/PageNavigate";
import { SupplierInfoContext } from "../../../../../api/Provider/SupplierInfoProvider";
import { useContext } from "react";
export const SupplierInfoListMain = () => {
    const navigate = useNavigate();
    // const { state } = useLocation();

    // 또 서버에선 as 보내내
    // p.product_number AS productNumber
    // ,	p.name AS Name
    // ,	p.sell_price AS sellPrice
    // ,	d.detail_name AS detailName
    // ,	s.name AS supplyName  
const [cPage,setCPage]=useState(0);
const { detailSearchKeyword, setDetailSearchKeyword}= useContext(SupplierInfoContext);
    const detailPageFncApi = async (currentPage?: number) => {
        currentPage = currentPage || 1;
        const box = { ...detailSearchKeyword };
        box.currentPage = currentPage;
        setDetailSearchKeyword(box);
      };









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
    useEffect(() => {

        if (supplyId != undefined) {

            initFnc();
        }
        async function initFnc() {
            const res: any = await searchSupplyDetailApi(SupplierInfo.searchSupplierDetailList,
                {
                    supplyId: supplyId,
                    currentPage: 1,
                    pageSize: 5,
                })
            console.log(res);

            setProductList(res.productList);
            setProductCnt(res.productCnt);

        }


    }, [supplyId])


    return (<>
        <CommonCodeMainStyled >          
            {productList != null ? (<>
                <StyledTable data={productList} columns={columns} />
            </>) : (<></>)}
        </CommonCodeMainStyled>

        <PageNavigate
                totalItemsCount={productCnt}
                onChange={detailPageFncApi}
                itemsCountPerPage={5}
                activePage={cPage}
            /> 


        <div className="" style={BtnArea}>
                <StyledButton onClick={() => { navigate(-1) }}>뒤로가기</StyledButton>
            </div>
    </>)
}

const BtnArea: React.CSSProperties = {
    
}

const Marigin: React.CSSProperties = {
    marginTop: "0px !important"
}


