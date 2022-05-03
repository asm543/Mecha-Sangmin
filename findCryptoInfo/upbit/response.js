/*
암호화페 정보
© 2021 Dark Tornado, All rights reserved.
라이선스 : CCL BY-NC 4.0
업비트에서 암호화페 가격 정보를 뜯어와요
*/

function getCoinMark(name) {
    var data = Utils.parse("https://api.upbit.com/v1/market/all").text();
    data = JSON.parse(data);
    for (var n = 0; n < data.length; n++) {
        if (data[n].market.startsWith("KRW-") && data[n].korean_name == name) return data[n].market;
    }
    return null;
};

function getCoinName(coinName){
    switch(coinName){
        case "비트":
        case "대장":
        case "비코":
        case "빗코":
          return "비트코인";
        case "이더":
          return "이더리움";
        case "디센":
          return "디센트럴랜드";
        case "엑시":
          return "엑시인피니티";
        case "알고":
          return "알고랜드";
        case "메타":
          return "메타디움";
        case "카이버":
          return "카이버네트워크";
        case "니어":
          return "니어프로토콜";
        case "도지":
        case "개새끼":
          return "도지코인";
        case "이클":
        case "etc":
        case "ETC":
          return "이더리움클래식";
        case "피르마":
          return "피르마체인";
        case "아발":
          return "아발란체";
        case "아다":
        case "카르다노":
          return "에이다";
        case "폴":
          return "폴리곤";
        case "엔진":
        case "은진":
          return "엔진코인";
        case "1인치":
          return "1인치네트워크";
        case "모스":
          return "모스코인";
        case "누싸":
        case "누":
          return "누사이퍼";
        case "슨트":
          return "스테이터스네트워크토큰";
        case "에브리":
          return "에브리피디아";
        case "무비":
          return "무비블록";
        case "펀디":
        case "응디":
          return "펀디엑스";
        case "룸":
          return "룸네트워크";
        case "썬더":
          return "썬더코어";
        case "그로스톨":
          return "그로스톨코인";
        case "비토":
          return "비트토렌트";
        case "센티넬":
          return "센티넬프로토콜";
        case "던":
        case "던파":
          return "던프로토콜";
        case "라이트":
        case "라코":
          return "라이트코인";
        case "스텔라":
          return "스텔라루멘";
        case "리퍼":
          return "리퍼리움";
        case "스트라":
          return "스트라티스";
        case "시아":
          return "시아코인";
        case "비캐":
          return "비트코인캐시";
        case "코박":
          return "코박토큰";
        case "스달":
          return "스팀달러";
        case "스붕이":
          return "비트코인에스브이";
        case "비골":
          return "비트코인골드";
        default:
          return coinName;
    }
}

function upbitCalc(cmd) {
  var calc = 0;
  var mark = getCoinMark(getCoinName(cmd[2]));
  if (mark == null) {
    return cmd[2] + "(이)라는 암호화폐를 찾을 수 없습니다.";
  } else if (!Number(cmd[1])) {
    return "숫자를 입력해주세요.";
  } else {
      var data = Utils.parse(
      "https://api.upbit.com/v1/ticker?markets=" + mark
    ).text();
    data = JSON.parse(data);
    return data[0].trade_price * Number(cmd[1]) + "원";
  }
}

function response(room, msg, sender, isGroupChat, replier) {
    var cmd = msg.split(" ");
    switch(cmd[0]){
      case "업": {
        var mark = getCoinMark(getCoinName(cmd[1]));
        if (mark == null) {
            replier.reply(cmd[1] + "(이)라는 암호화폐를 찾을 수 없습니다.");
            break;
        } else {
            var data = Utils.parse("https://api.upbit.com/v1/ticker?markets=" + mark).text();
            data = JSON.parse(data);
            replier.reply("현재 " + getCoinName(cmd[1]) + " 시세는 " + data[0].trade_price + "원입니다.");
            break;
        }
      }
      case "계산": {
        replier.reply("= " + upbitCalc(cmd));
        break;
      }
   }
}