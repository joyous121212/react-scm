import React, { FC, createContext, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
}

export const ShoppingOrdersContext = createContext<ISearchKeyword>({});

export const ShoppingOrdersProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState<object>({});
    return (
        <ShoppingOrdersContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </ShoppingOrdersContext.Provider>
    );
};
