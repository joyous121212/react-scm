import { createContext, FC, ReactNode, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
}

export const OrdersListContext = createContext<ISearchKeyword>({});

export const OrdersListProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState<object>({});
    
    return (
        <OrdersListContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</OrdersListContext.Provider>
    );
};
