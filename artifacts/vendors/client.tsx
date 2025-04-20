// artifacts/vendors/client.tsx
import { Artifact } from '@/components/create-artifact';
import {
  CopyIcon,
  RedoIcon,
  SparklesIcon,
  UndoIcon,
} from '@/components/icons';
import { Vendor as VendorType } from '@/lib/db/schema';
import { toast } from 'sonner';
import { Vendor } from '@/components/vendor';

type VendorsMetadata = {
  filteredCount?: number;
  totalCount?: number;
};

export const vendorsArtifact = new Artifact<'vendors', VendorsMetadata>({
  kind: 'vendors',
  description: 'Useful for displaying and searching vendor information',
  initialize: async () => {},
  onStreamPart: ({ setArtifact, streamPart }) => {
    if (streamPart.type === 'vendors-delta') {
      try {
        const vendors = JSON.parse(streamPart.content as string);
        setArtifact((draftArtifact) => ({
          ...draftArtifact,
          content: streamPart.content as string,
          isVisible: true,
          status: 'streaming',
        }));
      } catch (error) {
        console.error('Error parsing vendors data:', error);
      }
    }
  },
  content: ({
    content,
    currentVersionIndex,
    isCurrentVersion,
    onSaveContent,
    status,
  }) => {
    let vendors: VendorType[] = [];
    
    try {
      if (content) {
        vendors = JSON.parse(content);
      }
    } catch (error) {
      console.error('Error parsing vendors content:', error);
    }

    return (
      <div className="flex flex-col py-8 md:p-20 px-4">
        <Vendor companies={vendors} />
      </div>
    );
  },
  actions: [
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon />,
      description: 'Copy as JSON',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied vendor data to clipboard!');
      },
    },
  ],
  toolbar: [
    {
      description: 'Refine search',
      icon: <SparklesIcon />,
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content: 'Can you refine this vendor search to be more specific?',
        });
      },
    },
  ],
});