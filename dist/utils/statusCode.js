"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["NotFound_404"] = 404] = "NotFound_404";
    StatusCode[StatusCode["UnprocessableEntity_422"] = 422] = "UnprocessableEntity_422";
    StatusCode[StatusCode["Conflict_409"] = 409] = "Conflict_409";
    StatusCode[StatusCode["Forbidden_403"] = 403] = "Forbidden_403";
    StatusCode[StatusCode["Anauthorized_401"] = 401] = "Anauthorized_401";
    StatusCode[StatusCode["Created_201"] = 201] = "Created_201";
    StatusCode[StatusCode["OK_200"] = 200] = "OK_200";
    StatusCode[StatusCode["BadRequest_400"] = 400] = "BadRequest_400";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
