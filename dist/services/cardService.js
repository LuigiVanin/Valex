"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt_1 = __importDefault(require("bcrypt"));
var cardRepository_1 = require("../repositories/cardRepository");
var exceptions_1 = __importDefault(require("../utils/exceptions"));
var statusCode_1 = require("../utils/statusCode");
var utils_1 = require("../utils/utils");
require("../config/setup");
var employeeRepository_1 = require("../repositories/employeeRepository");
var schemas_1 = require("../utils/schemas");
var paymentService_1 = __importDefault(require("./paymentService"));
var rechargeService_1 = __importDefault(require("./rechargeService"));
var CardService = /** @class */ (function () {
    function CardService() {
    }
    var _a;
    _a = CardService;
    CardService.getCardOrError404 = function (cardId) { return __awaiter(void 0, void 0, void 0, function () {
        var card;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, cardRepository_1.findById)(cardId)];
                case 1:
                    card = _b.sent();
                    if (!card) {
                        throw new exceptions_1.default(statusCode_1.StatusCode.NotFound_404, "Cartão não encontrado");
                    }
                    return [2 /*return*/, card];
            }
        });
    }); };
    CardService.checkActiveOr403 = function (dbPassword) {
        if (!dbPassword) {
            throw new exceptions_1.default(statusCode_1.StatusCode.Forbidden_403, "O cartão ainda não foi ativado");
        }
        return dbPassword;
    };
    CardService.checkExpDateOrError403 = function (expDate) {
        if ((0, utils_1.isCardExpired)(expDate)) {
            throw new exceptions_1.default(statusCode_1.StatusCode.Forbidden_403, "Cart\u00E3o j\u00E1 expirado! expDate: ".concat(expDate));
        }
    };
    CardService.validateCardId = function (cardId) {
        var validation = schemas_1.cardIdParamSchema.validate(cardId);
        if (validation.error) {
            throw new exceptions_1.default(statusCode_1.StatusCode.BadRequest_400, "id de cartão inválido");
        }
        return validation.value;
    };
    CardService.authenticateCard = function (password, hash) {
        hash = CardService.checkActiveOr403(hash);
        if (!bcrypt_1.default.compareSync(password, hash)) {
            throw new exceptions_1.default(statusCode_1.StatusCode.Forbidden_403, "A senha do cartão esta incorreta!");
        }
    };
    CardService.createCard = function (id, type) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, employee, haveSameType, card;
        return __generator(_a, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, employeeRepository_1.findById)(id),
                        (0, cardRepository_1.findByTypeAndEmployeeId)(type, id),
                    ])];
                case 1:
                    _b = _c.sent(), employee = _b[0], haveSameType = _b[1];
                    if (!employee) {
                        throw new exceptions_1.default(statusCode_1.StatusCode.NotFound_404, "Id ".concat(id, " de usu\u00E1rio n\u00E3o encontrado"), "Falha ao encontrar usuário");
                    }
                    if (!!haveSameType) {
                        throw new exceptions_1.default(statusCode_1.StatusCode.Conflict_409, "usu\u00E1rio j\u00E1 tem cart\u00E3o do tipo ".concat(type), "Falha em criar cartão, tipo já existente");
                    }
                    card = {
                        employeeId: employee.id,
                        isVirtual: false,
                        securityCode: (0, utils_1.generateDigits)(3),
                        expirationDate: (0, utils_1.generateExpDate)(5),
                        type: type,
                        cardholderName: (0, utils_1.formatName)(employee.fullName),
                        number: (0, utils_1.generateDigits)(16),
                        isBlocked: false,
                    };
                    return [4 /*yield*/, (0, cardRepository_1.insert)(card)];
                case 2:
                    _c.sent();
                    return [2 /*return*/, card];
            }
        });
    }); };
    // TODO: checar expiração
    CardService.activateCard = function (cardId, cvc, password) { return __awaiter(void 0, void 0, void 0, function () {
        var card, hashedPassword;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, CardService.getCardOrError404(cardId)];
                case 1:
                    card = _b.sent();
                    if (card.securityCode !== cvc) {
                        throw new exceptions_1.default(statusCode_1.StatusCode.Forbidden_403, "CVC incorreto");
                    }
                    if (!!card.password) {
                        throw new exceptions_1.default(statusCode_1.StatusCode.OK_200, "Cartão já foi ativado");
                    }
                    CardService.checkExpDateOrError403(card.expirationDate);
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 2:
                    hashedPassword = _b.sent();
                    return [4 /*yield*/, (0, cardRepository_1.update)(cardId, { password: hashedPassword })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    // TODO: checar expiração
    CardService.blockCard = function (cardId, password) { return __awaiter(void 0, void 0, void 0, function () {
        var card;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, CardService.getCardOrError404(cardId)];
                case 1:
                    card = _b.sent();
                    CardService.authenticateCard(password, card.password);
                    CardService.checkExpDateOrError403(card.expirationDate);
                    if (card.isBlocked) {
                        throw new exceptions_1.default(statusCode_1.StatusCode.Conflict_409, "O cartão já foi bloqueado");
                    }
                    return [4 /*yield*/, (0, cardRepository_1.update)(cardId, { isBlocked: true })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    CardService.unblockCard = function (cardId, password) { return __awaiter(void 0, void 0, void 0, function () {
        var card;
        return __generator(_a, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, CardService.getCardOrError404(cardId)];
                case 1:
                    card = _b.sent();
                    CardService.authenticateCard(password, card.password);
                    CardService.checkExpDateOrError403(card.expirationDate);
                    if (!card.isBlocked) {
                        throw new exceptions_1.default(statusCode_1.StatusCode.Conflict_409, "O cartão não está bloqueado");
                    }
                    return [4 /*yield*/, (0, cardRepository_1.update)(cardId, { isBlocked: false })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    CardService.getCardBalance = function (cardId) { return __awaiter(void 0, void 0, void 0, function () {
        var _b, _c, recharges, totalRecharges, _d, payments, totalPayments;
        return __generator(_a, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        rechargeService_1.default.getRechargesBalance(cardId),
                        paymentService_1.default.getPaymentBalance(cardId),
                    ])];
                case 1:
                    _b = _e.sent(), _c = _b[0], recharges = _c[0], totalRecharges = _c[1], _d = _b[1], payments = _d[0], totalPayments = _d[1];
                    return [2 /*return*/, {
                            balance: totalRecharges - totalPayments,
                            transactions: payments,
                            recharges: recharges,
                        }];
            }
        });
    }); };
    return CardService;
}());
exports.default = CardService;
