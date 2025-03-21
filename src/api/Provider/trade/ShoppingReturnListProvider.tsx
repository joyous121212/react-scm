import React, { FC, createContext, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
}

export const ShoppingReturnListContext = createContext<ISearchKeyword>({});

export const ShoppingReturnListProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState<object>({});
    return (
        <ShoppingReturnListContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </ShoppingReturnListContext.Provider>
    );
};
