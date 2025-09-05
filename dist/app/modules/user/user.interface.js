"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["APPROVED"] = "APPROVED";
    Status["BLOCKED"] = "BLOCKED";
    Status["PENDING"] = "PENDING";
    Status["SUSPENDED"] = "SUSPENDED";
})(Status || (exports.Status = Status = {}));
