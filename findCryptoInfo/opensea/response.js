const path = '/storage/emulated/0/bot/slug.txt'
const popolPath = '/storage/emulated/0/bot/popol.txt'
const rarePath = '/storage/emulated/0/bot/rare.txt'
const fs = FileStream;

var slug = JSON.parse(fs.read(path));
var popol = JSON.parse(fs.read(popolPath));
var rare = JSON.parse(fs.read(rarePath));

function numEstablish(num) {
  if(num == null || num == undefined){
    return num;
  } else return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function dotRegex(num, fixed) {
  if(Number(num)){
    return num.toFixed(fixed);
  } else return num;
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
  if (slug[name] == null || slug[name] == undefined) {
    return "컬렉션을 추가해주세요. ex)추가 케이팝 kpopctzen-official\nhttps://opensea.io/collection/kpopctzen-official 에서 kpopctzen-official를 추가해주시면 됩니다.";
  } else return slug[name];
}

function addRare(cmd) {
  rare[cmd[1]] = {head: cmd[2], tail: cmd[3]};
}

function getRare(name) {
  if (rare[name] == null || rare[name] == undefined) {
    return "레어리티를 보고싶은 컬렉션의 데이터주소를 토큰번호 제외하고 추가해주세요. ex)추가 케이팝 https://rowoonlabs.mypinata.cloud/ipfs/QmdLgdpuCbohDDkYMyk2rTLo2oFBYSUYcarBvknPqC15ie/";
  } else return rare[name];
}

function addPopol(user, cmd) {
  if (popol[user] == null) {
    popol[user] = {};
  }
  if (slug[cmd[1]] == null || slug[cmd[1]] == undefined) {
    return "컬렉션을 추가해주세요. ex)추가 케이팝 kpopctzen-official\nhttps://opensea.io/collection/kpopctzen-official 에서 kpopctzen-official를 추가해주시면 됩니다.";
  } else {
    popol[user][cmd[1]] = getSlug(cmd[1]);
  }
}

function getPopol(user) {
  return popol[user];
}

function openSea(cmd) {
  var mark = getSlug(cmd);
  if (slug[cmd] == null || slug[cmd] == undefined) {
    return "컬렉션을 추가해주세요. ex)추가 케이팝 kpopctzen-official\nhttps://opensea.io/collection/kpopctzen-official 에서 kpopctzen-official를 추가해주시면 됩니다.";
  } else {
    var data = Utils.parse("https://api.opensea.io/api/v1/collection/" + mark).text();
    data = JSON.parse(data);
    var responseData = data.collection.stats
    return cmd + "의 오픈씨 거래 정보\n일 거래량 : " + dotRegex(responseData.one_day_volume, 3) + "ETH\n일 거래 횟수 : " + responseData.one_day_sales + "\n평균가격 : ⓔ " + dotRegex(responseData.average_price, 3) + " ⓚ " + dotRegex(getKlayPrice(responseData.average_price), 0) + "\n바닥가 : ⓔ " + dotRegex(responseData.floor_price, 3) + " ⓚ " + dotRegex(getKlayPrice(responseData.floor_price), 0) + "\n원화 : " + numEstablish(dotRegex(getKRWPrice(responseData.floor_price), 0)) + "원";
  }
}

function openSeaLink(cmd) {
  if (slug[cmd] == null || slug[cmd] == undefined) {
    return "컬렉션을 추가해주세요. ex)추가 케이팝 kpopctzen-official\nhttps://opensea.io/collection/kpopctzen-official 에서 kpopctzen-official를 추가해주시면 됩니다.";
  } else {
    var data = "https://opensea.io/collection/" + getSlug(cmd);
    return data;
  }
}

function getListings(slug) {
  var data = org.jsoup.Jsoup.connect("https://opensea.io/collection/" + getSlug(slug) + "?search[sortAscending]=true&search[sortBy]=PRICE&search[toggles][0]=BUY_NOW").header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8").header("accept-encoding", "gzip, deflate, sdch").header("Accept-language", "zh-cn,zh;q=0.8").header("user-agent", "mozilla/5.0 (Windows NT 10.0;  WOW64) applewebkit/537.36 (khtml, like Gecko) chrome/55.0.2883.87 safari/537.36 ").get().select("a[class=sc-1pie21o-0 elyzfO Asset--anchor]");
  var returnArray = []

  data.forEach(item => {
    returnArray.push(item.attr("href").split("/")[4])
  })
  return returnArray;
}

function openSeaRare(cmd) {
  var mark = getRare(cmd[1]);
  var listings = getListings(cmd[1]);
  var returnData = "";
  if (mark == null || mark == undefined) {
    return "레어리티를 보고싶은 컬렉션의 데이터주소를 토큰번호 제외하고 추가해주세요. ex)추가 케이팝 https://rowoonlabs.mypinata.cloud/ipfs/QmdLgdpuCbohDDkYMyk2rTLo2oFBYSUYcarBvknPqC15ie/";
  } else if (cmd.length == 3) {
    listings.forEach(token => {
      var data = Utils.parse(mark.head + token + mark.tail).text();
        data = JSON.parse(data);
        data.attributes.forEach(item => {
          if(item.trait_type == cmd[2]){
            returnData += token + " : " + item.value + "\n";
          }
        })
    })
  } else {
    cmd.forEach(token => {
      if(Number(token)){
        var data = Utils.parse(mark.head + token + mark.tail).text();
        data = JSON.parse(data);
        data.attributes.forEach(item => {
          if(item.trait_type == cmd[2]){
            returnData += token + " : " + item.value + "\n";
          }
        })
      }
    })
  }
  return returnData;
}

function response(room, msg, sender, isGroupChat, replier) {
  var cmd = msg.split(" ");
  switch (cmd[0]) {
    case "옾": {
      replier.reply(openSea(cmd[1]));
      break;
    }
    case "옾링": {
      replier.reply(openSeaLink(cmd[1]));
      break;
    }
    case "레어": {
      replier.reply(openSeaRare(cmd));
      break;
    }
    case "레어보기": {
      replier.reply(JSON.stringify(rare));
      break;
    }
    case "레어추가": {
      addRare(cmd);
      fs.write(rarePath, JSON.stringify(rare));
      replier.reply(cmd[1] + "의 레어리티검색 추가되었습니다.");
      break;
    }
    case "레어수정": {
      rare[cmd[1]] = {head: cmd[2], tail: cmd[3]};
      fs.write(rarePath, JSON.stringify(rare));
      replier.reply(cmd[1] + " 수정되었습니다.");
      break;
    }
    case "레어삭제": {
      delete rare[cmd[1]];
      fs.write(rarePath, JSON.stringify(rare));
      replier.reply(cmd[1] + " 삭제되었습니다.");
      break;
    }
    case "옾폴": {
      var returnText = sender + "님의 옾폴현황\n -------------------------- \n";
      for (slugName in popol[sender]) {
          returnText = returnText + openSea(slugName) + "\n -------------------------- \n";
      }
      replier.reply(returnText);
      break;
    }
    case "옾폴링": {
      var returnText = "";
      for (slugName in popol[sender]) {
          returnText = returnText + openSeaLink(slugName) + "\n";
      }
      replier.reply(returnText);
      break;
    }
    case "내옾폴": {
      replier.reply(JSON.stringify(popol));
      break;
    }
    case "슬러그": {
      replier.reply(JSON.stringify(slug));
      break;
    }
    case "추가": {
      addSlug(cmd);
      fs.write(path, JSON.stringify(slug));
      replier.reply(cmd[1] + " 추가되었습니다.");
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
    case "옾폴추가": {
      addPopol(sender, cmd);
      fs.write(popolPath, JSON.stringify(popol));
      replier.reply(sender + "님의 옾폴에 " + cmd[1] + "가 추가되었습니다.\n(등록된 슬러그 : " + slug[cmd[1]] + ")");
      break;
    }
    case "옾폴수정": {
      delete popol[sender][cmd[1]];
      popol[sender][cmd[2]] = slug[cmd[2]];
      fs.write(popolPath, JSON.stringify(popol));
      replier.reply(sender + "님의 옾폴에서 " + cmd[1] + "(이)가 수정되었습니다. \n(수정된 슬러그 : " + slug[cmd[2]] + ")");
      break;
    }
    case "옾폴삭제": {
      delete popol[sender][cmd[1]];
      fs.write(popolPath, JSON.stringify(popol));
      replier.reply(sender + "님의 옾폴에서 " + cmd[1] + "(이)가 삭제되었습니다.");
      break;
    }
  }
}
