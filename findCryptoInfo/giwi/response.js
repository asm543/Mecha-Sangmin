function selectGiwi() {

  var temp = org.jsoup.Jsoup.connect("https://api.blocknative.com/gasprices/blockprices").header("Authorization", "be5c6959-9093-4d03-b340-fac9c93e42b8").ignoreContentType(true).get().text();
  temp = JSON.parse(temp);
  temp = temp.blockPrices[0].baseFeePerGas;
  return "현재 기위 : " + temp.toFixed(0);
}

function response(room, msg, sender, isGroupChat, replier) {
  if(msg == "기위") {
    replier.reply(selectGiwi());
  }
}
