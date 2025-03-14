import { createContext, FC, ReactNode, useState } from "react";

interface ISearchValue {
    searchValue?: object;
    setSearchValue?: React.Dispatch<React.SetStateAction<object>>;
}

export const OrdersReturnListContext = createContext<ISearchValue>({});

export const OrdersReturnListProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchValue, setSearchValue] = useState<object>({});
    return (
        <OrdersReturnListContext.Provider value={{ searchValue, setSearchValue }}>
            {children}
        </OrdersReturnListContext.Provider>
    );
};
