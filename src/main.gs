// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');

function doPost(e) {
  
  // WebHookで受信した応答用Token
  const replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザーのメッセージを取得
  const userMessage = JSON.parse(e.postData.contents).events[0].message.text;

  if(userMessage == '今週') {
    getWeeklySchedule(replyToken, userMessage);
  } else if(userMessage.substr(0,2) == '登録') {
    if(userMessage.length() > 3) {
      registerSchedule(replyToken, userMessage.substr(3));
    } else {
      linePost(replyToken, '登録コマンドは後ろにスペースとタイトルを入れてください');
    }
  } else {
    errorCommand(replyToken, userMessage);
  }
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function getWeeklySchedule(replyToken, userMessage) {
  linePost(replyToken, 'getWeeklySchedule');
}

function registerSchedule(replyToken, title) {
  
  let anniversaryDates = {};
  const today = new Date();
  anniversaryDates[`${title}当日`] = today; // 記念日当日
  
  for(var i = 1; i <= 9; i++) { // 記念日から100日,200日...900日後
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() + i*100);
    anniversaryDates[`${title}${i*100}日記念`] = tempDate;
  }
  
  for(var i = 1; i <= 11; i++) { // 記念日から1ヶ月,2ヶ月...11ヶ月後
    let tempDate = new Date();
    tempDate.setMonth(tempDate.getMonth() + i);
    anniversaryDates[`${title}${i}ヶ月記念`] = tempDate;
  }
  
  for(var i = 1; i <= 9; i++) { // 記念日から1年,2年...9年後
    let tempDate = new Date();
    tempDate.setFullYear(tempDate.getFullYear() + i);
    anniversaryDates[`${title}${i}年記念`] = tempDate;
  }
  
  for(var i = 1; i <= 5; i++) { // 記念日から10年,20年...50年後
    let tempDate = new Date();
    tempDate.setFullYear(tempDate.getFullYear() + i*10);
    anniversaryDates[`${title}${i*10}年記念`] = tempDate;
  }
  
  Object.keys(anniversaryDates).forEach(function(key) {
    var title = key;
    var date = this[key];
    createEvents(title, date);
  }, anniversaryDates);
  linePost(replyToken, `${title}の登録が完了しました！`);
}

function errorCommand(replyToken, userMessage) {
  linePost(replyToken, `\"${userMessage}\"というコマンドは存在しません`);
  
}

function linePost(replyToken, message) {
  
  // 応答メッセージ用のAPI URL
  const url = 'https://api.line.me/v2/bot/message/reply';
  
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': message,
      }],
    }),
  });
}