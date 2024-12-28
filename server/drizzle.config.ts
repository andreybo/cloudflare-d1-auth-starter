import { defineConfig } from 'drizzle-kit';
import fs from 'fs';
import path from 'path';

// Function to retrieve the local D1 database file path
function getLocalD1DB(): string {
	try {
		// Define the path to the Miniflare database folder
		const basePath = path.resolve('.wrangler/state/v3/d1/miniflare-D1DatabaseObject');

		// Check if the folder exists
		if (!fs.existsSync(basePath)) {
			throw new Error(`Database folder not found: ${basePath}`);
		}

		// Look for a SQLite file in the folder
		const files = fs.readdirSync(basePath);
		const dbFile = files.find((file) => file.endsWith('.sqlite'));

		// Verify if a database file was found
		if (!dbFile) {
			throw new Error(`No SQLite database file found in ${basePath}`);
		}

		// Construct the full path to the database file
		const dbPath = path.join(basePath, dbFile);

		// Return the file path in `file:///` format with forward slashes
		const formattedPath = `file:///${dbPath.replace(/\\/g, '/')}`;
		return formattedPath;
	} catch (err) {
		// Handle errors and log an appropriate message
		const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
		console.error(`Error finding database: ${errorMessage}`);
		process.exit(1); // Exit the process with an error code
	}
}

// Export the Drizzle configuration for the project
export default defineConfig({
	dialect: 'sqlite', // Specify the database dialect as SQLite
	schema: './src/db/schema.ts', // Path to the database schema
	out: './drizzle', // Output directory for generated files
	dbCredentials: {
		url: getLocalD1DB(), // Use the function to get the local database URL
	},
});
