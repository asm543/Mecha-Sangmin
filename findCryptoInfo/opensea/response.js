const path='/storage/emulated/0/bot/slug.txt'
const fs = FileStream;

var slug = JSON.parse(fs.read(path));

function numEstablish(num) {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dotRegex(num, fixed) {
  return num.toFixed(fixed)
}

function getBinancePrice(symbol) {
  var data = Utils.parse("https://api.binance.com/api/v3/avgPrice?symbol=" + symbol).text();
  return Number(JSON.parse(data).price);
}

function getKRWUSDPrice() {
  var data = Utils.parse("https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD").text();
  return Number(JSON.parse(data)[0].basePrice);
}

function getKlayPrice(ethPrice) {
  return (getBinancePrice("ETHUSDT") * Number(ethPrice)) / getBinancePrice("KLAYUSDT");
}

function getKRWPrice(ethPrice) {
  return getBinancePrice("ETHUSDT") * Number(ethPrice) * getKRWUSDPrice();
}

function addSlug(cmd) {
  slug[cmd[1]] = cmd[2];
}

function getSlug(name) {
  return slug[name];
}

function openSea(cmd) {
  var mark = getSlug(cmd[1]);
  if (mark == null || mark == undefined) {
    return "컬렉션을 추가해주세요. ex)추가 케이팝 kpopctzen-official\nhttps://opensea.io/collection/kpopctzen-official 에서 kpopctzen-official를 추가해주시면 됩니다.";
  } else {
    var data = Utils.parse("https://api.opensea.io/api/v1/collection/" + mark).text();
    data = JSON.parse(data);
    var responseData = data.collection.stats
    return cmd[1] + "의 오픈씨 거래 정보\n일 거래량 : " + dotRegex(responseData.one_day_volume, 3) + "ETH\n일 거래 횟수 : " + responseData.one_day_sales + "\n평균가격 : ⓔ " + dotRegex(responseData.average_price, 3) + " ⓚ " + dotRegex(getKlayPrice(responseData.average_price), 2) + "\n바닥가 : ⓔ " + dotRegex(responseData.floor_price, 3) + " ⓚ " + dotRegex(getKlayPrice(responseData.floor_price), 2) + "\n원화 : " + numEstablish(dotRegex(getKRWPrice(responseData.floor_price), 0)) + "원";
  }
}

function openSeaLink(cmd) {
  var mark = getSlug(cmd[1]);
  if (mark == null || mark == undefined) {
    return "컬렉션을 추가해주세요. ex)추가 케이팝 kpopctzen-official\nhttps://opensea.io/collection/kpopctzen-official 에서 kpopctzen-official를 추가해주시면 됩니다.";
  } else {
    var data = "https://opensea.io/collection/" + getSlug(cmd[1]);
    return data;
  }
}

function response(room, msg, sender, isGroupChat, replier) {
  var cmd = msg.split(" ");
  switch(cmd[0]){
    case "추가": {
      addSlug(cmd);
      fs.write(path, JSON.stringify(slug));
      replier.reply(cmd[1] + " 추가되었습니다.");
      break;
    }
    case "옾": {
      replier.reply(openSea(cmd));
      break;
    }
    case "옾링": {
      replier.reply(openSeaLink(cmd));
      break;
    }
    case "슬러그": {
      replier.reply(JSON.stringify(slug));
      break;
    }
    case "수정": {
      slug[cmd[1]] = cmd[2];
      fs.write(path, JSON.stringify(slug));
      break;
    }
    case "삭제": {
      delete slug[cmd[1]];
      fs.write(path, JSON.stringify(slug));
      break;
    }
  }
}
