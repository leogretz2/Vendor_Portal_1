// artifacts/vendors/server.ts
import { openAIProvider } from '@/lib/ai/providers';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { getVendors } from '@/lib/db/queries';
import { vendor } from '@/lib/db/schema';
import { streamObject } from 'ai';
import { config } from 'dotenv';
import { sql } from 'drizzle-orm';
import { PgDialect } from 'drizzle-orm/pg-core';
import { z } from 'zod';

const pgDialect = new PgDialect();

export const vendorsDocumentHandler = createDocumentHandler<'vendors'>({
  kind: 'vendors',
  onCreateDocument: async ({ title, dataStream }) => {
    // Process the title as a search query
    const phrase = title
      .replace(/\b(vendor|vendors|company|companies|in|the)\b/gi, ' ')
      .trim();

    // Create a search condition if we have a phrase
    const whereClause = phrase
      ? sql`
        to_tsvector('english',
          coalesce(${vendor.vendorName}, '')      || ' ' ||
          coalesce(${vendor.factoryName}, '')     || ' ' ||
          coalesce(${vendor.productRange}, '')    || ' ' ||
          coalesce(${vendor.category}, '')        || ' ' ||
          coalesce(${vendor.vendorType}, '')      || ' ' ||
          coalesce(${vendor.country}, '')         || ' ' ||
          coalesce(${vendor.city}, '')
        )
        @@ plainto_tsquery('english', ${phrase})
      `
      : undefined;

    try {
      // Fetch vendors from the database
      const vendors = await getVendors(whereClause);
      
      // DEBUG
      // "Stream" the vendors to the client
      // dataStream.writeData({
      //   type: 'vendors-delta',
      //   content: JSON.stringify(vendors),
      // });

      return JSON.stringify(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return JSON.stringify([]);
    }
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    // Use AI to interpret the description and generate a new search
    const { fullStream } = streamObject({
      model: openAIProvider.languageModel('artifact-model'),
      system: `You are a search query interpreter. Given the current vendors and a description of how to refine the search, 
              extract key search terms that would be useful for finding vendors. Return only the search terms, no explanation.`,
      prompt: `Current vendors: ${document.content}\nRefinement: ${description}`,
      schema: z.object({
        searchTerms: z.string().describe('Search terms for finding vendors'),
      }),
    });

    let searchTerms = '';

    for await (const delta of fullStream) {
      if (delta.type === 'object' && delta.object.searchTerms) {
        searchTerms = delta.object.searchTerms;
      }
    }

    // Process the search terms (use original description as fallback if AI returns empty)
    const phrase = (searchTerms || description)
      .replace(/\b(vendor|vendors|company|companies|in|the)\b/gi, ' ')
      .trim();

    // Create a search condition if we have a phrase
    const whereClause = phrase
      ? sql`
        to_tsvector('english',
          coalesce(${vendor.vendorName}, '')      || ' ' ||
          coalesce(${vendor.factoryName}, '')     || ' ' ||
          coalesce(${vendor.productRange}, '')    || ' ' ||
          coalesce(${vendor.vendorType}, '')      || ' ' ||
          coalesce(${vendor.country}, '')         || ' ' ||
          coalesce(${vendor.city}, '')
        )
        @@ plainto_tsquery('english', ${phrase})
      `
      : undefined;

    try {
      // Fetch vendors from the database
      const vendors = await getVendors(whereClause);
      
      // DEBUG
      // Stream the vendors to the client
      // dataStream.writeData({
      //   type: 'vendors-delta',
      //   content: JSON.stringify(vendors),
      // });

      return JSON.stringify(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return JSON.stringify([]);
    }
  },
});