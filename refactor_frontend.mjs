import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src');

const moves = {
  'Signup.jsx': 'pages/SignupPage.jsx',
  'Login.jsx': 'pages/LoginPage.jsx',
  'AttractionDetail.jsx': 'pages/AttractionDetailPage.jsx',
  'BookingCheckout.jsx': 'pages/BookingCheckoutPage.jsx',
  'MyBookings.jsx': 'pages/MyBookingsPage.jsx',
  'SearchResults.jsx': 'pages/SearchResultsPage.jsx',
  'Dashboard.jsx': 'pages/DashboardPage.jsx',
  'Settings.jsx': 'pages/SettingsPage.jsx',
  'Destination.jsx': 'pages/DestinationPage.jsx',
  'NotFound.jsx': 'pages/NotFoundPage.jsx',
  'Home.jsx': 'pages/HomePage.jsx',

  'Footer.jsx': 'components/Footer.jsx',
  'Hero.jsx': 'components/Hero.jsx',
  'About.jsx': 'components/About.jsx',
  'Accomodation.jsx': 'components/Accomodation.jsx',
  'Testimonials.jsx': 'components/Testimonials.jsx',
  'Contact.jsx': 'components/Contact.jsx',
  'DestinationCard.jsx': 'components/DestinationCard.jsx',

  'destinationData.js': 'data/destinationData.js',
  'images.js': 'data/images.js',
  'AxiosInstance.jsx': 'utils/axiosInstance.js'
};

const toDelete = [
  'SignupNew.jsx',
  'AppNew.jsx'
];

// Move files
Object.entries(moves).forEach(([oldFile, newRelPath]) => {
  const oldPath = path.join(srcDir, oldFile);
  const newPath = path.join(srcDir, newRelPath);
  
  if (fs.existsSync(oldPath)) {
    const newDir = path.dirname(newPath);
    if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
    
    let content = fs.readFileSync(oldPath, 'utf8');
    fs.writeFileSync(newPath, content);
    fs.unlinkSync(oldPath);
    console.log(`Moved ${oldFile} -> ${newRelPath}`);
  }
});

// Delete files
toDelete.forEach(file => {
  const p = path.join(srcDir, file);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Deleted ${file}`);
  }
});

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const originalContent = content;
  const fileDir = path.dirname(file);
  
  Object.entries(moves).forEach(([oldFile, newRelPath]) => {
    const absOldTarget = path.join(srcDir, oldFile);
    const absNewTarget = path.join(srcDir, newRelPath);
    
    let newImportPath = path.relative(fileDir, absNewTarget).replace(/\\/g, '/');
    if (!newImportPath.startsWith('.')) {
      newImportPath = './' + newImportPath;
    }
    
    // We match any import that ends with oldFile (with or without extension)
    const importRegex = /((?:from|import\(?)\s*['"])([^'"]+)(['"])/g;
    content = content.replace(importRegex, (match, p1, p2, p3) => {
      const resolvedPath = path.resolve(fileDir, p2);
      let targetPath = resolvedPath;
      if (!targetPath.endsWith('.js') && !targetPath.endsWith('.jsx')) {
         if (fs.existsSync(resolvedPath + '.jsx')) targetPath += '.jsx';
         else if (fs.existsSync(resolvedPath + '.js')) targetPath += '.js';
      }
      
      // Special case if they matched
      if (path.normalize(targetPath) === path.normalize(path.resolve(absOldTarget))) {
         return `${p1}${newImportPath}${p3}`;
      }
      // If fs.existsSync fails because file is already moved, check if resolvedPath matches oldPath exactly
      if (path.normalize(resolvedPath) === path.normalize(absOldTarget) || 
          path.normalize(resolvedPath + '.jsx') === path.normalize(absOldTarget) || 
          path.normalize(resolvedPath + '.js') === path.normalize(absOldTarget)) {
         return `${p1}${newImportPath}${p3}`;
      }
      
      return match;
    });
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated imports in ${path.relative(srcDir, file)}`);
  }
});
