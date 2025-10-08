import { minioClient, MINIO_BUCKET_NAME } from '$lib/server/minio';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    await minioClient.putObject(MINIO_BUCKET_NAME, "bier.txt", "Hello, World!");
    return new Response();
};