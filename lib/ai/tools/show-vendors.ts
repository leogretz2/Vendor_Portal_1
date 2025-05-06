import { tool } from 'ai';
import { z } from 'zod';
import { getVendors } from '@/lib/db/queries';
import { inArray } from 'drizzle-orm';
import { vendor } from '@/lib/db/schema';

/**
 * Tool: showVendors
 *
 * Returns vendor data for a given list of vendor IDs so the frontend can
 * render it inline inside the chat stream (via the <Vendor /> message
 * component). No artifact / DataStream events are emitted.
 */

export const showVendors = tool({
  description:
    'Display specific vendors in the UI via a nice <Vendor /> component. Accepts an array of vendor UUIDs and streams the matching vendors back to the user interface. Use this tool to display vendors in the UI. If you are also writing a markdown table of more vendors do that first so that the user sees the nice vendor component at the bottom of the chat.',
  parameters: z.object({
    ids: z
      .array(z.string())
      .min(1)
      .max(50)
      .describe('Array of vendor UUIDs to display'),
  }),
  execute: async ({ ids }) => {
    try {
      const whereClause = inArray(vendor.id, ids);
      const vendors = await getVendors(whereClause);

      // Also return the vendors object for the assistant message.
      return vendors;
    } catch (err) {
      console.error('❌ showVendors error:', err);
      return { error: 'Unable to fetch vendor information.' };
    }
  },
}); 