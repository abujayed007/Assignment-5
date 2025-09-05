"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxnStatus = exports.TxnType = void 0;
var TxnType;
(function (TxnType) {
    TxnType["ADDMONEY"] = "ADDMONEY";
    TxnType["WITHDRAW"] = "WITHDRAW";
    TxnType["SENDMONEY"] = "SENDMONEY";
    TxnType["CASHIN"] = "CASHIN";
    TxnType["CASHOUT"] = "CASHOUT";
})(TxnType || (exports.TxnType = TxnType = {}));
var TxnStatus;
(function (TxnStatus) {
    TxnStatus["PENDING"] = "PENDING";
    TxnStatus["SUCCESS"] = "SUCCESS";
    TxnStatus["FAILED"] = "FAILED";
})(TxnStatus || (exports.TxnStatus = TxnStatus = {}));
