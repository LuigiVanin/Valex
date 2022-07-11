"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCardExpired = exports.formatName = exports.generateExpDate = exports.generateDigits = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
var generateDigits = function (length) {
    var ans = "";
    for (var i = 0; i < length; i++) {
        ans += Math.floor(Math.random() * 10);
    }
    return ans;
};
exports.generateDigits = generateDigits;
var generateExpDate = function (timeYears) {
    var date = new Date();
    date.setFullYear(date.getFullYear() + timeYears);
    return (0, dayjs_1.default)(date).format("MM/YY");
};
exports.generateExpDate = generateExpDate;
var formatName = function (name) {
    var names = name
        .toUpperCase()
        .split(" ")
        .filter(function (item) { return item.length > 3; })
        .map(function (item, index, fullName) {
        if (index > 0 && index < fullName.length - 1) {
            return item[0];
        }
        return item;
    });
    return names.join(" ");
};
exports.formatName = formatName;
var isCardExpired = function (expDate) {
    dayjs_1.default.extend(customParseFormat_1.default);
    var date = (0, dayjs_1.default)(expDate, "MM/YY");
    return date.toDate() <= new Date();
};
exports.isCardExpired = isCardExpired;
