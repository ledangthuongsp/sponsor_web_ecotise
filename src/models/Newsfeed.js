export class Newsfeed {
    constructor({
        id = null,
        sponsorId = null,
        pointForActivity = 0,
        userId = null,
        pollId = null,
        content = "",
        mediaUrls = [],
        commentIds = [],
        reactIds = [],
        startedAt = null,
        endedAt = null,
    } = {}) {
        this.id = id;
        this.sponsorId = sponsorId;
        this.pointForActivity = pointForActivity;
        this.userId = userId;
        this.pollId = pollId;
        this.content = content;
        this.mediaUrls = mediaUrls; // array
        this.commentIds = commentIds; // array
        this.reactIds = reactIds;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
    }
}
