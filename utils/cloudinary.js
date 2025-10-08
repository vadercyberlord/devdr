import dotenv from "dotenv"
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided");
            return null;
        }

        // Checks if file exists before uploading
        if (!fs.existsSync(localFilePath)) {
            console.log("File does not exist at path:", localFilePath);
            return null;
        }

        console.log("Uploading file to Cloudinary:", localFilePath);
        
        // Upload the file on cloudinary with resource_type auto
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        // File has been uploaded successfully
        console.log("File uploaded on cloudinary:", response.secure_url);
        
        // Remove local file after successful upload
        fs.unlinkSync(localFilePath);
        
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        console.error("Error details:", error.message);
        
        // Remove the locally saved temporary file if it exists
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
                console.log("Local file cleaned up");
            } catch (unlinkError) {
                console.error("Error deleting local file:", unlinkError.message);
            }
        }
        
        return null;
    }
}

export {uploadOnCloudinary}
