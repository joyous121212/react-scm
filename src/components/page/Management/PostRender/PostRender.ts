export const PostRender = <T>(param1: T, param2: React.Dispatch<React.SetStateAction<T>>): void => {
    console.log(param2);
    const box = { ...param1 };
    param2(box);
};
