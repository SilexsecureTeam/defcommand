import { sendMessageUtil } from "../../../defcomm-chat-app/src/utils/chat/sendMessageUtil";

export const checkIfAtBottom = (containerRef: any, threshold = 40) => {
  const container = containerRef?.current;
  if (!container) return true;
  const distanceFromBottom =
    container.scrollHeight - (container.scrollTop + container.clientHeight);
  return distanceFromBottom <= threshold;
};

export const handleSendMessage = (data: any, authDetails: any) => {
  if (data?.message?.trim().length === 0) return;

  sendMessageUtil({
    message: data?.message,
    chat_user_type: data.chat_user_type,
    chat_user_id: data.chat_user_id,
    authDetails,
  } as any);
};
