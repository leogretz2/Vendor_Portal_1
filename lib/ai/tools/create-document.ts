import { generateUUID } from '@/lib/utils';
import { DataStreamWriter, tool } from 'ai';
import { z } from 'zod';
import { Session } from 'next-auth';
import {
  artifactKinds,
  documentHandlersByArtifactKind,
} from '@/lib/artifacts/server';

interface CreateDocumentProps {
  session: Session;
  dataStream: DataStreamWriter;
}

export const createDocument = ({ session, dataStream }: CreateDocumentProps) =>
  tool({
    description:
      'Create a document for a writing or content creation activities. This tool will call other functions that will generate the contents of the document based on the title and kind.',
    parameters: z.object({
      title: z.string(),
      kind: z.enum(artifactKinds),
    }),
    execute: async ({ title, kind }) => {
      const id = generateUUID();

      dataStream.writeData({
        type: 'kind',
        content: kind,
      });

      dataStream.writeData({
        type: 'id',
        content: id,
      });

      dataStream.writeData({
        type: 'title',
        content: title,
      });

      dataStream.writeData({
        type: 'clear',
        content: '',
      });

      const documentHandler = documentHandlersByArtifactKind.find(
        (documentHandlerByArtifactKind) =>
          documentHandlerByArtifactKind.kind === kind,
      );

      if (!documentHandler) {
        throw new Error(`No document handler found for kind: ${kind}`);
      }

      // DEBUG
      // console.log('datastr', documentHandler);

      const draftContent = await documentHandler.onCreateDocument({
        id,
        title,
        dataStream,
        session,
      });

      dataStream.writeData({ type: 'finish', content: '' });

      // DEBUG
      console.log('typer', typeof draftContent);

      // draftContent is of type string because vendorsDocumentHandler is returning a JSON.stringify,
      // but it says void because abstract onCreateDocument in artifacts/server.ts returns Promise<void>
      // @ts-ignore
      const factoryMap = buildFactoryMap(JSON.parse(draftContent));

      const slimmedObj = Object.fromEntries(factoryMap);
      const slimmedJSON = JSON.stringify(slimmedObj, null, 2);
      
      const returnVal = `A document was created and is now visible to the user.
      
      Here is the JSON content of the document that you can use to answer the user's questions about the document:
      
      ${slimmedJSON}
      `
      // DEBUG
      console.log('datastr', returnVal);

      // DEBUG - potentially return JSON here rather than a string

      return {
        id,
        title,
        kind,
        content: returnVal,
      };
    },
});

function compressRange(range: string) {
  return [...new Set(
    range
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 5)            // keep first 5 distinct items
  )].join(', ');
}

function buildFactoryMap(raw: any[]): Map<string, SlimFactory> {
  const map = new Map<string, SlimFactory>();

  for (const v of raw) {
    // DEBUG
    console.log('raw', v)
    const key = v.factoryName?.trim() || `noFactory:${v.vendorName}`;

    if (!map.has(key)) {
      map.set(key, {
        factoryName: v.factoryName || v.vendorName,
        vendorName:  v.vendorName,
        productRange: compressRange(v.productRange),
        category: v.category?.startsWith('2') ? 'packaging' : 'product',
        vendorType: v.vendorType ?? undefined,
        country: v.country,
        city: v.city ?? undefined,
        audits: v.audits ?? undefined,
        certificates: v.certificates ?? undefined,
      });
    }
  }

  return map;
}

type SlimFactory = {
  vendorName: string;        // keep full name for exact matches
  factoryName?: string;      // optional – drop if you dedupe per vendor
  productRange: string;      // compress to keywords, ≤ 100 chars
  category: 'product' | 'packaging';
  vendorType?: string;       // 'Factory', 'Trading', … (short)
  country: string;
  city?: string;
  audits?: string;          
  certificates?: string;
};