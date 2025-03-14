import React, { FC, createContext, useState, useEffect } from "react";

// searchKeyword 객체의 타입 정의
interface SearchKeyword {
    searchTitle: string;
    searchStDate: string;
    searchEdDate: string;
    currentPage: number;
    pageSize: number;
    userType: null | string; // 여기서는 null을 허용
}

// ISearchKeyword에서 searchKeyword와 setSearchKeyword의 타입을 정확히 정의
interface IProductSearchKeyword {
    searchKeyword: SearchKeyword;
    setSearchKeyword: React.Dispatch<React.SetStateAction<SearchKeyword>>;
}
const userInfo = sessionStorage.getItem("userInfo");

const { userType } = JSON.parse(userInfo);
// const parsedUserInfo = userInfo ? JSON.parse(userInfo) : {};
// const { userType } = parsedUserInfo; // userType이 없으면 undefined가 될 것임

// context 생성
export const InquiryContext = createContext<IProductSearchKeyword>({
    searchKeyword: {
        searchTitle: "",
        searchStDate: "",
        searchEdDate: "",
        currentPage: 1,
        pageSize: 10,
        userType: userType,
    },
    setSearchKeyword: () => {}, // 빈 함수로 초기화
});

// provider를 사용해서 context에 값을 넣어주고, 원하는 곳에 제공할 수 있게 함
export const InquiryProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    // 상태 훅을 SearchKeyword 타입으로 초기화

    const [searchKeyword, setSearchKeyword] = useState<SearchKeyword>({
        searchTitle: "",
        searchStDate: "",
        searchEdDate: "",
        currentPage: 1,
        pageSize: 5,
        userType: userType,
    });

    return <InquiryContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</InquiryContext.Provider>;
};
