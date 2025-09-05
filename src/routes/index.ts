import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { WalletRoute } from "../modules/wallet/wallet.route";
import { TransactionRoute } from "../modules/transaction/transaction.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/wallet",
    route: WalletRoute,
  },
  {
    path: "/transaction",
    route: TransactionRoute,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
