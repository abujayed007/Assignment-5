import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { TransactionControllers } from "./transaction.controller";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN),
  TransactionControllers.getAllTransactions
);

router.get(
  "/my-transactions",
  checkAuth(Role.USER, Role.AGENT),
  TransactionControllers.getMyTransactions
);

export const TransactionRoute = router;
