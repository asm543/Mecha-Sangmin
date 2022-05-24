const launch = '/storage/emulated/0/bot/launch.txt'
const dinner = '/storage/emulated/0/bot/dinner.txt'

const fs = FileStream;

var launchSuggest = JSON.parse(fs.read(launch));
var dinnerSuggest = JSON.parse(fs.read(dinner));

function addLaunch(cmd) {
    launchSuggest[cmd[1]] = cmd[1];
}

function addDinner(cmd) {
    dinnerSuggest[cmd[1]] = cmd[1];
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    var cmd = msg.split(" ");
    switch (cmd[0]) {
        case "메카상민아":
            replier.reply("네, 말씀하세요.");
            break;
        case "안상민": {
            if (cmd[1] == "바보")
                replier.reply("너가 더 바보야");
            break;
        }
        case "정지훈": {
            if (cmd[1] == "바보")
                replier.reply("정지훈 바보!");
            break;
        }
        case "김선규": {
            if (cmd[1] == "바보")
                replier.reply("김선규 바보!");
            break;
        }
        case "김재승": {
            if (cmd[1] == "바보")
                replier.reply("김재승 바보!");
            break;
        }
        case "사랑해":
            replier.reply("고마워요 *^^*");
            break;
        case "시발":
        case "씨발":
            replier.reply("욕은 나빠요!");
            break;
        case "날씨":
            replier.reply("준비중입니다.");
            break;
        case "로또": {
            if (Number(cmd[1]) > Number(cmd[2]) && (Number(cmd[1]) && Number(cmd[2]))) {
                const selectIndex = (totalIndex, selectingNumber) => {
                    let randomIndexArray = []
                    for (i = 0; i < selectingNumber; i++) {
                        randomNum = Math.floor(Math.random() * totalIndex) + 1;
                        if (randomIndexArray.indexOf(randomNum) === -1) {
                            randomIndexArray.push(randomNum)
                        } else {
                            i--
                        }
                    }
                    return randomIndexArray
                }
                replier.reply(selectIndex(cmd[1], cmd[2]).sort((a, b) => a - b));
            } else replier.reply("유효한 범위의 숫자를 입력해주세요.");
            break;
        }
        case "따라하기": {
            replier.reply(cmd[1]);
            break;
        }
        case "점심추천": {
            var launchList = Object.keys(JSON.stringify(launchSuggest));
            replier.reply(launchList[Math.floor(Math.random() * launchList.length)]);
        }
        case "점심목록": {
            replier.reply(JSON.stringify(launchSuggest));
            break;
        }
        case "점심추가": {
            addLaunch(cmd);
            fs.write(launch, JSON.stringify(launchSuggest));
            replier.reply("점심 " + cmd[1] + " 추가되었습니다.");
            break;
        }
        case "점심삭제": {
            delete launchSuggest[cmd[1]];
            fs.write(launch, JSON.stringify(launchSuggest));
            replier.reply("점심 " + cmd[1] + " 삭제되었습니다.");
            break;
        }
    }
}
