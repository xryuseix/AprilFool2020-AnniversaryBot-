// LINE developersのメッセージ送受信設定に記載のアクセストークン
const ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');

function doPost(e) {
  
  // WebHookで受信した応答用Token
  const to = JSON.parse(e.postData.contents).events[0].source.userId;
  // ユーザーのメッセージを取得
  const userMessage = JSON.parse(e.postData.contents).events[0].message.text;

  if(userMessage == '今週') {
    getWeeklySchedule(to, userMessage);
  } else if(userMessage.substr(0,2) == '登録') {
    if(userMessage.length > 3) {
      registerSchedule(to, userMessage.substr(3));
    } else {
      linePost(to, [{'type': 'text', 'text':'登録コマンドは後ろにスペースとタイトルを入れてください'}]);
    }
  } else {
    errorCommand(to, userMessage);
  }
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}

function getWeeklySchedule(to, userMessage) {
  
  const startDate = new Date();
  const endDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  endDate.setDate(endDate.getDate() + 6);
  
  const calenderId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  const calendar = CalendarApp.getCalendarById(calenderId); 
  const events = calendar.getEvents(startDate, endDate);
  let messages = [{'type': 'text', 'text':`今週の記念日の個数 : ${Object.keys(events).length}`}];

  for(var i = 0; i < Object.keys(events).length; i++) {
    const dateString = Utilities.formatDate(events[i].getStartTime(), 'JST', 'yyyy/MM/dd');
    const message = `日にち : ${dateString}\nタイトル : ${events[i].getTitle()}`;
    messages.push({'type': 'text', 'text':message});
  }
  linePost(to, messages);
}

function dailyCheck() {
  const startDate = new Date();
  const endDate = new Date();
  startDate.setDate(startDate.getDate() - 1);
  
  const calenderId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  const calendar = CalendarApp.getCalendarById(calenderId); 
  const events = calendar.getEvents(startDate, endDate);
  
  if(Object.keys(events).length > 0) {
    let messages = [{'type': 'text', 'text':'本日は記念日です！'}];
    for(var i = 0; i < Object.keys(events).length; i++) {
      const message = `タイトル : ${events[i].getTitle()}`;
      messages.push({'type': 'text', 'text':message});
    }
    const usererId = PropertiesService.getScriptProperties().getProperty('XRYUSEIX_USER_ID');
    linePost(usererId, messages)
  }
}

function registerSchedule(to, title) {
  
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
    let title = key;
    let date = this[key];
    createEvents(title, date);
  }, anniversaryDates);
  linePost(to, [{'type': 'text', 'text':`${title}の登録が完了しました！`}]);
}

function errorCommand(to, userMessage) {
  linePost(to, [{'type': 'text', 'text':`\"${userMessage}\"というコマンドは存在しません`}]);
  
}

function linePost(to, messages) {

  // 応答メッセージ用のAPI URL
  const url = 'https://api.line.me/v2/bot/message/push';
   
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': to,
      'messages': messages,
    }),
  });
}

function getUserId(e) {
    logging(e.postData.getDataAsString());
}
                
function deleteSchedule() {
  
  let anniversaryDates = {};
  const today = new Date();
  anniversaryDates[`当日`] = today; // 記念日当日
  
  for(var i = 1; i <= 9; i++) { // 記念日から100日,200日...900日後
    let tempDate = new Date();
    tempDate.setDate(tempDate.getDate() + i*100);
    anniversaryDates[`${i*100}日記念`] = tempDate;
  }
  
  for(var i = 1; i <= 11; i++) { // 記念日から1ヶ月,2ヶ月...11ヶ月後
    let tempDate = new Date();
    tempDate.setMonth(tempDate.getMonth() + i);
    anniversaryDates[`${i}ヶ月記念`] = tempDate;
  }
  
  for(var i = 1; i <= 9; i++) { // 記念日から1年,2年...9年後
    let tempDate = new Date();
    tempDate.setFullYear(tempDate.getFullYear() + i);
    anniversaryDates[`${i}年記念`] = tempDate;
  }
  
  for(var i = 1; i <= 5; i++) { // 記念日から10年,20年...50年後
    let tempDate = new Date();
    tempDate.setFullYear(tempDate.getFullYear() + i*10);
    anniversaryDates[`${i*10}年記念`] = tempDate;
  }
  
  Object.keys(anniversaryDates).forEach(function(key) {
    let date = this[key];
    deleteEventsForDay(date);
  }, anniversaryDates);
}

function deleteEventsForDay(target_date) {

  const calenderId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  var calendar = CalendarApp.getCalendarById(calenderId);
  var offset = 0;
  target_date.setDate(target_date.getDate() + offset);
  var events = calendar.getEventsForDay(target_date);
  events.forEach(function(e) {
    e.deleteEvent();
  });
}