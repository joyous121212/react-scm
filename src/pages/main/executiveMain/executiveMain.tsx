import { ProductSlideshow } from "../../../components/page/main/customerMain/productSlide/slideshow";
import { TopSalesBar } from "../../../components/page/main/executiveMain/topSalesBar/topSalesBar";
import { ExecutiveMainStyled } from "./styled";

export const ExecutiveMain = () => {
    return (
        <ExecutiveMainStyled>
            <div className='label-container'>
                <label>TOP 매출 현황</label>
            </div>
            <div className='topSalesBar'>
                <TopSalesBar />
            </div>
        </ExecutiveMainStyled>
    );
};
