import ImageKit from "imagekit";
import dotenv from "dotenv";
import prisma from "@/lib/prisma";

dotenv.config();

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export class UploadService {
  /* Upload image to ImageKit*/

  async uploadDocument(
    fileBuffer: Buffer,
    originalName: string,
    folder: string,
    tags: string[] = [],
  ): Promise<{
    fileId: string;
    url: string;
    thumbnailUrl: string;
    name: string;
    size: number;
  }> {
    try {
      this.validateFile(fileBuffer, originalName);

      const fileName = this.generateFileName(originalName);

      const result = await imagekit.upload({
        file: fileBuffer,
        fileName,
        folder,
        useUniqueFileName: true,
        tags: ["apx", ...tags],
        responseFields: ["url", "thumbnailUrl", "fileId", "size"],
      });

      return {
        fileId: result.fileId,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl || result.url,
        name: result.name,
        size: result.size,
      };
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  /* Validate file properties (Size, Type, Content) */

  private validateFile(fileBuffer: Buffer, originalName: string): void {
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (fileBuffer.length > maxSize) {
      throw new Error(
        `File size exceeds the limit (${maxSize / (1024 * 1024)}MB).`,
      );
    }

    const extension = originalName.split(".").pop()?.toLowerCase() || "";
    const header = fileBuffer.toString("hex", 0, 4).toLowerCase();
    let isValidContent = false;

    if (
      (extension === "jpg" || extension === "jpeg") &&
      header.startsWith("ffd8")
    ) {
      isValidContent = true;
    } else if (extension === "png" && header === "89504e47") {
      isValidContent = true;
    } else if (
      extension === "webp" &&
      fileBuffer.toString("hex", 8, 12) === "57454250"
    ) {
      isValidContent = true;
    } else if (extension === "pdf" && header === "25504446") {
      isValidContent = true;
    } else if (extension === "doc" && header === "d0cf11e0") {
      isValidContent = true;
    } else if (extension === "docx" && header === "504b0304") {
      isValidContent = true;
    } else {
      throw new Error(
        "Invalid file type or extension. Allowed types: JPG, JPEG, PNG, WEBP, PDF, DOC, DOCX.",
      );
    }

    if (!isValidContent) {
      throw new Error(
        "File content does not match its expected format (possible spoofing).",
      );
    }
  }

  /* Generate optimized URL for different sizes*/

  generateOptimizedUrl(
    imageUrl: string,
    width?: number,
    height?: number,
  ): string {
    const transformation: any = {
      quality: 80,
      format: "webp",
    };

    if (width) transformation.width = width;
    if (height) transformation.height = height;

    const imagePath = imageUrl.split("/").pop();

    return imagekit.url({
      path: imagePath || "",
      transformation: [transformation],
    });
  }

  /* Delete image from ImageKit */

  async deleteImage(fileId: string): Promise<void> {
    try {
      await imagekit.deleteFile(fileId);
    } catch (error:any) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  /* Generate unique filename*/

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split(".").pop();
    const name = originalName.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_");

    return `${name}_${timestamp}_${random}.${extension}`.toLowerCase();
  }
}

export default new UploadService();
