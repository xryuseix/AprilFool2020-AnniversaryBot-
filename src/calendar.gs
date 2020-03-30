function createEvents(title, startTime, endTime) {
  const calenderId = PropertiesService.getScriptProperties().getProperty('CALENDAR_ID');
  const calendar = CalendarApp.getCalendarById(calenderId); 
  calendar.createEvent(title, startTime, endTime);
}

/*
  const title = '研修1回目';
  const startTime = new Date('2020/4/1 10:00:00');
  const endTime = new Date('2020/4/1 12:00:00');
*/