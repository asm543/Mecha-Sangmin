const path='/storage/emulated/0/bot/slug.txt'
const fs = FileStream;

var slug = JSON.parse(fs.read(path));

function addSlug(cmd) {
    slug[cmd[1]] = cmd[2];
}

function getSlug(name) {
  return slug[name];
}

function openSea(cmd) {
  if (cmd[0] == "옾") {
    var mark = getSlug(cmd[1]);
    if (mark == null || mark == undefined) {
      return "컬렉션을 추가해주세요. ex)추가 케이팝 kpopctzen-official";
    } else {
      var data = Utils.parse(
        "https://opensea.io/collection/" + mark
      ).text();
      
      return data;
    }
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