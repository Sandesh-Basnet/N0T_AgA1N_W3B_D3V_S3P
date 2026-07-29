const fs = require("fs");

fs.writeFile("output.txt", "Hello, world", (err) => {
  if (err) {
    console.error("Error writing file", err);
    return;
  }

  console.log("File written successfully");

  fs.readFile("output.txt", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file", err);
      return;
    }

    console.log("File contents:");
    console.log(data);
  });
});
