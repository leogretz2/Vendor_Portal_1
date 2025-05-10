// components/messages/querying-database-message.tsx (NEW FILE)
'use client';

import cx from 'classnames';
import { motion } from 'framer-motion';
import { SparklesIcon } from './icons'; // Assuming you have a DatabaseIcon or similar

export const QueryingDatabaseMessage = ({ toolName }: { toolName?: string }) => {
  const role = 'assistant'; // Or 'system' if you prefer for tool actions

  return (
    <motion.div
      data-testid="message-assistant-querying"
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }} // No delay, should appear instantly
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 w-full max-w-2xl py-2 rounded-xl items-center', 
          // Removed user-specific styling as this is an assistant action
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
          {/* You can use a specific icon for database/tool activity */}
          {/* <DatabaseIcon size={14} className="text-muted-foreground" />  */}
          {/* Or keep SparklesIcon if you prefer */}
          <SparklesIcon size={14} />
        </div>

        <div className="flex flex-col gap-1 w-full"> {/* Reduced gap */}
          <div className="text-sm text-muted-foreground">
            {toolName ? `Accessing tool: ${toolName}...` : 'Querying database...'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};