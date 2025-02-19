import { error, json, type RequestHandler } from "@sveltejs/kit";
import { type Food, type FoodInDto, FoodInDtoSchema } from "$lib/models/Food";
import { db } from "$lib/server/db";
import { foods } from "$lib/server/db/schema";

export const POST: RequestHandler = async (event) => {
	const session = await event.locals.auth();

	if (!session?.user?.id) {
		return error(401, "Unauthenticated");
	}

	const formData = await event.request.formData();
	const data: Record<string, FormDataEntryValue> = {};
	formData.forEach((value, key) => {
		data[key] = value;
	});

	let foodIn: FoodInDto;
	try {
		foodIn = FoodInDtoSchema.parse(data);
	} catch {
		throw error(400, "Validation error");
	}

	const food: Food = {
		title: foodIn.title,
		message: foodIn.message,
		createdAt: new Date(),
		creatorId: session.user.id!
	};

	await db.insert(foods).values(food).execute();
	return json({ });
};
