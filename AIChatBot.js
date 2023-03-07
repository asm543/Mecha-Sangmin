function sangsbi(message) {
  const prompt = `USER: ${message}\nAI:`;
  const conn = org.jsoup.Jsoup.connect("https://api.openai.com/v1/chat/completions");
  conn.header("Content-Type", "application/json");
  conn.header(
    "Authorization",
    "Bearer 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"
  );
  conn.ignoreContentType(true);
  conn.requestBody(
    JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    })
  );
  
  const res = conn.post().text();
  const obj = JSON.parse(res);
  return obj.choices[0].message.content.replace(/\n/g, '');
}

function sangsbiSetting(message) {
  const prompt = `USER: ${message}\nAI:`;
  const conn = org.jsoup.Jsoup.connect("https://api.openai.com/v1/chat/completions");
  conn.header("Content-Type", "application/json");
  conn.header(
    "Authorization",
    "Bearer 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"
  );
  conn.ignoreContentType(true);
  conn.requestBody(
    JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: message }],
    })
  );
  
  const res = conn.post().text();
  const obj = JSON.parse(res);
  return obj.choices[0].message.content.replace(/\n/g, '');
}

function summarizeString(str) {
  const pattern = /.*상스비\s*/;
  return str.replace(pattern, '');
}

function summarizeSettingString(str) {
  const pattern = /.*세팅\s*/;
  return str.replace(pattern, '');
}

function response(room, msg, sender, isGroupChat, replier) {
  var cmd = msg.split(" ");
  if(cmd[0] == "상스비") {
    replier.reply(sangsbi(summarizeString(msg)));
  }
if(cmd[0] == "세팅") {
    replier.reply(sangsbiSetting(summarizeSettingString(msg)));
  }
}
