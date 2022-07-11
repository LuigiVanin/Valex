"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestGuard = void 0;
var requestGuard = function (Schema) {
    return function (req, res, next) {
        var validation = Schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            return res
                .status(422)
                .send(validation.error.details.map(function (err) { return err.message; }));
        }
        next();
    };
};
exports.requestGuard = requestGuard;
