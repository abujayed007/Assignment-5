import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateStatus } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserControllers.createUser
);

router.get("/", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN),
  validateRequest(updateStatus),
  UserControllers.userSuspendOrApproved
);

export const UserRoute = router;
