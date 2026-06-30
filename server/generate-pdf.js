const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: 'FarmGuard - User Guide', Author: 'FarmGuard Team' } });
const output = fs.createWriteStream('FarmGuard-User-Guide.pdf');
doc.pipe(output);

// Colors
const TEAL = '#0d9488';
const DARK = '#1f2937';
const GRAY = '#6b7280';
const WHITE = '#ffffff';
const LIGHT_BG = '#f0fdfa';
const RED = '#dc2626';
const YELLOW = '#ca8a04';
const GREEN = '#16a34a';

// Helper functions
function heading(text, size = 24) {
  doc.fontSize(size).fillColor(TEAL).font('Helvetica-Bold').text(text);
  doc.moveDown(0.3);
}

function subheading(text, size = 16) {
  doc.fontSize(size).fillColor(DARK).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
}

function body(text) {
  doc.fontSize(11).fillColor(DARK).font('Helvetica').text(text, { lineGap: 4 });
  doc.moveDown(0.3);
}

function bullet(text, indent = 70) {
  doc.fontSize(11).fillColor(DARK).font('Helvetica').text('  ' + text, indent, doc.y, { lineGap: 3 });
  doc.moveDown(0.1);
}

function divider() {
  doc.moveDown(0.5);
  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.5);
}

function newPage() {
  doc.addPage();
}

function coloredBox(text, color = TEAL) {
  const y = doc.y;
  doc.rect(50, y, 495, 28).fill(color);
  doc.fontSize(13).fillColor(WHITE).font('Helvetica-Bold').text(text, 60, y + 7);
  doc.y = y + 36;
}

// ========================
// COVER PAGE
// ========================
doc.rect(0, 0, 595, 842).fill('#f0fdfa');

// Top bar
doc.rect(0, 0, 595, 8).fill(TEAL);

// Shield icon placeholder
doc.fontSize(60).fillColor(TEAL).font('Helvetica-Bold').text('FARMGUARD', 50, 180, { align: 'center', width: 495 });
doc.moveDown(0.3);
doc.fontSize(16).fillColor(GRAY).font('Helvetica').text('Digital Farm Management Portal', { align: 'center', width: 495 });
doc.moveDown(0.2);
doc.fontSize(13).fillColor(GRAY).text('for Monitoring Antimicrobial Usage (AMU) and Maximum Residue Limits (MRL)', { align: 'center', width: 495 });
doc.moveDown(0.2);
doc.fontSize(13).fillColor(GRAY).text('in Livestock', { align: 'center', width: 495 });

doc.moveDown(3);

// Feature highlights box
doc.roundedRect(100, doc.y, 395, 160, 10).fill(WHITE);
const boxY = doc.y + 15;
doc.fontSize(14).fillColor(TEAL).font('Helvetica-Bold').text('Key Features', 120, boxY);
doc.fontSize(11).fillColor(DARK).font('Helvetica')
  .text('  Track Antimicrobial Usage across all livestock', 120, boxY + 25)
  .text('  Automatic Withdrawal Period & MRL Calculations', 120, boxY + 42)
  .text('  Real-time Farm Risk Scoring (Green / Yellow / Red)', 120, boxY + 59)
  .text('  Role-based Dashboards for Farmers, Vets & Officials', 120, boxY + 76)
  .text('  India District Resistance Radar Heatmap', 120, boxY + 93)
  .text('  Multi-language & Voice Input Support', 120, boxY + 110);

doc.moveDown(6);
doc.fontSize(11).fillColor(GRAY).font('Helvetica').text('Version 1.0  |  June 2026', { align: 'center', width: 495 });

// ========================
// TABLE OF CONTENTS
// ========================
newPage();
heading('Table of Contents');
doc.moveDown(0.5);

const toc = [
  ['1.', 'What is FarmGuard?', '3'],
  ['2.', 'How to Start the Application', '4'],
  ['3.', 'Login & Demo Accounts', '5'],
  ['4.', 'Farmer Role - Complete Guide', '6'],
  ['5.', 'Veterinarian Role - Complete Guide', '9'],
  ['6.', 'Government Official (Admin) Role', '11'],
  ['7.', 'Understanding Risk Scores', '14'],
  ['8.', 'Drug Database & MRL Compliance', '15'],
  ['9.', 'Special Features', '16'],
  ['10.', 'API Reference', '17'],
  ['11.', 'Troubleshooting', '18'],
];

toc.forEach(([num, title, page]) => {
  doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text(num + '  ', 70, doc.y, { continued: true });
  doc.font('Helvetica').text(title);
  doc.moveDown(0.3);
});

// ========================
// SECTION 1 - WHAT IS FARMGUARD
// ========================
newPage();
heading('1. What is FarmGuard?');

body('FarmGuard is a comprehensive digital farm management portal designed to monitor and regulate the use of antimicrobials (antibiotics, antifungals, antiparasitics) in livestock across India.');
doc.moveDown(0.3);

subheading('Why FarmGuard?');
body('Antimicrobial Resistance (AMR) is one of the top 10 global public health threats according to the WHO. When farmers use antibiotics incorrectly - wrong dose, wrong drug, or selling animal products before the withdrawal period ends - it leads to:');
bullet('Drug-resistant bacteria entering the food chain');
bullet('Maximum Residue Limit (MRL) violations in meat, milk, and eggs');
bullet('Reduced effectiveness of antibiotics for human medicine');

doc.moveDown(0.3);
subheading('What FarmGuard Solves');
bullet('Tracks every antimicrobial treatment given to livestock');
bullet('Automatically calculates safe withdrawal periods (when meat/milk is safe to sell)');
bullet('Scores each farm with a risk level: GREEN (safe), YELLOW (caution), RED (high risk)');
bullet('Alerts farmers and officials about MRL violations and unsafe practices');
bullet('Provides analytics and heatmaps for government oversight');

// ========================
// SECTION 2 - HOW TO START
// ========================
newPage();
heading('2. How to Start the Application');

subheading('Prerequisites');
bullet('Node.js v18 or higher installed');
bullet('MySQL 8.x installed and running');
bullet('A terminal / command prompt');

doc.moveDown(0.3);
subheading('Step 1: Start the Backend Server');
body('Open a terminal and navigate to the server folder:');
doc.fontSize(10).fillColor(TEAL).font('Courier').text('  cd farmguard/server');
doc.fontSize(10).fillColor(TEAL).font('Courier').text('  npm run dev');
body('You should see: "Server running on port 5000" and "Database connected successfully."');

doc.moveDown(0.3);
subheading('Step 2: Start the Frontend');
body('Open a second terminal and navigate to the client folder:');
doc.fontSize(10).fillColor(TEAL).font('Courier').text('  cd farmguard/client');
doc.fontSize(10).fillColor(TEAL).font('Courier').text('  npm run dev');
body('You should see: "Local: http://localhost:5173"');

doc.moveDown(0.3);
subheading('Step 3: Open in Browser');
body('Open your browser and go to: http://localhost:5173');
body('The FarmGuard login page will appear with demo account buttons for quick access.');

// ========================
// SECTION 3 - LOGIN & DEMO ACCOUNTS
// ========================
newPage();
heading('3. Login & Demo Accounts');

body('FarmGuard has three user roles, each with a different dashboard and permissions. Pre-seeded demo accounts are available for testing:');
doc.moveDown(0.3);

coloredBox('Demo Account Credentials');

doc.moveDown(0.3);

// Farmer account
subheading('Farmer Account');
doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('Email: ', 70, doc.y, { continued: true });
doc.font('Courier').text('harpreet@farmguard.demo');
doc.fontSize(11).font('Helvetica-Bold').text('Password: ', 70, doc.y, { continued: true });
doc.font('Courier').text('Feb@2008');
doc.fontSize(11).font('Helvetica').text('Role: Farmer - Can manage farms, animals, and log treatments');
doc.moveDown(0.3);

// Vet account
subheading('Veterinarian Account');
doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('Email: ', 70, doc.y, { continued: true });
doc.font('Courier').text('amarjeet@farmguard.demo');
doc.fontSize(11).font('Helvetica-Bold').text('Password: ', 70, doc.y, { continued: true });
doc.font('Courier').text('Feb@2008');
doc.fontSize(11).font('Helvetica').text('Role: Vet - Can view farms and issue prescriptions');
doc.moveDown(0.3);

// Admin account
subheading('Government Official Account');
doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text('Email: ', 70, doc.y, { continued: true });
doc.font('Courier').text('admin@farmguard.demo');
doc.fontSize(11).font('Helvetica-Bold').text('Password: ', 70, doc.y, { continued: true });
doc.font('Courier').text('Feb@2008');
doc.fontSize(11).font('Helvetica').text('Role: Admin - Full system oversight, analytics, and risk management');

doc.moveDown(0.5);
body('Tip: On the login page, click any demo account button to auto-fill the email and password fields.');

// ========================
// SECTION 4 - FARMER ROLE
// ========================
newPage();
heading('4. Farmer Role - Complete Guide');
body('The farmer is the primary user of FarmGuard. After logging in as a farmer, you have access to the following pages:');
doc.moveDown(0.3);

coloredBox('4.1 Farmer Dashboard');
doc.moveDown(0.3);
body('The dashboard is your home screen. It shows four summary cards at the top:');
bullet('Total Animals - Count of all animals registered under your farms');
bullet('Active Treatments - Number of ongoing antimicrobial treatments');
bullet('Unread Alerts - System warnings requiring your attention');
bullet('Next Safe Sale Date - Earliest date you can safely sell animal products');
doc.moveDown(0.2);
body('Below the cards, you see:');
bullet('Farm Health Summary - Recent alerts with timestamps');
bullet('Quick Actions - Buttons to Log Treatment, Add Animal, or View Farms');
bullet('Risk Insights - Tips on keeping your farm compliant');

doc.moveDown(0.3);
coloredBox('4.2 My Farms (/farmer/farms)');
doc.moveDown(0.3);
body('This page lists all farms registered under your account. Each farm card shows:');
bullet('Farm name and location');
bullet('Current risk score with color badge (GREEN / YELLOW / RED)');
bullet('Number of animals on the farm');
doc.moveDown(0.2);
body('You can add a new farm by clicking the "Add Farm" button. Required fields: farm name, location/district, and state.');

doc.moveDown(0.3);
coloredBox('4.3 Farm Detail (/farmer/farms/:id)');
doc.moveDown(0.3);
body('Clicking a farm opens its detail page showing:');
bullet('Farm information (name, location, owner)');
bullet('Current risk score and risk breakdown');
bullet('List of all animals on this farm');
bullet('Recent treatment history for this farm');
bullet('Any active alerts related to this farm');

newPage();
coloredBox('4.4 My Animals (/farmer/animals)');
doc.moveDown(0.3);
body('Lists all animals across all your farms. Each entry shows:');
bullet('Tag number (unique animal identifier)');
bullet('Species (cattle, poultry, goat, sheep, swine, buffalo)');
bullet('Weight in kg');
bullet('Farm name where the animal is located');
doc.moveDown(0.2);
body('Use the "Add Animal" button to register a new animal. Fields: tag number, species, breed, weight, date of birth, and farm assignment.');

doc.moveDown(0.3);
coloredBox('4.5 Animal Detail (/farmer/animals/:id)');
doc.moveDown(0.3);
body('The animal detail page provides a complete history:');
bullet('Animal profile (tag, species, breed, weight, age)');
bullet('QR Code - scannable code for quick animal identification');
bullet('Full treatment history - every antimicrobial treatment ever given');
bullet('Withdrawal countdown - days remaining before products are safe to sell');
bullet('Current status - whether the animal is in treatment or cleared');

doc.moveDown(0.3);
coloredBox('4.6 Log Treatment (/farmer/log-treatment)');
doc.moveDown(0.3);
body('This is the core feature. When a farmer administers an antimicrobial to an animal, they log it here. The form requires:');
bullet('Animal - Select from your registered animals');
bullet('Drug - Select from the 50-drug master database');
bullet('Dosage and unit (e.g., 500 mg)');
bullet('Frequency (e.g., "2 times daily")');
bullet('Duration in days');
bullet('Treatment start date');
bullet('Vet name/ID - The prescribing veterinarian');
bullet('Reason for treatment (optional)');
bullet('Additional notes (optional)');
doc.moveDown(0.2);
body('After saving, the system automatically:');
bullet('Calculates the withdrawal period based on the drug and animal species');
bullet('Sets the safe sale date (when meat/milk/eggs are safe for consumption)');
bullet('Updates the farm risk score');
bullet('Generates alerts if MRL limits are at risk');

newPage();
coloredBox('4.7 My Alerts (/farmer/alerts)');
doc.moveDown(0.3);
body('Shows all system-generated alerts for your farms. Alert types include:');
bullet('MRL Violation Warning - A treatment may exceed safe residue limits');
bullet('Withdrawal Period Alert - Animal products are not yet safe to sell');
bullet('Risk Score Change - Farm moved from one risk level to another');
bullet('Overdose Detection - Dosage exceeds recommended limits');
body('Each alert shows: title, message, farm name, date/time, and read/unread status.');

// ========================
// SECTION 5 - VET ROLE
// ========================
newPage();
heading('5. Veterinarian Role - Complete Guide');
body('Veterinarians have a focused interface for managing prescriptions and monitoring assigned farms.');
doc.moveDown(0.3);

coloredBox('5.1 Vet Dashboard (/vet/dashboard)');
doc.moveDown(0.3);
body('The vet dashboard shows three summary cards:');
bullet('Total Farms - All farms in the system (or assigned to this vet)');
bullet('Total Animals - All registered animals across farms');
bullet('My Prescriptions - Treatments prescribed by this vet');
doc.moveDown(0.2);
body('Below the cards: Quick action buttons to create new prescriptions or view assigned farms, and a list of recent prescriptions with edit/delete options.');

doc.moveDown(0.3);
coloredBox('5.2 Assigned Farms (/vet/farms)');
doc.moveDown(0.3);
body('Browse all farms with their risk status. Each farm card shows:');
bullet('Farm name and location');
bullet('Risk score badge');
bullet('Number of animals');
body('Click a farm to see its animals and treatment history. This helps vets make informed prescribing decisions.');

doc.moveDown(0.3);
coloredBox('5.3 Issue Prescription (/vet/prescribe)');
doc.moveDown(0.3);
body('The prescription form is similar to the farmer treatment log but is issued from the vet perspective:');
bullet('Select farm and animal');
bullet('Choose drug from the master list');
bullet('Enter dosage, frequency, and duration');
bullet('Add clinical notes and diagnosis');
doc.moveDown(0.2);
body('After submission, the prescription appears in the farmers treatment history. Vets can also edit or delete their own prescriptions.');
doc.moveDown(0.2);
body('PDF Export: Click the "Download PDF" button to generate a printable prescription document with farm details, drug information, dosage instructions, and a signature line.');

// ========================
// SECTION 6 - ADMIN ROLE
// ========================
newPage();
heading('6. Government Official (Admin) Role');
body('The admin dashboard provides system-wide oversight for government officials monitoring antimicrobial usage across all registered farms.');
doc.moveDown(0.3);

coloredBox('6.1 Admin Dashboard (/admin/dashboard)');
doc.moveDown(0.3);
body('The admin dashboard is the control center. It shows:');
bullet('High Risk Alert Banner - If any RED farms exist, a prominent alert appears at the top');
bullet('Four stat cards: Total Farms, Red Farms, Yellow Farms, Green Farms');
bullet('Recent Alerts - Latest system-wide alerts');
bullet('High Risk Farms - List of farms with risk score >= 70');
bullet('Quick navigation to: Farm Risk List, Analytics, Resistance Radar, Audit Log');

doc.moveDown(0.3);
coloredBox('6.2 Farm Risk List (/admin/farms)');
doc.moveDown(0.3);
body('A comprehensive table of all farms sorted by risk score (highest first). Each row shows:');
bullet('Farm name and owner');
bullet('Location (district, state)');
bullet('Risk score with color badge');
bullet('Number of animals');
bullet('Number of active treatments');
body('Click any farm to drill down into its details.');

doc.moveDown(0.3);
coloredBox('6.3 Farm Drilldown (/admin/farms/:id)');
doc.moveDown(0.3);
body('Deep dive into a specific farm showing:');
bullet('Farm profile and owner information');
bullet('Risk score breakdown (what factors contributed to the score)');
bullet('Complete animal list with individual treatment histories');
bullet('All AMU logs for this farm');
bullet('Active and resolved alerts');
bullet('Timeline of risk score changes');

newPage();
coloredBox('6.4 Analytics (/admin/analytics)');
doc.moveDown(0.3);
body('Data visualization dashboard with three charts:');
bullet('Treatment Trends - Line chart showing AMU treatments over time (monthly)');
bullet('Risk Distribution - Pie chart showing Red/Yellow/Green farm proportions');
bullet('Top Drugs Used - Bar chart showing the most frequently used antimicrobials');
body('These charts help officials identify patterns, hotspots, and trends in antimicrobial usage.');

doc.moveDown(0.3);
coloredBox('6.5 Resistance Radar (/admin/resistance-map)');
doc.moveDown(0.3);
body('An interactive India map showing all administrative districts. Features:');
bullet('Leaflet-powered map centered on India');
bullet('All districts rendered from open-source GeoJSON data');
bullet('Click any district to see its name');
bullet('Color coding will reflect AMU resistance patterns when real data is integrated');
body('This visualization helps geographic targeting of interventions.');

doc.moveDown(0.3);
coloredBox('6.6 Audit Log (/admin/audit-log)');
doc.moveDown(0.3);
body('A chronological record of all actions taken in the system:');
bullet('User registrations and logins');
bullet('Treatment logs created');
bullet('Alerts generated and acknowledged');
bullet('Risk score changes');
body('Useful for compliance auditing and investigating specific incidents.');

// ========================
// SECTION 7 - RISK SCORES
// ========================
newPage();
heading('7. Understanding Risk Scores');
body('Every farm in FarmGuard has a risk score from 0 to 100. The score is automatically calculated by the Risk Engine based on four factors:');
doc.moveDown(0.3);

coloredBox('Risk Score Calculation');
doc.moveDown(0.3);

subheading('Factor 1: Treatment Frequency (max 25 points)');
body('Based on the number of antimicrobial treatments in the last 30 days:');
bullet('1-3 treatments: 5 points');
bullet('4-6 treatments: 12 points');
bullet('7-9 treatments: 18 points');
bullet('10+ treatments: 25 points');
doc.moveDown(0.2);

subheading('Factor 2: Overdose Detection (max 25 points)');
body('Each instance where dosage exceeds the recommended amount:');
bullet('8 points per overdose instance');
doc.moveDown(0.2);

subheading('Factor 3: MRL Violations (max 30 points)');
body('Confirmed violations of Maximum Residue Limits:');
bullet('15 points per confirmed violation');
doc.moveDown(0.2);

subheading('Factor 4: Critical Antibiotic Use (max 20 points)');
body('Usage of WHO-categorized critically important antimicrobials:');
bullet('5 points per usage of critical antibiotics');
doc.moveDown(0.3);

coloredBox('Risk Level Thresholds');
doc.moveDown(0.3);

// Green
doc.rect(70, doc.y, 15, 15).fill(GREEN);
doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('  GREEN (0-30): Low Risk', 90, doc.y + 2);
body('  The farm is following good antimicrobial practices. No action needed.');
doc.moveDown(0.2);

// Yellow
doc.rect(70, doc.y, 15, 15).fill(YELLOW);
doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('  YELLOW (31-69): Medium Risk', 90, doc.y + 2);
body('  The farm has some concerns. Monitoring and advisory recommended.');
doc.moveDown(0.2);

// Red
doc.rect(70, doc.y, 15, 15).fill(RED);
doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text('  RED (70-100): High Risk', 90, doc.y + 2);
body('  Immediate intervention required. The farm may have MRL violations or excessive antibiotic use.');

// ========================
// SECTION 8 - DRUG DATABASE
// ========================
newPage();
heading('8. Drug Database & MRL Compliance');

body('FarmGuard includes a master database of 50 veterinary antimicrobial drugs. Each drug entry contains:');
doc.moveDown(0.3);
bullet('Drug name and active ingredient');
bullet('Drug category (antibiotic, antifungal, antiparasitic, etc.)');
bullet('WHO classification (critically important, highly important, important)');
bullet('Maximum Residue Limit (MRL) for different species:');
bullet('    - Cattle: mg/kg in muscle, liver, kidney, milk', 90);
bullet('    - Poultry: mg/kg in muscle, liver, kidney, eggs', 90);
bullet('    - Swine: mg/kg in muscle, liver, kidney', 90);
bullet('Withdrawal period in days for each species and product type');
bullet('Recommended dosage range');
bullet('Contraindications and warnings');

doc.moveDown(0.3);
subheading('What is MRL?');
body('Maximum Residue Limit (MRL) is the highest level of a drug residue that is legally permitted in food products (meat, milk, eggs). If a farmer sells animal products before the withdrawal period ends, the drug residues may exceed the MRL, making the food unsafe for human consumption.');

doc.moveDown(0.3);
subheading('Withdrawal Period');
body('The withdrawal period is the minimum number of days that must pass after the last drug dose before the animal products can be safely sold. FarmGuard automatically calculates this based on:');
bullet('The specific drug used');
bullet('The animal species');
bullet('The product type (meat, milk, or eggs)');

// ========================
// SECTION 9 - SPECIAL FEATURES
// ========================
newPage();
heading('9. Special Features');

coloredBox('9.1 Multi-Language Support');
doc.moveDown(0.3);
body('FarmGuard supports 11 Indian languages:');
bullet('English, Hindi, Punjabi, Tamil, Telugu, Bengali');
bullet('Marathi, Kannada, Malayalam, Gujarati, Odia');
body('Use the language selector in the navbar to switch languages. All labels, buttons, and messages are translated.');

doc.moveDown(0.3);
coloredBox('9.2 Voice Input');
doc.moveDown(0.3);
body('For farmers who may not be comfortable typing, FarmGuard supports voice input:');
bullet('Click the microphone button on any text field');
bullet('Speak in your preferred language');
bullet('The speech is converted to text automatically');
body('This is especially useful for logging treatment notes and reasons in the field.');

doc.moveDown(0.3);
coloredBox('9.3 QR Code Animal Identification');
doc.moveDown(0.3);
body('Each animal gets a unique QR code that can be printed and attached to the animal or stall:');
bullet('Scan the QR code with any phone camera');
bullet('Instantly view the animal profile and treatment history');
bullet('Quick access to withdrawal countdown');

doc.moveDown(0.3);
coloredBox('9.4 Drug Interaction Warnings');
doc.moveDown(0.3);
body('When logging a treatment, if the selected drug has known interactions with other drugs the animal is currently receiving, the system shows a warning. This prevents dangerous drug combinations.');

doc.moveDown(0.3);
coloredBox('9.5 Weather & Disease Alerts');
doc.moveDown(0.3);
body('FarmGuard integrates weather data to provide disease risk alerts based on weather conditions in your district (e.g., high humidity increases risk of respiratory infections in poultry).');

// ========================
// SECTION 10 - API REFERENCE
// ========================
newPage();
heading('10. API Reference');
body('The FarmGuard backend exposes a RESTful API on port 5000. All endpoints require JWT authentication except login and register.');
doc.moveDown(0.3);

coloredBox('Authentication Endpoints');
doc.moveDown(0.3);
doc.fontSize(10).font('Courier').fillColor(TEAL)
  .text('POST   /api/auth/register     - Create new account')
  .text('POST   /api/auth/login        - Login, returns JWT token')
  .text('GET    /api/auth/me           - Get current user profile');

doc.moveDown(0.3);
coloredBox('Farm & Animal Endpoints');
doc.moveDown(0.3);
doc.fontSize(10).font('Courier').fillColor(TEAL)
  .text('GET    /api/farms             - List all farms')
  .text('POST   /api/farms             - Create a new farm')
  .text('GET    /api/farms/:id         - Get farm details')
  .text('PUT    /api/farms/:id         - Update farm')
  .text('DELETE /api/farms/:id         - Delete farm')
  .text('GET    /api/animals           - List all animals')
  .text('POST   /api/animals           - Register new animal')
  .text('GET    /api/animals/:id       - Get animal details')
  .text('PUT    /api/animals/:id       - Update animal')
  .text('DELETE /api/animals/:id       - Delete animal');

doc.moveDown(0.3);
coloredBox('AMU & Drug Endpoints');
doc.moveDown(0.3);
doc.fontSize(10).font('Courier').fillColor(TEAL)
  .text('GET    /api/amu               - List AMU logs')
  .text('POST   /api/amu               - Log a new treatment')
  .text('PUT    /api/amu/:id           - Update treatment')
  .text('DELETE /api/amu/:id           - Delete treatment')
  .text('GET    /api/drugs             - List all drugs')
  .text('GET    /api/drugs/:id         - Get drug details');

doc.moveDown(0.3);
coloredBox('Analytics & Risk Endpoints');
doc.moveDown(0.3);
doc.fontSize(10).font('Courier').fillColor(TEAL)
  .text('GET    /api/risk/summary       - Risk score summary')
  .text('GET    /api/risk/list          - All farms with risk scores')
  .text('GET    /api/analytics/summary  - Dashboard analytics')
  .text('GET    /api/analytics/drug-usage - Drug usage statistics')
  .text('GET    /api/analytics/amu-trend  - AMU trend data')
  .text('GET    /api/alerts             - List alerts');

// ========================
// SECTION 11 - TROUBLESHOOTING
// ========================
newPage();
heading('11. Troubleshooting');

subheading('Server won\'t start');
bullet('Check that MySQL is running: mysql --version');
bullet('Verify .env credentials match your MySQL setup');
bullet('Ensure port 5000 is not in use by another process');
bullet('Run: cd server && npm install (reinstall dependencies)');

doc.moveDown(0.3);
subheading('Frontend shows blank page');
bullet('Check that the server is running on port 5000');
bullet('Clear browser cache and refresh');
bullet('Check browser console (F12) for errors');
bullet('Run: cd client && npm install && npm run dev');

doc.moveDown(0.3);
subheading('Login fails with "Invalid credentials"');
bullet('Make sure you are using the correct demo account email');
bullet('Password is case-sensitive: Feb@2008');
bullet('Check server terminal for error messages');

doc.moveDown(0.3);
subheading('Charts or maps not loading');
bullet('Analytics charts require AMU log data - ensure seeders have been run');
bullet('Resistance Map loads GeoJSON from GitHub - requires internet connection');
bullet('Check browser console for network errors');

doc.moveDown(0.3);
subheading('Risk scores not updating');
bullet('Risk scores update when new treatments are logged');
bullet('A daily cron job also recalculates all scores at midnight');
bullet('Manually trigger: POST /api/risk/recalculate (admin only)');

doc.moveDown(1);

// Footer on last page
divider();
doc.fontSize(10).fillColor(GRAY).font('Helvetica')
  .text('FarmGuard v1.0 | Built for livestock antimicrobial monitoring in India', { align: 'center', width: 495 })
  .text('For support, contact the development team', { align: 'center', width: 495 });

doc.end();

output.on('finish', () => {
  console.log('PDF generated: FarmGuard-User-Guide.pdf');
});
