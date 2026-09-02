const fs = require('fs');

let rimg = fs.readFileSync('src/components/ResponsiveImage.tsx', 'utf8');
rimg = rimg.replace('onClick?: (e: React.MouseEvent) => void;', 'onClick?: (e: any) => void;');
fs.writeFileSync('src/components/ResponsiveImage.tsx', rimg);

let pdetail = fs.readFileSync('src/pages/ProjectDetail.tsx', 'utf8');
pdetail = pdetail.replace('handlePrevImage = (e: React.MouseEvent)', 'handlePrevImage = (e: any)');
pdetail = pdetail.replace('handleNextImage = (e: React.MouseEvent)', 'handleNextImage = (e: any)');
fs.writeFileSync('src/pages/ProjectDetail.tsx', pdetail);

