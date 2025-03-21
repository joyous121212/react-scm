import { atom, useSetRecoilState } from 'recoil';
import { ILoginInfo } from '../models/interface/store/userInfo';
import { useEffect } from 'react';

export const loginInfoState = atom<ILoginInfo>({
    key: 'loginInfoState',
    default: {},
});
