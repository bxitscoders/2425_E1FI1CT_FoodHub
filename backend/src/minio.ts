import { env } from "bun";
import * as Minio from "minio";

const { MINIO_ENDPOINT, MINIO_PORT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_BUCKET_NAME } = env;

if (!MINIO_ENDPOINT) throw new Error("MINIO_ENDPOINT is not set");
if (!MINIO_PORT) throw new Error("MINIO_PORT is not set");
if (!MINIO_ROOT_USER) throw new Error("MINIO_ROOT_USER is not set");
if (!MINIO_ROOT_PASSWORD) throw new Error("MINIO_ROOT_PASSWORD is not set");
if (!MINIO_BUCKET_NAME) throw new Error("MINIO_BUCKET_NAME is not set");

export const minioClient = new Minio.Client({
	endPoint: MINIO_ENDPOINT,
	port: Number(MINIO_PORT),
	useSSL: false,
	accessKey: MINIO_ROOT_USER,
	secretKey: MINIO_ROOT_PASSWORD
});

const bucketExists = await minioClient.bucketExists(MINIO_BUCKET_NAME);
if (!bucketExists) {
	await minioClient.makeBucket(MINIO_BUCKET_NAME);
}
