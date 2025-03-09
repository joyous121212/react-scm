
import { SupplierInfoProvider } from "../../api/Provider/SupplierInfoProvider"
import { SupplierInfoSearch } from "../../components/page/Management/SupplierInfo/SupplierInfoSearch/SupplierInfoSearch"
import { SupplierInfoMain } from "../../components/page/Management/SupplierInfo/SupplierInfoMain/SupplierInfoMain"
export const SupplierInfo =()=>{


    return (<SupplierInfoProvider>
<SupplierInfoSearch></SupplierInfoSearch>
<SupplierInfoMain></SupplierInfoMain>
    </SupplierInfoProvider>)
}