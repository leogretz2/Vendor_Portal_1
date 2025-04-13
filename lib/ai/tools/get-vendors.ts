import { tool } from 'ai';
import { z } from 'zod';
import { sql } from 'drizzle-orm';
import { getVendors } from '@/lib/db/queries'; // Ensure you have this function implemented in your queries.ts

export const getVendorsTool = tool({
  description: 'Query the Vendor table for companies matching a given description. ' +
               'For example: "all companies in the UK" or "companies in New York".',
  parameters: z.object({
    // We accept a free-form description from the user that we will translate into a SQL condition.
    description: z.string().describe('A natural language description that specifies vendor criteria'),
  }),
  execute: async ({ description }) => {
    // Here we perform a simple transformation based on the input description.
    // For a more robust solution, you might implement Natural Language Processing (NLP)
    // to accurately convert the description into a SQL WHERE clause.
    let whereClause;
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('uk')) {
      // Query vendors whose companyLocation contains 'uk'
      whereClause = sql`LOWER("companyLocation") LIKE '%uk%'`;
    } else if (lowerDesc.includes('new york')) {
      // Query vendors whose companyLocation contains 'new york'
      whereClause = sql`LOWER("companyLocation") LIKE '%new york%'`;
    }
    // Add additional conditions as needed...

    try {
      // Call the database query function that returns the vendor records based on the whereClause.
      const vendors = await getVendors(whereClause);
      return vendors;
    } catch (error) {
      console.error('Error in getVendorsTool:', error);
      return { error: 'Unable to fetch vendor information.' };
    }
  },
});
