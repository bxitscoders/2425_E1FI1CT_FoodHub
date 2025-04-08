import * as Minio from "minio";

import { env } from "$env/dynamic/private";

const { MINIO_ENDPOINT, MINIO_PORT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_BUCKET_NAME } = env;

export const minioClient = new Minio.Client({
	endPoint: MINIO_ENDPOINT,
	port: Number(MINIO_PORT),
	useSSL: false,
	accessKey: MINIO_ROOT_USER,
	secretKey: MINIO_ROOT_PASSWORD
});

if (!(await minioClient.bucketExists(MINIO_BUCKET_NAME))) {
	await minioClient.makeBucket(MINIO_BUCKET_NAME);
}
