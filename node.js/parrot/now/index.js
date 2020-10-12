// Для асинхронной работы используется пакет micro.
const { json } = require('micro');
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');

// Запуск асинхронного сервиса.
module.exports = async (req, res) => {

    try {
        const { request, session, version } = await json(req);
        const escapeWords = ['спасибо', 'хватит', 'выход'];
        const isFinish = escapeWords.some((word) => request.original_utterance.includes(word));

        if (isFinish) {
            return res.end(JSON.stringify(
                {
                    version,
                    session,
                    response: {
                        text: 'хорошего дня!',
                        end_session: true
                    }
                }));
        }

        const response = await fetch('https://bash.im/random');
        const body = await response.text();
        const root = parse(body);

        res.end(JSON.stringify(
            {
                version,
                session,
                response: {
                    text: root.querySelector('.quote__body').innerText,
                    end_session: false,
                },
            }
        ));
    } catch {
        res.end('HELLO');
    }
};