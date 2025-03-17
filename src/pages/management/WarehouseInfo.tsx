import { WarehouseInfoSearch } from "../../components/page/Management/WarehouseInfo/WarehouseInfoSearch/WarehouseInfoSearch";
import { WarehouseInfoMain } from "../../components/page/Management/WarehouseInfo/WarehouseInfoMain/WarehouseInfoMainS";
import { WarehouseInfoProvider } from "../../api/Provider/WarehouseInfo/WarehouseInfoProvider";
import { ContentBox } from "../../components/common/ContentBox/ContentBox";

export const WarehouseInfo = () => {
    return (
        <>
            <WarehouseInfoProvider>
                <ContentBox variant='primary' fontSize='large'>
                    창고 정보 관리
                </ContentBox>
                <WarehouseInfoSearch />
                <WarehouseInfoMain />
            </WarehouseInfoProvider>
        </>
    );
};
