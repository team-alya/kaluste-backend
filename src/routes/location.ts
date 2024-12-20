// /* eslint-disable @typescript-eslint/no-misused-promises */
// import exress, { Response } from "express";
// import locationService from "../services/ai/locationService";
// import { locationQueryParser } from "../utils/middleware";
// import { LocationQuery } from "../types/middleware";

// const router = exress.Router();

// router.post(
//   "/",
//   locationQueryParser,
//   async (req: LocationQuery, res: Response) => {
//     try {
//       const response = await locationService.analyzeLocation(req.body);
//       return res.status(200).json({ result: response });
//     } catch (error: unknown) {
//       if (error instanceof Error)
//         return res.status(500).json({ error: error.message });
//     }
//     return;
//   },
// );

// export default router;
