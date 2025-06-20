import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const formatDate = (dateString) => {
    return dayjs(dateString).fromNow();
};