import { z} from "zod";

export const summaryQuerySchema = z.object({
	from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
	to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
