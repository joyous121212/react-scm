import { createContext, FC, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
    setUserType?: React.Dispatch<React.SetStateAction<string>>;
}

export const ProductsContext = createContext<ISearchKeyword>({});

export const ProductsProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({children}) => {
    const [searchKeyword, setSearchKeyword] = useState({});

    return (
        <ProductsContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </ProductsContext.Provider>
    )
}