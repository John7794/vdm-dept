const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// The bad section starts at:
//   return () => clearInterval(timer);
//   }, []);
// and ends right before:
//   return (
//     <div className="flex flex-col w-full bg-page-bg">

const badStrStart = "  return () => clearInterval(timer);\n  }, []);";
const searchFor = "  return (\n    <div className=\"flex flex-col w-full bg-page-bg\">";

const startIdx = content.indexOf(badStrStart);
const endIdx = content.indexOf(searchFor);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Fixed!");
} else {
  console.log("Could not find blocks");
  console.log("startIdx:", startIdx);
  console.log("endIdx:", endIdx);
}
