// // lib/ai/tools/get-vendors.ts
// import { tool } from 'ai';
// import { z } from 'zod';
// import { sql } from 'drizzle-orm';
// import { PgDialect } from 'drizzle-orm/pg-core';
// import { getVendors } from '@/lib/db/queries';
// import { vendor } from '@/lib/db/schema';

// const pgDialect = new PgDialect();
// const MAX_RESULTS = 20;

// export const getVendorsTool = tool({
//   description:
//     'Retrieve vendors matching a natural language query across *all* vendors. ' +
//     'For example: "companies in the UK" or "distributors with open POs".',
//   parameters: z.object({
//     description: z.string().describe('Search phrase to filter vendors'),
//   }),
//   execute: async ({ description }) => {
//     console.log('🔍 Description:', description);

//     // strip generic words
//     const phrase = description
//       .replace(/\b(vendor|vendors|company|companies|in|the)\b/gi, ' ')
//       .trim();
//     console.log('🔍 Sanitized phrase:', phrase);

//     // if blank → full table
//     const whereClause = phrase
//       ? sql`
//         to_tsvector('english',
//           coalesce(${vendor.vendorName}, '')      || ' ' ||
//           coalesce(${vendor.factoryName}, '')     || ' ' ||
//           coalesce(${vendor.productRange}, '')    || ' ' ||
//           coalesce(${vendor.category}, '')        || ' ' ||
//           coalesce(${vendor.vendorType}, '')      || ' ' ||
//           coalesce(${vendor.country}, '')         || ' ' ||
//           coalesce(${vendor.city}, '')
//         )
//         @@ plainto_tsquery('english', ${phrase})
//       `
//       : undefined;

//     if (whereClause) {
//       const { sql: text, params } = pgDialect.sqlToQuery(whereClause);
//       console.log('🔍 WHERE SQL:', text);
//       console.log('🔍 WHERE params:', params);
//     } else {
//       console.log('🔍 No filter → fetching all vendors');
//     }

//     try {
//       const allRows = await getVendors(whereClause);
//       console.log(`🔍 Total matching rows: ${allRows.length}`);

//       // limit to MAX_RESULTS
//       const rows = allRows.slice(0, MAX_RESULTS);
//       if (allRows.length > MAX_RESULTS) {
//         console.log(
//           `🔍 Returning only top ${MAX_RESULTS} results (of ${allRows.length})`
//         );
//       }

//       return rows;
//     } catch (err) {
//       console.error('❌ getVendorsTool error:', err);
//       return { error: 'Unable to fetch vendor information.' };
//     }
//   },
// });
