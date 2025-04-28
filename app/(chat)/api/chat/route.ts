import {
  UIMessage,
  appendResponseMessages,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';
import { auth } from '@/app/(auth)/auth';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  getTrailingMessageId,
} from '@/lib/utils';
import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
// import { getVendorsTool } from '@/lib/ai/tools/get-vendors';
import { isProductionEnvironment } from '@/lib/constants';
import { openAIProvider } from '@/lib/ai/providers';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const {
      id,
      messages,
      selectedChatModel,
    }: {
      id: string;
      messages: Array<UIMessage>;
      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);

    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });

    const modelName = selectedChatModel ?? DEFAULT_CHAT_MODEL; // DEBUG - why isn't this passed to the api/chat POST?

    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    return createDataStreamResponse({
      execute: (dataStream) => {
        const result = streamText({
          model: openAIProvider.languageModel(modelName),
          system: systemPrompt({ selectedChatModel }),
          messages,
          maxSteps: 5,
          experimental_activeTools:
            selectedChatModel === 'chat-model-reasoning'
              ? []
              : [
                  'getWeather',
                  'createDocument',
                  'updateDocument',
                  // 'requestSuggestions',
                  // 'getVendors',
                ],
          experimental_transform: smoothStream({ chunking: 'word' }),
          experimental_generateMessageId: generateUUID,
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            // DEBUG - wtf is this?
            // requestSuggestions: requestSuggestions({
            //   session,
            //   dataStream,
            // }),
            // getVendors: getVendorsTool,
          },
          onFinish: async ({ response }) => {
            if (session.user?.id) {
              try {
                const assistantId = getTrailingMessageId({
                  messages: response.messages.filter(
                    (message) => message.role === 'assistant',
                  ),
                });

                if (!assistantId) {
                  throw new Error('No assistant message found!');
                }

                // DEBUG
                const processor = response.messages.filter(msg=> msg.role != 'assistant')//.map(m=>m.content.slice(0,10)); 
                const roles = response.messages.map(m=>m.role);
                // console.log('appendresponsemessages (start):', processor);
                // console.log('appendresponsemessages (first):', response.messages[1].content);
                // console.log('appendresponsemessages (role):', roles);
                // messages[0].content


                // DEBUG
                // Process and examine the output message(s) from the tool calls.
                // If it is the vendors document output (e.g., it has metadata.hidden === true),
                // then append it to the chat history as a hidden message.
                // const processedMessages = response.messages.map((msg) => {
                //   if (msg.type == "vendors-delta") {// metadata && msg.metadata.vendorsData) {
                //     return {
                //       ...msg,
                //       role: 'system', // or add a flag `hidden: true`
                //     };
                //   }
                //   return msg;
                // });

                const [, assistantMessage] = appendResponseMessages({
                  messages: [userMessage],
                  responseMessages: response.messages,
                });

                await saveMessages({
                  messages: [
                    {
                      id: assistantId,
                      chatId: id,
                      role: assistantMessage.role,
                      parts: assistantMessage.parts,
                      attachments:
                        assistantMessage.experimental_attachments ?? [],
                      createdAt: new Date(),
                    },
                  ],
                });
              } catch (_) {
                console.error('Failed to save chat');
              }
            }
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: 'stream-text',
          },
        });

        result.consumeStream();

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        });
      },
      onError: (error) => {
        console.error('streamText failed:', error);
        // Let the request fail with 500 so useChat sees a real error
        throw error;  
        
        // DEBUG
        // console.log('onError called in api/chat POST')
        // return 'Oops, an error occurred!';
      },
    });
  } catch (error) {
    // DEBUG - adding to investigate error
    //   return new Response('An error occurred while processing your request!', {
    //     status: 404,
    //   });
    // }
    console.error('chat route failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    // DEBUG - investigating error
    //   return new Response('An error occurred while processing your request!', {
    //     status: 500,
    //   });
    // }
    console.error('chat route failed delete:', error);
    return new Response('Internal Server Error delete', { status: 500 });
  }
}
