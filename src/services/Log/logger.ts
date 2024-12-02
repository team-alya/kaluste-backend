import Log from "../../models/log";
import { loggerResponse } from "../../utils/types";

const chatLogger = async (request_id: string, conversation: object) => {
    try {
        let log = await Log.findOne({ request_id });
        if (log) {
            log.conversation.push(conversation);
        } else {
            log = new Log({ request_id, conversation });
        }
        await log.save();
        return;
    } catch (error) {
        console.error(error);
        return error;
    }
}

const reviewLogger = async (
    request_id: string, review: object
): Promise<loggerResponse | {error: string, status: number}>=> {
    try {
        const log = await Log.findOneAndUpdate(
            { request_id },
            { review },
            { new: true }
          );
        if (!log) {
            console.error("No conversation found for this requestId");
            return { error: "No conversation found for this requestId", status: 400 };
        }
        return {message: "Review logged successfully"};
    } catch (error) {
        console.error(error);
        return { error: "Error saving review to database", status: 500 };
    }
}

export {chatLogger, reviewLogger};