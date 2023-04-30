import { Telegraf } from 'telegraf';

const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN).telegram;
