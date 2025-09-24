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

router.get("/users", checkAuth(Role.ADMIN), UserControllers.getUsers);

router.get("/agents", checkAuth(Role.ADMIN), UserControllers.getAgents);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);

router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser);

router.patch(
  "/:id/status",
  checkAuth(Role.ADMIN),
  validateRequest(updateStatus),
  UserControllers.userSuspendOrApproved
);

router.patch(
  "/update-profile/:id",
  checkAuth(...Object.values(Role)),
  UserControllers.updateProfile
);

export const UserRoute = router;
