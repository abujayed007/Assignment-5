import { Router } from "express";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createWalletValidation, depositSchema } from "./wallet.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletController } from "./wallet.controller";

const router = Router();

router.post(
  "/topup",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(depositSchema),
  WalletController.addMoney
);

router.post(
  "/withdraw",
  checkAuth(Role.USER, Role.AGENT),
  WalletController.withdrawMoney
);

router.post(
  "/sendmoney",
  checkAuth(Role.USER, Role.AGENT),
  WalletController.sendMoney
);

export const WalletRoute = router;
