import { Router } from "express";
import chatRouter from "./chat";
import imageRouter from "./image";
import locationRouter from "./webchat";
import priceRouter from "./price";
import reviewRouter from "./review";

const router = Router();

router.get("/ping", (_req, res) => {
  res.send("pong");
});

router.use("/image", imageRouter);
router.use("/price", priceRouter);
router.use("/chat", chatRouter);
router.use("/webchat", locationRouter);
router.use("/review", reviewRouter);

export default router;
