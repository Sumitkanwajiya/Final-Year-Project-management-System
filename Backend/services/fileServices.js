import fs from "fs";
import path from "path";
import { ErrorHandler } from "../middleware/error.js";

export const streamDownload = async (filePath, originalName, res) => {
    try {
        if (!filePath) {
            throw new ErrorHandler("File path is missing", 400);
        }

        // Ensure absolute path
        const absolutePath = path.resolve(filePath);
        console.log("StreamDownload: Resolved path", absolutePath);

        if (!fs.existsSync(absolutePath)) {
            throw new ErrorHandler("File not found on server", 404);
        }

        res.download(absolutePath, originalName, (err) => {
            if (err) {
                // Can't send JSON if headers already sent, but try/catch block will handle it mostly.
                // If headers sent, express might have closed connection.
                if (!res.headersSent) {
                    res.status(500).json({
                        success: false,
                        message: "Failed to download file"
                    });
                }
            }
        });
    } catch (error) {
        if (error instanceof ErrorHandler) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Internal Server Error during download"
        });
    }
}


