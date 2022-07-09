import dayjs from "dayjs";

export const generateDigits = (length: number) => {
    let ans = "";
    for (let i = 0; i < length; i++) {
        ans += Math.floor(Math.random() * 10);
    }
    return ans;
};

export const generateExpDate = (timeYears: number) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + timeYears);
    return dayjs(date).format("MM/YY");
};

export const formatName = (name: string) => {
    const names = name
        .toUpperCase()
        .split(" ")
        .filter((item) => item.length > 3)
        .map((item, index, fullName) => {
            if (index > 0 && index < fullName.length - 1) {
                return item[0];
            }
            return item;
        });
    return names.join(" ");
};
