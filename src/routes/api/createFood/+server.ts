import { error, json, type RequestHandler } from "@sveltejs/kit";
import { type Food, type FoodInDto, FoodInDtoSchema } from "$lib/models/Food";
import { db } from "$lib/server/db";
import { foods } from "$lib/server/db/schema";
import { minioClient } from "$lib/server/minio";
import { MINIO_BUCKET_NAME } from "$env/static/private";
import { auth } from "$lib/server/auth";
import sharp from "sharp";

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user) {
		return error(401, "Unauthenticated");
	}

	const formData = await request.formData();
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

	const optimizedImage = await sharp(Buffer.from(await foodIn.image.arrayBuffer()))
		.rotate()	
		.webp({ quality: 80})
		.toBuffer();

	const food: Food = {
		title: foodIn.title,
		message: foodIn.message,
		createdAt: new Date(),
		creatorId: session.user.id!
	};

	const [insertedFood] = await db.insert(foods).values(food).returning({ id: foods.id }).execute();

	await minioClient.putObject(MINIO_BUCKET_NAME, `${insertedFood.id}.webp`, optimizedImage, foodIn.image.size, {
		"Content-Type": "image/webp"
	});

	return json({
		id: insertedFood.id
	});
};
