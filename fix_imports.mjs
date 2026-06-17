import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src');

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

// Define exactly what to replace based on file location
allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  const inPages = file.includes('\\pages\\') || file.includes('/pages/');
  const inComponents = file.includes('\\components\\') || file.includes('/components/');

  const mapOldToNewRootPath = {
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

  // For App.jsx specifically
  if (file.endsWith('App.jsx') || file.endsWith('main.jsx')) {
    Object.keys(mapOldToNewRootPath).forEach(oldFile => {
      const newTarget = mapOldToNewRootPath[oldFile];
      const regex = new RegExp(`(['"])\\.\\/${oldFile}(['"])`, 'g');
      content = content.replace(regex, `$1./${newTarget}$2`);
    });
  } else if (inPages || inComponents) {
    // String replacements for common broken paths in files that moved from root to subfolders:
    // These files were mostly in root, so their imports started with './'
    Object.keys(mapOldToNewRootPath).forEach(oldFile => {
       const newTarget = mapOldToNewRootPath[oldFile]; // e.g. components/About.jsx
       const regex = new RegExp(`(['"])\\.\\/${oldFile}(['"])`, 'g');
       content = content.replace(regex, `$1../${newTarget}$2`);
    });
    
    // Fix imports that were `./components/...` to `../components/...`
    content = content.replace(/(['"])\.\/components\//g, `$1../components/`);
    content = content.replace(/(['"])\.\/pages\//g, `$1../pages/`);
    content = content.replace(/(['"])\.\/data\//g, `$1../data/`);
    content = content.replace(/(['"])\.\/utils\//g, `$1../utils/`);
    content = content.replace(/(['"])\.\/navbar\//g, `$1../navbar/`);
    content = content.replace(/(['"])\.\/context\//g, `$1../context/`);
    content = content.replace(/(['"])\.\/services\//g, `$1../services/`);
    
    // Then we have some css files
    content = content.replace(/(['"])\.\/output\.css(['"])/g, `$1../output.css$2`);
    content = content.replace(/(['"])\.\/input\.css(['"])/g, `$1../input.css$2`);
    content = content.replace(/(['"])\.\/destination\.css(['"])/g, `$1../destination.css$2`);
  }

  // Then for files that ALREADY had `../` because they were in subfolders, they might have pointed to `../About.jsx`
  Object.keys(mapOldToNewRootPath).forEach(oldFile => {
    const newTarget = mapOldToNewRootPath[oldFile]; // e.g. components/About.jsx
    const regex = new RegExp(`(['"])\\.\\.\\/${oldFile}(['"])`, 'g');
    // It depends on depth, but mostly it's just 1 level. So `../About.jsx` becomes `../components/About.jsx`
    content = content.replace(regex, `$1../${newTarget}$2`);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Fixed imports in ${path.relative(srcDir, file)}`);
  }
});
