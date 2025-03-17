import React, { FC, createContext, useState } from "react";

// searchKeyword 객체의 타입 정의
interface SearchKeyword {
    searchOption: string;
    searchKeyword: string;
    currentPage: number;
    pageSize: number;
}

// ISearchKeyword에서 searchKeyword와 setSearchKeyword의 타입을 정확히 정의
interface ISearchKeyword {
    searchKeyword: SearchKeyword;
    setSearchKeyword: React.Dispatch<React.SetStateAction<SearchKeyword>>;
}

// 그리드 또는 새로운 페이지 처리시의 컴포넌트 검색조건
interface DetailSearchKeyword {
    supplyId: number;
    currentPage: number;
    pageSize: number;
}

interface IDetailSearchKeyword {
    detailSearchKeyword: DetailSearchKeyword;
    setDetailSearchKeyword: React.Dispatch<React.SetStateAction<DetailSearchKeyword>>;
}

// ISearchKeyword와 IDetailSearchKeyword를 합친 타입 정의
interface IContextUnion extends ISearchKeyword, IDetailSearchKeyword {}

// context 생성
export const SupplierInfoContext = createContext<IContextUnion>({
    searchKeyword: {
        searchOption: "searchSupplier",
        searchKeyword: "",
        currentPage: 1,
        pageSize: 5,
    },
    setSearchKeyword: () => {},
    detailSearchKeyword: {
        supplyId: 0,
        currentPage: 0,
        pageSize: 0,
    },
    setDetailSearchKeyword: () => {},
});

// provider를 사용해서 context에 값을 넣어주고, 원하는 곳에 제공할 수 있게 함
export const SupplierInfoProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    // 상태 훅을 SearchKeyword 타입으로 초기화
    const [searchKeyword, setSearchKeyword] = useState<SearchKeyword>({
        searchOption: "searchSupplier",
        searchKeyword: "",
        currentPage: 1,
        pageSize: 5,
    });

    // 상태 훅을 DetailSearchKeyword 타입으로 초기화
    const [detailSearchKeyword, setDetailSearchKeyword] = useState<DetailSearchKeyword>({
        supplyId: 0,
        currentPage: 0,
        pageSize: 0,
    });

    return (
        <SupplierInfoContext.Provider
            value={{
                searchKeyword,
                setSearchKeyword,
                detailSearchKeyword,
                setDetailSearchKeyword,
            }}
        >
            {children}
        </SupplierInfoContext.Provider>
    );
};
