import Log from "../../models/log";

const chatLogger = async (request_id: string, conversation: object) => {
    try {
        let log = await Log.findOne({ request_id });
        if (log) {
            log.conversation.push(conversation);
        } else {
            log = new Log({ request_id, conversation });
        }
        await log.save();
    } catch (error) {
        console.error(error);
    }
}

export default chatLogger;