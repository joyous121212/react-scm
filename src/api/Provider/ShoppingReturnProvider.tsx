import { createContext, FC, ReactNode, useState } from "react";

interface ISearchValue {
    searchValue?: object;
    setSearchValue?: React.Dispatch<React.SetStateAction<object>>;
}

export const ShoppingReturnContext = createContext<ISearchValue>({});

export const ShoppingReturnProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchValue, setSearchValue] = useState<object>({});
    return (
        <ShoppingReturnContext.Provider value={{ searchValue, setSearchValue }}>
            {children}
        </ShoppingReturnContext.Provider>
    );
};
