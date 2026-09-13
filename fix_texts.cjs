const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(/t\("home_area_1_title", ".*?"\)/g, 't("home_area_1_title", "")');
content = content.replace(/t\("home_area_1_desc", ".*?"\)/g, 't("home_area_1_desc", "")');

content = content.replace(/t\("home_area_2_title", ".*?"\)/g, 't("home_area_2_title", "")');
content = content.replace(/t\("home_area_2_desc", ".*?"\)/g, 't("home_area_2_desc", "")');

content = content.replace(/t\("home_area_3_title", ".*?"\)/g, 't("home_area_3_title", "")');
content = content.replace(/t\("home_area_3_desc", ".*?"\)/g, 't("home_area_3_desc", "")');

content = content.replace(/t\("home_area_4_title", ".*?"\)/g, 't("home_area_4_title", "")');
content = content.replace(/t\("home_area_4_desc", ".*?"\)/g, 't("home_area_4_desc", "")');

content = content.replace(/t\("home_area_5_title", ".*?"\)/g, 't("home_area_5_title", "")');
content = content.replace(/t\("home_area_5_desc", ".*?"\)/g, 't("home_area_5_desc", "")');

fs.writeFileSync('src/pages/Home.tsx', content);
