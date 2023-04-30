const dotenv = require('dotenv');

const { Telegraf } = require('telegraf');
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start(ctx =>
    ctx.reply('Привіт! ' +
        'В цей бот ти можеш скидати музику для випускного.\n' +
        'Це може бути будь-що: файл, посилання чи просто назва пісні.' +
        'Зроби цей випускний запальним🔥'
    ));

const start = async (event) => {
    try {
        const body = event.body[0] === "{"
            ? JSON.parse(event.body)
            : JSON.parse(Buffer.from(event.body, "base64"));
        await bot.handleUpdate(body);
        return { statusCode: 200, body: "" };
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
            body: JSON.stringify({ url }),
        };
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    bot,
    start,
    setWebhook
}
