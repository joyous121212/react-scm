import React, { FC, createContext, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
}

export const ApprovalOrderContext = createContext<ISearchKeyword>({});

export const ApprovalOrderProvider: FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState<object>({});
    return (
        <ApprovalOrderContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </ApprovalOrderContext.Provider>
    );
};
