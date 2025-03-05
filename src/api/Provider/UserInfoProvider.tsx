import React, { FC, createContext, useMemo, useState } from "react";

// 초기값의 타입.
interface ISearchKeyword {
    searchKeyword?: object;
    setSearchKeyword?: React.Dispatch<React.SetStateAction<object>>;
}

// 지정된 곳 아무데서나 사용이 가능한 context를 생성함.(생성만 하였고, 사용은 아직입니다)
export const UserInfoContext = createContext<ISearchKeyword>({});

// provider를 사용해서 context에 값을 넣어주고, 원하는 곳에 제공할 수 있게함
export const UserInfoProvider: FC<{ children: React.ReactNode | React.ReactNode[] }> = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState({
        groupCodeSelect: "name",
        searchTitle: "",
        currentPage: 1,
        pageSize: 5,
        inforAll: 0,
    });

    // 어차피 searchKeyword가 바뀌도록 사용하는 것이기 때문에, 굳이 memo를 사용할 필요는 없다
    // const value = useMemo(() => ({ searchKeyword, setSearchKeyword }), [searchKeyword]);

    return <UserInfoContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</UserInfoContext.Provider>;
};
