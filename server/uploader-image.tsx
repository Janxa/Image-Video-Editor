"use server";

import { actionClient } from "@/lib/safe-action";
import { UploadApiResponse, UploadStream, v2 as cloudinary } from "cloudinary";
import { z } from "zod";

cloudinary.config({
	cloud_name: process.env.CLOUDINARy_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const formData = z.object({
	image: z.instanceof(FormData),
});

const uploadImage = actionClient
	.schema(formData)
	.action(async ({ parsedInput: { image } }) => {
		const formImage = image.get("image");
		if (!formImage) return { error: "no image" };
		if (!image) return { error: "no image" };
		const file = formImage as File;
		type UploadResult =
			| { success: UploadApiResponse; error?: never }
			| { error: string; success?: never };

		try {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			return new Promise<UploadResult>((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream(
					{
						upload_preset: process.env.CLOUDINARY_NAME,
					},
					(error, result) => {
						if (error || !result) {
							reject({ error: "upload error" });
						} else {
							resolve({ success: result });
						}
					}
				);
				uploadStream.end(buffer);
			});
		} catch (error) {
			return { error: error };
		}
	});

export default uploadImage;
