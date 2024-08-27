"use client";

import uploadImage from "@/server/uploader-image";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

export default function UploadImage() {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		maxFiles: 1,
		accept: {
			"image/png": [".png"],
			"image/jpeg": [".jpg"],
			"image/jpg": [".jpg"],
			"image/webp": [".webp"],
		},
		onDrop: async (filesAcceptes, filesRejected) => {
			if (filesAcceptes.length) {
				const formData = new FormData();
				formData.append("image", filesAcceptes[0]);
				const objectUrl = URL.createObjectURL(filesAcceptes[0]);
				const res = await uploadImage({ image: formData });
				console.log(res);
			}
		},
	});
	return (
		<Card
			{...getRootProps()}
			className={cn(
				"cursor-pointer hover:bg-secondary hover:border-primary transition-all ease-in-out",
				isDragActive ? "animate-pulse border-primary bg-secondary" : ""
			)}
		>
			<CardContent className="flex flex-col h-full items-center justify-center px-2 py-24 text-xs ">
				<input {...getInputProps()} type="file" />
				<div className="flex items-center flex-col justify-center gap-2">
					<p
						className={cn(
							"text-2xl text-foreground ",
							isDragActive ? "opacity-60" : ""
						)}
					>
						{isDragActive ? "Drop your image" : "Drag your image there "}
					</p>
					<p>Supported formats: .png, .jpg, webp</p>
				</div>
			</CardContent>
		</Card>
	);
}
