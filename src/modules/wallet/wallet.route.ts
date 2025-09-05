import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { WalletController } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  addMoneySchema,
  isBlockedSchema,
  sendMoneySchema,
  withdrawSchema,
} from "./wallet.validation";

const router = Router();

router.get("/", checkAuth(Role.ADMIN), WalletController.getAllWallets);

router.post(
  "/withdraw",
  checkAuth(Role.USER, Role.AGENT),
  validateRequest(withdrawSchema),
  WalletController.withdrawMoney
);

router.post(
  "/send-money",
  checkAuth(Role.USER),
  validateRequest(sendMoneySchema),
  WalletController.sendMoney
);

router.post(
  "/add-money",
  checkAuth(Role.AGENT),
  validateRequest(addMoneySchema),
  WalletController.addMoney
);

router.patch(
  "/:id/block",
  checkAuth(Role.ADMIN),
  validateRequest(isBlockedSchema),
  WalletController.blockWallet
);

export const WalletRoute = router;
