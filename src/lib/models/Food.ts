import { z } from "zod";

export const FoodSchema = z.object({
	id: z.number().int().positive().optional(),
	title: z.string(),
	message: z.string(),
	createdAt: z.date(),
	creatorId: z.string()
});
export type Food = z.infer<typeof FoodSchema>;

export const FoodInDtoSchema = z.object({
	title: z.string(),
	message: z.string(),
	image: z.instanceof(File)
});
export type FoodInDto = z.infer<typeof FoodInDtoSchema>;

export const FoodOutDtoSchema = z.object({
	title: z.string(),
	message: z.string(),
	creatorId: z.string(),
	createdAt: z.date(),
	creatorName: z.string(),
	creatorHandle: z.string()
});
export type FoodOutDto = z.infer<typeof FoodOutDtoSchema>;