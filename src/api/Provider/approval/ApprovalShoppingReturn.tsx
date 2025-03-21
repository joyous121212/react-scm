import React, { FC, createContext, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
}

export const ApprovalShoppingReturnContext = createContext<ISearchKeyword>({});

export const ApprovalShoppingReturnProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState<object>({});
    return (
        <ApprovalShoppingReturnContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </ApprovalShoppingReturnContext.Provider>
    );
};
