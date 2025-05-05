import { experimental_createMCPClient as createMCPClient } from 'ai';
import { Experimental_StdioMCPTransport as StdioMCPTransport } from 'ai/mcp-stdio';

let mcpClientPromise: ReturnType<typeof createMCPClient> | undefined;

export const getMcpClient = () => {
  if (!mcpClientPromise) {
    mcpClientPromise = createMCPClient({
      transport: new StdioMCPTransport({
        command: 'npx',
        args: [
          '-y',
          '@supabase/mcp-server-supabase@latest',
          '--access-token',
          process.env.SUPABASE_PAT!,
          // optional ↓
          ...(process.env.SUPABASE_PROJECT_REF
            ? ['--project-ref', process.env.SUPABASE_PROJECT_REF]
            : []),
            // '--read-only'                    
        ],
      }),
    });
  }
  return mcpClientPromise;
};