https://dexata.kr/#/?tokenA=0xe91ffe2e15ccd56b1b8ddf7cdf848dfee6b5a858&tokenB=


function selectDex() {

  var temp = org.jsoup.Jsoup.connect("https://dexata.kr/#/?tokenA=0xe91ffe2e15ccd56b1b8ddf7cdf848dfee6b5a858&tokenB=").ignoreContentType(true).get().text();
  //temp = JSON.parse(temp);
  //temp = temp.blockPrices[0].baseFeePerGas;
  return "현재 덱스 : " + temp;
}

function response(room, msg, sender, isGroupChat, replier) {
  if(msg == "덱스") {
    replier.reply(selectDex());
  }
}
