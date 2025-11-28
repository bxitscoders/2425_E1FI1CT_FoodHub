import * as Minio from "minio";

import { env } from "$env/dynamic/private";

const {
	PRIVATE_MINIO_ENDPOINT,
	PRIVATE_MINIO_PORT,
	PRIVATE_MINIO_ROOT_USER,
	PRIVATE_MINIO_ROOT_PASSWORD,
	PRIVATE_MINIO_BUCKET_NAME,
	PRIVATE_MINIO_SSL
} = env;

if (!PRIVATE_MINIO_ENDPOINT) throw new Error("MINIO_ENDPOINT is not set");
if (!PRIVATE_MINIO_PORT) throw new Error("MINIO_PORT is not set");
if (!PRIVATE_MINIO_ROOT_USER) throw new Error("MINIO_ROOT_USER is not set");
if (!PRIVATE_MINIO_ROOT_PASSWORD) throw new Error("MINIO_ROOT_PASSWORD is not set");
if (!PRIVATE_MINIO_BUCKET_NAME) throw new Error("MINIO_BUCKET_NAME is not set");

export const minioClient = new Minio.Client({
	endPoint: PRIVATE_MINIO_ENDPOINT,
	port: Number(PRIVATE_MINIO_PORT),
	useSSL: (PRIVATE_MINIO_SSL ?? "true") === "true" ? true : false,
	accessKey: PRIVATE_MINIO_ROOT_USER,
	secretKey: PRIVATE_MINIO_ROOT_PASSWORD
});

export const MINIO_BUCKET_NAME: string = PRIVATE_MINIO_BUCKET_NAME!;

const bucketExists = await minioClient.bucketExists(PRIVATE_MINIO_BUCKET_NAME);
if (!bucketExists) {
	await minioClient.makeBucket(PRIVATE_MINIO_BUCKET_NAME);
}
