// const dotenv = require('dotenv');
// dotenv.config();

const {Telegraf, Input} = require('telegraf');
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(async (ctx) => {
    ctx.webhookReply = false;
    await ctx.reply('Привіт!\n' +
        'В цей бот ти можеш скидати музику для випускного.\n' +
        'Це може бути будь-що: файл, посилання чи просто назва пісні. ' +
        'Зроби цей випускний запальним🔥'
    );
});

bot.on('message', async (ctx) => {
    const ctxMessage = ctx.message;
    const isPrivateChat = ctxMessage.chat.type === 'private';
    if (isPrivateChat) {
        await ctx.reply(`Дякую! Ми обов'язково розглянемо твою пропозицію💙💛`);
        await forwardMessageToGroup(ctx);
    }
});

const forwardMessageToGroup = async (ctx) => {
    const ctxMessage = ctx.message;

    const senderMention = `<a href="tg://user?id=${ctx.from.username}">${ctx.from.first_name}</a>`;

    const messageText = ctxMessage.text;
    if (messageText) {
        const message = senderMention + '\n' + messageText;
        await bot.telegram.sendMessage(chatId, message, {parse_mode: 'HTML'});
    }

    const messageAudio = ctxMessage.audio;
    if (messageAudio) {
        const fileId = messageAudio.file_id;
        const messageCaption = ctxMessage.caption;
        const message = messageCaption ? senderMention + '\n' + messageCaption : senderMention;
        await bot.telegram.sendAudio(chatId, Input.fromFileId(fileId), {caption: message, parse_mode: 'HTML'});
    }
}

const handle = async (event) => {
    try {
        const body = event.body[0] === "{"
            ? JSON.parse(event.body)
            : JSON.parse(Buffer.from(event.body, "base64"));
        await bot.handleUpdate(body);
        return {statusCode: 200, body: ""};
    } catch (error) {
        console.log(error);
    }
};

const setWebhook = async (event) => {
    try {
        const url = `https://${event.headers.Host}/${event.requestContext.stage}/webhook`;
        await bot.telegram.setWebhook(url);
        return {
            statusCode: 200,
            headers: {"Access-Control-Allow-Origin": "*"},
            body: JSON.stringify({url}),
        };
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    bot,
    handle,
    setWebhook
}
