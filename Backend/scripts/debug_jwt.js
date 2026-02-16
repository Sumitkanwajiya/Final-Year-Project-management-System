import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initializing dotenv
config({ path: path.join(__dirname, '../.env') });


console.log("JWT_SECRET Length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : "undefined");
console.log("JWT_SECRET Value: '" + process.env.JWT_SECRET + "'");
console.log("COOKIE_EXPIRE:", process.env.COOKIE_EXPIRE);

const cookieExpire = process.env.COOKIE_EXPIRE;
const date = new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000);
console.log("Calculated Date:", date);
console.log("Is Date Valid:", !isNaN(date.getTime()));

try {
    const token = jwt.sign(
        { id: "test_id" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
    console.log("Token generated successfully:", token);
} catch (error) {
    console.error("Error generating token:", error.message);
}
