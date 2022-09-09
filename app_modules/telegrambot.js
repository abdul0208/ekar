global.TelegramBot = require('node-telegram-bot-api');
global.TELEGRAMBOTKEY = "1464447811:AAEh4WxVGgy4wGZNSF83yAq6MCNncl9C9aY"; // nodeMessenger_dev_bot

if (checkLocalServer()) {
    TELEGRAMBOTKEY = "1464447811:AAEh4WxVGgy4wGZNSF83yAq6MCNncl9C9aY"
} else {
    TELEGRAMBOTKEY = "1797345548:AAFpjHKHX8MBHX93joC1pL-4Wvt-EIvnEeo"
}

global.SendTelegram = function (msg, id) {
    // _log("TELEGRAM Msg", msg)
    if (msg == '') return
    if (typeof global.bot == 'undefined') return
    if (typeof msg == 'undefined') return

    // _log(Object.keys(global.TelegramUsers).length)
    if (typeof global.bot !== 'undefined' && Object.keys(global.TelegramUsers).length > 0) {
        if (typeof id != 'undefined') {
            global.bot.sendMessage(id, msg, { parse_mode: 'HTML' });
        } else {
            for (u in global.TelegramUsers) {
                global.bot.sendMessage(u, msg, { parse_mode: 'HTML' });
            }
        }


    }
    if (typeof f !== 'undefined') f()
}
global.TelegramUsers = {}
global.bot = new TelegramBot(TELEGRAMBOTKEY, { polling: true });
global.bot.onText(/\/echo (.+)/, (msg, match) => {
    global.TMmsg = msg
    const resp = match[1];
    // _log(msg)
});
bot.on('message', (msg, e) => {
    // _log(msg)
    TelegramUsers[msg.from.id] = msg.from
    userInput(msg)
    // _log(TelegramUsers)

});
bot.on("polling_error", console.log);