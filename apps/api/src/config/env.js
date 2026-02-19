import dotenv from "dotenv";
dotenv.config();

export const env = {
	PORT: process.env.PORT || 3000,
	JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
	DATABASE_URL: process.env.DATABASE_URL,
	MAGENTO_BASE_URL: process.env.MAGENTO_BASE_URL,
	MAGENTO_TOKEN: process.env.MAGENTO_TOKEN
};
