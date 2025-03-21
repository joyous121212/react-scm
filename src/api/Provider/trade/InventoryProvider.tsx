import React, { FC, createContext, useState } from "react";

interface ISearchKeyword {
    searchTitle?: object;
    setSearchTitle?: React.Dispatch<React.SetStateAction<object>>;
}

export const InventoryContext = createContext<ISearchKeyword>({});

export const InventoryProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchTitle, setSearchTitle] = useState<object>({});
    return <InventoryContext.Provider value={{ searchTitle, setSearchTitle }}>{children}</InventoryContext.Provider>;
};
