export type messageInterface = {
    sentBy: string|null,
    sentTo: string,
    chatID: string,
    msgType: string,
    text: string,
    createdAt?: string,
    date: string
}
