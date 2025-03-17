import React, { FC, createContext, useState } from "react";

// searchKeyword 객체의 타입 정의
interface SearchKeyword {
    currentPage: number;
    pageSize: number;
    searchOption: string;
    searchKeyword: string;
}

// ISearchKeyword에서 searchKeyword와 setSearchKeyword의 타입을 정확히 정의
interface IProductSearchKeyword {
    searchKeyword: SearchKeyword;
    setSearchKeyword: React.Dispatch<React.SetStateAction<SearchKeyword>>;
}

// context 생성
export const ProductInfoContext = createContext<IProductSearchKeyword>({
    searchKeyword: {
        currentPage: 1,
        pageSize: 5,
        searchKeyword: "",
        searchOption: "searchAll",
    },
    setSearchKeyword: () => {},
});

// provider를 사용해서 context에 값을 넣어주고, 원하는 곳에 제공할 수 있게 함
export const ProductInfoProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    // 상태 훅을 SearchKeyword 타입으로 초기화
    const [searchKeyword, setSearchKeyword] = useState<SearchKeyword>({
        currentPage: 1,
        pageSize: 5,
        searchKeyword: "",
        searchOption: "searchAll",
    });

    return (
        <ProductInfoContext.Provider value={{ searchKeyword, setSearchKeyword }}>
            {children}
        </ProductInfoContext.Provider>
    );
};
