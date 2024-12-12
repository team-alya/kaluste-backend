import { ConversationHistory } from "./types";
import { CONVERSATION_TIMEOUT_MS } from "./constants";

/**
 * Remove conversations from in-memory that are no longer needed.
 */
export const cleanupConversationHistory = (
  conversationHistory: ConversationHistory
) => {
  try {
    if (!conversationHistory) {
      console.log("No conversation history to clean up");
      return;
    }

    const now = Date.now();
    const conversations = Object.entries(conversationHistory);

    if (conversations.length === 0) {
      console.log("Conversation history is empty");
      return;
    }

    console.log("--- Context Cleanup Started ---");
    console.log(`Current conversations: ${conversations.length}`);
    console.log(
      "Initial timestamps:",
      Object.entries(conversationHistory).map(([id, entry]) => ({
        id: id.slice(0, 8),
        age: Math.round((now - entry.timestamp) / 1000 / 60) + " minutes",
      }))
    );

    let deletedCount = 0;

    Object.entries(conversationHistory).forEach(([id, entry]) => {
      if (now - entry.timestamp > CONVERSATION_TIMEOUT_MS) {
        delete conversationHistory[id];
        deletedCount++;
      }
    });

    console.log("--- Context Cleanup Completed ---");
    console.log(`Deleted ${deletedCount} conversations`);
    console.log(
      `Remaining conversations: ${Object.keys(conversationHistory).length}`
    );
  } catch (error) {
    console.error("Error during conversation cleanup", error);
  }
};
