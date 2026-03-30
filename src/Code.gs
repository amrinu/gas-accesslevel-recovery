// ==========================================  
// MAIN CONFIGURATION  
// ==========================================  
var POLICY_ID = 'YOUR_POLICY_ID_HERE'; 
var SHEET_ID = 'YOUR_SHEET_ID_HERE';   
var SHEET_NAME = 'CAA Backup';  
  
function doGet() {  
  return HtmlService.createHtmlOutputFromFile('Index')  
      .setTitle('CAA Security & Recovery Console')  
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);  
}  
  
function getDashboardData() {  
  var liveData = getLiveGCPData();  
  var backupData = getSheetBackupData();  
  var combinedMap = {};  
  
  for (var i = 0; i < backupData.length; i++) {  
    var b = backupData[i];  
    combinedMap[b.resourceName] = {  
      title: b.title,  
      resourceName: b.resourceName,  
      lastBackup: b.timestamp,  
      createTime: b.createTime,   
      updateTime: b.updateTime,  
      backupJson: b.rawJson,  
      liveJson: null,  
      statusCheck: 'DELETED'  
    };  
  }  
  
  for (var j = 0; j < liveData.length; j++) {  
    var l = liveData[j];  
    var cTime = l.createTime ? new Date(l.createTime).toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}) : 'N/A';  
    var uTime = l.updateTime ? new Date(l.updateTime).toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}) : 'N/A';  
    var currentLiveJson = JSON.stringify(l);  
  
    if (combinedMap[l.name]) {  
      var bJsonObj = JSON.parse(combinedMap[l.name].backupJson || '{}');  
      var bCore = JSON.stringify({ basic: bJsonObj.basic, custom: bJsonObj.custom, title: bJsonObj.title, description: bJsonObj.description });  
      var lCore = JSON.stringify({ basic: l.basic, custom: l.custom, title: l.title, description: l.description });  
  
      combinedMap[l.name].statusCheck = (bCore !== lCore) ? 'MODIFIED' : 'SYNCED';  
      combinedMap[l.name].liveJson = currentLiveJson;  
      combinedMap[l.name].createTime = cTime;   
      combinedMap[l.name].updateTime = uTime;  
    } else {  
      combinedMap[l.name] = {  
        title: l.title,  
        resourceName: l.name,  
        lastBackup: 'Pending Sync',  
        createTime: cTime,  
        updateTime: uTime,  
        backupJson: null,  
        liveJson: currentLiveJson,  
        statusCheck: 'NEW'  
      };  
    }  
  }  
  
  var finalArray = [];  
  for (var key in combinedMap) { finalArray.push(combinedMap[key]); }  
  return finalArray;  
}  
  
function syncSystemToSheet() {  
  var liveData = getLiveGCPData();  
  var ss = SpreadsheetApp.openById(SHEET_ID);  
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);  
    
  if (sheet.getLastRow() === 0) {  
    sheet.appendRow(['Backup Timestamp', 'Policy Title', 'Resource Name', 'Created At', 'Last Updated', 'Raw JSON']);  
  }  
  
  var timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });  
  var sheetData = [];  
  
  for (var i = 0; i < liveData.length; i++) {  
    var level = liveData[i];  
    var cTime = level.createTime ? new Date(level.createTime).toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}) : 'N/A';  
    var uTime = level.updateTime ? new Date(level.updateTime).toLocaleString('en-US', {timeZone: 'Asia/Jakarta'}) : 'N/A';  
    sheetData.push([timestamp, level.title, level.name, cTime, uTime, JSON.stringify(level)]);  
  }  
  
  if(sheetData.length > 0) {  
    sheet.getRange(sheet.getLastRow() + 1, 1, sheetData.length, sheetData[0].length).setValues(sheetData);  
  }  
  return "Successfully synchronized " + sheetData.length + " policies.";  
}  
  
function restorePolicyToGCP(resourceName, rawJsonString, statusCheck) {  
  var payloadObj = JSON.parse(rawJsonString);  
  delete payloadObj.createTime;   
  delete payloadObj.updateTime;  
    
  var options = {  
    'contentType': 'application/json',  
    'headers': { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() },  
    'muteHttpExceptions': true  
  };  
  var url, response;  
  
  if (statusCheck === 'DELETED') {  
    url = 'https://accesscontextmanager.googleapis.com/v1/accessPolicies/' + POLICY_ID + '/accessLevels';  
    options.method = 'post';  
    options.payload = JSON.stringify(payloadObj);  
    response = UrlFetchApp.fetch(url, options);  
  } else {  
    delete payloadObj.name;   
    url = 'https://accesscontextmanager.googleapis.com/v1/' + resourceName + '?updateMask=title,description,basic,custom';  
    options.method = 'patch';  
    options.payload = JSON.stringify(payloadObj);  
    response = UrlFetchApp.fetch(url, options);  
  }

  if (response.getResponseCode() !== 200) throw new Error("Operation failed: " + response.getContentText());  
  return "Policy successfully restored.";  
}  
  
function getLiveGCPData() {  
  var url = 'https://accesscontextmanager.googleapis.com/v1/accessPolicies/' + POLICY_ID + '/accessLevels';  
  var res = UrlFetchApp.fetch(url, { headers: { 'Authorization': 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });  
  if (res.getResponseCode() == 200) return JSON.parse(res.getContentText()).accessLevels || [];  
  return [];  
}  
  
function getSheetBackupData() {  
  var ss = SpreadsheetApp.openById(SHEET_ID);  
  var sheet = ss.getSheetByName(SHEET_NAME);  
  if (!sheet || sheet.getLastRow() < 2) return [];  
    
  var data = sheet.getDataRange().getValues();  
  var result = [];  
  for (var i = 1; i < data.length; i++) {  
    if(data[i].length >= 6) {  
      result.push({ timestamp: data[i][0], title: data[i][1], resourceName: data[i][2], createTime: data[i][3], updateTime: data[i][4], rawJson: data[i][5] });  
    }  
  }  
  return result;  
}
