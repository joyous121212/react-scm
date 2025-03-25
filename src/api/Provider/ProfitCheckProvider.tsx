import { createContext, FC, useState } from "react";

interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
    modalId?: string;
    setModalId?: React.Dispatch<React.SetStateAction<string>>;
}

export const ProfitCheckContext = createContext<ISearchKeyword>({});

export const ProfitCheckProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({children}) => {
    const [searchKeyword, setSearchKeyword] = useState({});
    const [modalId, setModalId] = useState<string>("");

    return (
        <ProfitCheckContext.Provider value={{ searchKeyword, setSearchKeyword, modalId, setModalId }}>
            {children}
        </ProfitCheckContext.Provider>
    )
}