/*
암호화페 정보
© 2021 Dark Tornado, All rights reserved.
라이선스 : CCL BY-NC 4.0
업비트에서 암호화페 가격 정보를 뜯어와요
*/
const uppath = '/storage/emulated/0/bot/upbitSymbol.txt'
const bipath = '/storage/emulated/0/bot/binanceSymbol.txt'
const fs = FileStream;

var upSymbol = JSON.parse(fs.read(uppath));
var biSymbol = JSON.parse(fs.read(bipath));

function addUpSymbol(cmd) {
    upSymbol[cmd[1]] = cmd[2].toUpperCase();
}

function getUpSymbol(name) {
    return upSymbol[name];
}

function addBiSymbol(cmd) {
    biSymbol[cmd[1]] = cmd[2].toUpperCase();
}

function getBiSymbol(name) {
    return biSymbol[name];
}

function getCoinMark(name) {
    var data = Utils.parse("https://api.upbit.com/v1/market/all").text();
    data = JSON.parse(data);
    for (var n = 0; n < data.length; n++) {
        if (data[n].market.startsWith("KRW-") && data[n].korean_name == name) return data[n].market;
    }
    return null;
};

function getBinancePrice(symbol) {
    var data = Utils.parse("https://api.binance.com/api/v3/avgPrice?symbol=" + symbol).text();
    return Number(JSON.parse(data).price);
};

function getKRWUSDPrice() {
    var data = Utils.parse("https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD").text();
    return Number(JSON.parse(data)[0].basePrice);
};

function getDunamuFng() {
    var data = JSON.parse(Utils.parse("https://datavalue.dunamu.com/api/fearindex").text());
    return Number(data.today.score).toFixed(2) + " - " + data.today.stage + "\n" + data.today.comment;
};

function dotRegex(num, fixed) {
    return num.toFixed(fixed)
};

function numEstablish(num) {
    num = (num + "").split(".");
    if (num.length > 1) {
        return num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + num[1];
    } else return num[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function upbitCalc(cmd) {
    var mark = getUpSymbol(cmd[2]);
    if (mark == undefined || mark == null) {
        return "cannotFindSymbol";
    } else if (!Number(cmd[1])) {
        return "NaN";
    } else {
        var data = Utils.parse(
            "https://api.upbit.com/v1/ticker?markets=" + mark
        ).text();
        data = JSON.parse(data);
        return numEstablish("" + data[0].trade_price * Number(cmd[1]));
    }
}

function binanceCalc(cmd) {
    var binancePrice = getBinancePrice(getBiSymbol(cmd[2]));
    if (getBiSymbol(cmd[2]) == undefined || getBiSymbol(cmd[2]) == null) {
        return "cannotFindSymbol";
    } else if (!Number(cmd[1])) {
        return "NaN";
    } else {
        return numEstablish("" + dotRegex(cmd[1] * binancePrice * getKRWUSDPrice(), 0)) + "원 (" + dotRegex(cmd[1] * binancePrice, 3) + "USD)";
    }
}

function getDominance() {
    return "https://kr.tradingview.com/symbols/CRYPTOCAP-BTC.D/";
}

function response(room, msg, sender, isGroupChat, replier) {
    var cmd = msg.split(" ");
    switch (cmd[0]) {
        case "업": {
            var mark = getUpSymbol(cmd[1]);
            if (mark == null) {
                replier.reply(cmd[1] + "(이)라는 암호화폐를 찾을 수 없습니다.\n심볼을 마켓명-심볼명 형식으로 등록해주세요.\nex) 업추가 비트 KRW-BTC");
                break;
            } else {
                var data = Utils.parse("https://api.upbit.com/v1/ticker?markets=" + mark).text();
                var text = "원 입니다.";
                data = JSON.parse(data);
                var riseOrFall = data[0].change == "RISE" ? "+" : "-"
                switch (mark.split("-")[0]) {
                    case "KRW":
                        text = "원 입니다.";
                        break;
                    case "BTC":
                        text = "BTC 입니다.";
                        break;
                    case "USDT":
                        text = "USDT 입니다.";
                        break;
                }
                replier.reply("업비트의 " + getUpSymbol(cmd[1]) + "가격 : " + numEstablish(data[0].trade_price) + text + "\n(전일대비 : " + riseOrFall + dotRegex(data[0].change_rate * 100, 3) + "%)");
                break;
            }
        }
        case "업심볼": {
            replier.reply(JSON.stringify(upSymbol));
            break;
        }
        case "업추가": {
            addUpSymbol(cmd);
            fs.write(uppath, JSON.stringify(upSymbol));
            replier.reply("업비트 심볼 " + cmd[1] + " = " + cmd[2] + " 추가되었습니다.");
            break;
        }
        case "업수정": {
            addUpSymbol(cmd);
            fs.write(uppath, JSON.stringify(upSymbol));
            replier.reply("업비트 심볼 " + cmd[1] + " = " + cmd[2] + " 수정되었습니다.");
            break;
        }
        case "업삭제": {
            delete upSymbol[cmd[1]];
            fs.write(uppath, JSON.stringify(upSymbol));
            replier.reply("업비트 심볼 " + cmd[1] + " 삭제되었습니다.");
            break;
        }
        case "바심볼": {
            replier.reply(JSON.stringify(biSymbol));
            break;
        }
        case "바추가": {
            addBiSymbol(cmd);
            fs.write(bipath, JSON.stringify(biSymbol));
            replier.reply("바이낸스 심볼 " + cmd[1] + " = " + cmd[2] + " 추가되었습니다.");
            break;
        }
        case "바수정": {
            addBiSymbol(cmd);
            fs.write(bipath, JSON.stringify(biSymbol));
            replier.reply("바이낸스 심볼 " + cmd[1] + " = " + cmd[2] + " 수정되었습니다.");
            break;
        }
        case "바삭제": {
            delete biSymbol[cmd[1]];
            fs.write(bipath, JSON.stringify(biSymbol));
            replier.reply("바이낸스 심볼 " + cmd[1] + " 삭제되었습니다.");
            break;
        }
        case "김프": {
            var mark = getUpSymbol(cmd[1]);
            if (mark == null) {
                replier.reply(cmd[1] + "(이)라는 암호화폐를 찾을 수 없습니다.\n심볼을 마켓명-심볼명 형식으로 등록해주세요.\nex) 업추가 비트 KRW-BTC");
                break;
            } else if (getBiSymbol(cmd[1]) == undefined || getBiSymbol (cmd[1]) == null) {
                replier.reply(cmd[1] + "(이)라는 암호화폐를 찾을 수 없습니다.\n심볼을 심볼명+거래단위 형식으로 등록해주세요.\nex) 바추가 비트 BTCBUSD");
            } else {
                var data = Utils.parse("https://api.upbit.com/v1/ticker?markets=" + mark).text();
                data = JSON.parse(data);
                var up = data[0].trade_price;
                var bi = dotRegex(getKRWUSDPrice() * getBinancePrice(getBiSymbol(cmd[1])), 3);
                replier.reply(cmd[1] + "의 김프는 " + dotRegex(((up / bi) - 1) * 100, 3) + "% 입니다.");
            }
            break;
        }
        case "계산": {
            var upbitPrice = upbitCalc(cmd);
            var binancePrice = binanceCalc(cmd);
            if (upbitPrice != "cannotFindSymbol" && upbitPrice != "NaN") {
                replier.reply("= " + upbitPrice + "원");
            } else if (binancePrice != "cannotFindSymbol" && binancePrice != "NaN") {
                replier.reply("= " + binancePrice);
            } else if (upbitPrice == "cannotFindSymbol" && binancePrice == "cannotFindSymbol") {
                replier.reply("= 심볼을 찾을 수 없습니다.");
            } else if (upbitPrice == "NaN" && binancePrice == "NaN") {
                replier.reply("= 숫자를 입력해주세요.");
            } else replier.reply("= 계산 1 코인명 형식으로 입력해주세요.");
            break;
        }
        case "바": {
            if (getBiSymbol(cmd[1]) == undefined || getBiSymbol (cmd[1]) == null) {
                replier.reply(cmd[1] + "(이)라는 암호화폐를 찾을 수 없습니다.\n심볼을 심볼명+거래단위 형식으로 등록해주세요.\nex) 바추가 비트 BTCBUSD");
            } else {
                replier.reply("바이낸스의 " + getBiSymbol(cmd[1]) + "가격 : " + numEstablish(dotRegex(getBinancePrice(getBiSymbol(cmd[1])), 3)) + "달러입니다.\n(" + numEstablish(dotRegex(getKRWUSDPrice() * getBinancePrice(getBiSymbol(cmd[1])), 3)) + "원)");
            }
            break;
        }
        case "지수": {
            replier.reply(getDunamuFng());
            break;
        }
        case "도미": {
            replier.reply(getDominance());
            break;
        }
    }
}
