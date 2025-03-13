import { createContext, FC, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
    userType?: string;
    setUserType?: React.Dispatch<React.SetStateAction<string>>;
}

export const ProfitCheckContext = createContext<ISearchKeyword>({});

export const ProfitCheckProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({children}) => {
    const [searchKeyword, setSearchKeyword] = useState({});
    const [ userType, setUserType ] = useState<string>("");

    return (
        <ProfitCheckContext.Provider value={{ searchKeyword, setSearchKeyword, userType, setUserType }}>
            {children}
        </ProfitCheckContext.Provider>
    )
}