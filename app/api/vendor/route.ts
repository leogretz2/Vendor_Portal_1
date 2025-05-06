import { NextRequest } from 'next/server';
import { inArray } from 'drizzle-orm';
import { vendor } from '@/lib/db/schema';
import { getVendors } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.getAll('id');
  const idList = idsParam.flatMap((v) => v.split(','));

  if (idList.length === 0) {
    return new Response('No id parameter provided', { status: 400 });
  }

  try {
    const data = await getVendors(inArray(vendor.id, idList));
    return Response.json(data);
  } catch (err) {
    console.error('Error fetching vendor by id:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
} 