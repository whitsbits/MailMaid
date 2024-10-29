const folderName = "DATA"; // Specify your folder name
const fileName = "data.json";

function createDocument(email, data) {
  let folder = getOrCreateFolder(folderName);
  let file = getFileByName(folder, fileName);
  let jsonData = {};

  if (file) {
    const fileContent = file.getBlob().getDataAsString();
    jsonData = JSON.parse(fileContent);
  }

  jsonData[`users/${email}`] = data;

  const updatedContent = JSON.stringify(jsonData, null, 2);

  if (file) {
    file.setContent(updatedContent);
  } else {
    folder.createFile(fileName, updatedContent, MimeType.JSON);
  }
}

function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

function getFileByName(folder, fileName) {
  const files = folder.getFilesByName(fileName);
  if (files.hasNext()) {
    return files.next();
  } else {
    return null;
  }
}

// Example usage
function exampleWriteUsage() {
  const email = "example@example.com";
  const data = { name: "John Doe", age: 30 };
  createDocument(email, data);
}

function readJsonFile(folderName, fileName) {
  // Get the folder by name
  const folder = getFolderByName(folderName);
  if (!folder) {
    throw new Error(`Folder "${folderName}" not found.`);
  }

  // Get the file by name
  const file = getFileByName(folder, fileName);
  if (!file) {
    throw new Error(`File "${fileName}" not found in folder "${folderName}".`);
  }

  // Read the file contents
  const fileContent = file.getBlob().getDataAsString();
  const jsonData = JSON.parse(fileContent);

  return jsonData;
}

function getFolderByName(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return null;
  }
}

function getFileByName(folder, fileName) {
  const files = folder.getFilesByName(fileName);
  if (files.hasNext()) {
    return files.next();
  } else {
    return null;
  }
}

// Example usage
function exampleReadUsage() {
  try {
    const jsonData = readJsonFile(folderName, fileName);
    Logger.log(jsonData);
  } catch (error) {
    Logger.log(error.message);
  }
}
