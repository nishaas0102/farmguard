const fs = require('fs');

const en = {
  app_name: "FarmGuard", dashboard: "Dashboard", farms: "Farms", animals: "Animals", alerts: "Alerts", analytics: "Analytics",
  login: "Login", register: "Register", email: "Email", password: "Password", sign_in: "Sign In", sign_out: "Sign Out",
  welcome: "Welcome back", sign_in_continue: "Sign in to your account to continue", no_account: "Don't have an account?", create_one: "Create one", demo_accounts: "Demo Accounts",
  total_animals: "Total Animals", active_treatments: "Active Treatments", unread_alerts: "Unread Alerts", next_safe_sale: "Next Safe Sale",
  log_treatment: "Log Treatment", add_animal: "Add Animal", add_farm: "Add Farm", view_farms: "View Farms",
  farm_health_summary: "Farm Health Summary", quick_actions: "Quick Actions", risk_insights: "Risk Insights",
  no_alerts: "No recent alerts.", no_high_risk: "No high-risk farms. Great!",
  my_farms: "My Farms", my_animals: "My Animals", my_alerts: "My Alerts", all_animals: "All Animals",
  assigned_farms: "Assigned Farms", prescriptions: "Prescriptions", issue_prescription: "Issue Prescription", export_pdf: "Export PDF",
  total_farms: "Total Farms", total_prescriptions: "My Prescriptions", new_prescription: "New Prescription",
  recent_prescriptions: "Recent Prescriptions", no_prescriptions: "No prescriptions created yet.", create_first_prescription: "Create your first prescription",
  farm_risk_list: "Farm Risk List", resistance_radar: "Resistance Radar", audit_log: "Audit Log",
  system_overview: "System Overview", government_control_center: "Government Control Center",
  recent_alerts: "Recent Alerts", high_risk_farms: "High Risk Farms", high_risk: "HIGH RISK", medium_risk: "MEDIUM RISK", low_risk: "LOW RISK",
  voice_input: "Voice Input", listening: "Listening...", speak_now: "Speak now",
  safe_for_sale: "SAFE FOR SALE", days_remaining: "days remaining", withdrawal_active: "Withdrawal active - Do NOT sell",
  dangerous: "DANGEROUS", caution: "CAUTION", safe: "SAFE", no_interactions: "No known interactions detected",
  scan_qr: "Scan Animal QR Code", search: "Search", download: "Download", print: "Print", loading: "Loading...",
  treatment_trends: "Treatment Trends", risk_distribution: "Risk Distribution", top_drugs_used: "Top Drugs Used",
  weather_alerts: "Weather Alerts", synced: "Synced", no_internet: "No Internet", offline_mode: "Offline Mode"
};

const hi = {
  app_name: "FarmGuard", dashboard: "\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921", farms: "\u092b\u093e\u0930\u094d\u092e", animals: "\u092a\u0936\u0941", alerts: "\u0905\u0932\u0930\u094d\u091f", analytics: "\u0935\u093f\u0936\u094d\u0932\u0947\u0937\u0923",
  login: "\u0932\u0949\u0917\u093f\u0928", register: "\u0930\u091c\u093f\u0938\u094d\u091f\u0930", email: "\u0908\u092e\u0947\u0932", password: "\u092a\u093e\u0938\u0935\u0930\u094d\u0921", sign_in: "\u0938\u093e\u0907\u0928 \u0907\u0928", sign_out: "\u0938\u093e\u0907\u0928 \u0906\u0909\u091f",
  welcome: "\u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948", sign_in_continue: "\u0905\u092a\u0928\u0947 \u0916\u093e\u0924\u0947 \u092e\u0947\u0902 \u0938\u093e\u0907\u0928 \u0907\u0928 \u0915\u0930\u0947\u0902", no_account: "\u0916\u093e\u0924\u093e \u0928\u0939\u0940\u0902 \u0939\u0948?", create_one: "\u090f\u0915 \u092c\u0928\u093e\u090f\u0902", demo_accounts: "\u0921\u0947\u092e\u094b \u0916\u093e\u0924\u0947",
  total_animals: "\u0915\u0941\u0932 \u092a\u0936\u0941", active_treatments: "\u0938\u0915\u094d\u0930\u093f\u092f \u0909\u092a\u091a\u093e\u0930", unread_alerts: "\u0905\u092a\u0920\u093f\u0924 \u0905\u0932\u0930\u094d\u091f", next_safe_sale: "\u0905\u0917\u0932\u0940 \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924 \u092c\u093f\u0915\u094d\u0930\u0940",
  log_treatment: "\u0909\u092a\u091a\u093e\u0930 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902", add_animal: "\u092a\u0936\u0941 \u091c\u094b\u0921\u093c\u0947\u0902", add_farm: "\u092b\u093e\u0930\u094d\u092e \u091c\u094b\u0921\u093c\u0947\u0902", view_farms: "\u092b\u093e\u0930\u094d\u092e \u0926\u0947\u0916\u0947\u0902",
  farm_health_summary: "\u092b\u093e\u0930\u094d\u092e \u0938\u094d\u0935\u093e\u0938\u094d\u0925\u094d\u092f \u0938\u093e\u0930\u093e\u0902\u0936", quick_actions: "\u0924\u094d\u0935\u0930\u093f\u0924 \u0915\u093e\u0930\u094d\u092f", risk_insights: "\u091c\u094b\u0916\u093f\u092e \u0905\u0902\u0924\u0930\u094d\u0926\u0943\u0937\u094d\u091f\u093f",
  no_alerts: "\u0915\u094b\u0908 \u0939\u093e\u0932\u093f\u092f\u093e \u0905\u0932\u0930\u094d\u091f \u0928\u0939\u0940\u0902\u0964", no_high_risk: "\u0915\u094b\u0908 \u0909\u091a\u094d\u091a \u091c\u094b\u0916\u093f\u092e \u092b\u093e\u0930\u094d\u092e \u0928\u0939\u0940\u0902\u0964",
  my_farms: "\u092e\u0947\u0930\u0947 \u092b\u093e\u0930\u094d\u092e", my_animals: "\u092e\u0947\u0930\u0947 \u092a\u0936\u0941", my_alerts: "\u092e\u0947\u0930\u0947 \u0905\u0932\u0930\u094d\u091f", all_animals: "\u0938\u092d\u0940 \u092a\u0936\u0941",
  assigned_farms: "\u0938\u094c\u0902\u092a\u0947 \u0917\u090f \u092b\u093e\u0930\u094d\u092e", farm_risk_list: "\u092b\u093e\u0930\u094d\u092e \u091c\u094b\u0916\u093f\u092e \u0938\u0942\u091a\u0940", resistance_radar: "\u092a\u094d\u0930\u0924\u093f\u0930\u094b\u0927 \u0930\u0921\u093e\u0930", audit_log: "\u0911\u0921\u093f\u091f \u0932\u0949\u0917",
  system_overview: "\u0938\u093f\u0938\u094d\u091f\u092e \u0905\u0935\u0932\u094b\u0915\u0928", government_control_center: "\u0938\u0930\u0915\u093e\u0930\u0940 \u0928\u093f\u092f\u0902\u0924\u094d\u0930\u0923 \u0915\u0947\u0902\u0926\u094d\u0930",
  recent_alerts: "\u0939\u093e\u0932\u093f\u092f\u093e \u0905\u0932\u0930\u094d\u091f", high_risk_farms: "\u0909\u091a\u094d\u091a \u091c\u094b\u0916\u093f\u092e \u092b\u093e\u0930\u094d\u092e", high_risk: "\u0909\u091a\u094d\u091a \u091c\u094b\u0916\u093f\u092e", medium_risk: "\u092e\u0927\u094d\u092f\u092e \u091c\u094b\u0916\u093f\u092e", low_risk: "\u0915\u092e \u091c\u094b\u0916\u093f\u092e",
  voice_input: "\u0906\u0935\u093e\u091c \u0907\u0928\u092a\u0941\u091f", listening: "\u0938\u0941\u0928 \u0930\u0939\u093e \u0939\u0948...", speak_now: "\u0905\u092c \u092c\u094b\u0932\u0947\u0902",
  safe_for_sale: "\u092c\u093f\u0915\u094d\u0930\u0940 \u0915\u0947 \u0932\u093f\u090f \u0938\u0941\u0930\u0915\u094d\u0937\u093f\u0924", days_remaining: "\u0926\u093f\u0928 \u0936\u0947\u0937", loading: "\u0932\u094b\u0921 \u0939\u094b \u0930\u0939\u093e \u0939\u0948...",
  issue_prescription: "\u092a\u094d\u0930\u093f\u0938\u094d\u0915\u094d\u0930\u093f\u092a\u094d\u0936\u0928 \u091c\u093e\u0930\u0940 \u0915\u0930\u0947\u0902", total_farms: "\u0915\u0941\u0932 \u092b\u093e\u0930\u094d\u092e",
  total_prescriptions: "\u092e\u0947\u0930\u0947 \u092a\u094d\u0930\u093f\u0938\u094d\u0915\u094d\u0930\u093f\u092a\u094d\u0936\u0928", export_pdf: "PDF \u0928\u093f\u0930\u094d\u092f\u093e\u0924",
  scan_qr: "QR \u0915\u094b\u0921 \u0938\u094d\u0915\u0948\u0928 \u0915\u0930\u0947\u0902", download: "\u0921\u093e\u0909\u0928\u0932\u094b\u0921", print: "\u092a\u094d\u0930\u093f\u0902\u091f"
};

const pa = {
  app_name: "FarmGuard", dashboard: "\u0a21\u0a48\u0a36\u0a2c\u0a4b\u0a30\u0a21", farms: "\u0a2b\u0a3e\u0a30\u0a2e", animals: "\u0a2a\u0a38\u0a3c\u0a42", alerts: "\u0a05\u0a32\u0a30\u0a1f", analytics: "\u0a35\u0a3f\u0a38\u0a3c\u0a32\u0a47\u0a38\u0a3c\u0a23",
  login: "\u0a32\u0a4c\u0a17\u0a07\u0a28", register: "\u0a30\u0a1c\u0a3f\u0a38\u0a1f\u0a30", email: "\u0a08\u0a2e\u0a47\u0a32", password: "\u0a2a\u0a3e\u0a38\u0a35\u0a30\u0a21", sign_in: "\u0a38\u0a3e\u0a08\u0a28 \u0a07\u0a28", sign_out: "\u0a38\u0a3e\u0a08\u0a28 \u0a06\u0a0a\u0a1f",
  welcome: "\u0a1c\u0a40 \u0a06\u0a07\u0a06\u0a02 \u0a28\u0a42\u0a02", sign_in_continue: "\u0a06\u0a2a\u0a23\u0a47 \u0a16\u0a3e\u0a24\u0a47 \u0a35\u0a3f\u0a71\u0a1a \u0a38\u0a3e\u0a08\u0a28 \u0a07\u0a28 \u0a15\u0a30\u0a4b", no_account: "\u0a16\u0a3e\u0a24\u0a3e \u0a28\u0a39\u0a40\u0a02 \u0a39\u0a48?", create_one: "\u0a07\u0a71\u0a15 \u0a2c\u0a23\u0a3e\u0a13", demo_accounts: "\u0a21\u0a48\u0a2e\u0a4b \u0a16\u0a3e\u0a24\u0a47",
  total_animals: "\u0a15\u0a41\u0a71\u0a32 \u0a2a\u0a38\u0a3c\u0a42", active_treatments: "\u0a38\u0a30\u0a17\u0a30\u0a2e \u0a07\u0a32\u0a3e\u0a1c", unread_alerts: "\u0a05\u0a23\u0a2a\u0a5c\u0a4d\u0a39\u0a47 \u0a05\u0a32\u0a30\u0a1f", next_safe_sale: "\u0a05\u0a17\u0a32\u0a40 \u0a38\u0a41\u0a30\u0a16\u0a3f\u0a05\u0a24 \u0a35\u0a3f\u0a15\u0a30\u0a40",
  log_treatment: "\u0a07\u0a32\u0a3e\u0a1c \u0a26\u0a30\u0a1c \u0a15\u0a30\u0a4b", add_animal: "\u0a2a\u0a38\u0a3c\u0a42 \u0a38\u0a3c\u0a3e\u0a2e\u0a32 \u0a15\u0a30\u0a4b", view_farms: "\u0a2b\u0a3e\u0a30\u0a2e \u0a26\u0a47\u0a16\u0a4b",
  farm_health_summary: "\u0a2b\u0a3e\u0a30\u0a2e \u0a38\u0a3f\u0a39\u0a24 \u0a38\u0a3e\u0a30", quick_actions: "\u0a24\u0a47\u0a1c\u0a3c \u0a15\u0a3e\u0a30\u0a35\u0a3e\u0a08\u0a06\u0a02", risk_insights: "\u0a1c\u0a4b\u0a16\u0a2e \u0a38\u0a42\u0a1d",
  no_alerts: "\u0a15\u0a4b\u0a08 \u0a24\u0a3e\u0a1c\u0a3c\u0a3e \u0a05\u0a32\u0a30\u0a1f \u0a28\u0a39\u0a40\u0a02\u0964",
  my_farms: "\u0a2e\u0a47\u0a30\u0a47 \u0a2b\u0a3e\u0a30\u0a2e", my_animals: "\u0a2e\u0a47\u0a30\u0a47 \u0a2a\u0a38\u0a3c\u0a42", my_alerts: "\u0a2e\u0a47\u0a30\u0a47 \u0a05\u0a32\u0a30\u0a1f", all_animals: "\u0a38\u0a3e\u0a30\u0a47 \u0a2a\u0a38\u0a3c\u0a42",
  assigned_farms: "\u0a38\u0a4c\u0a02\u0a2a\u0a47 \u0a17\u0a0f \u0a2b\u0a3e\u0a30\u0a2e", farm_risk_list: "\u0a2b\u0a3e\u0a30\u0a2e \u0a1c\u0a4b\u0a16\u0a2e \u0a38\u0a42\u0a1a\u0a40",
  issue_prescription: "\u0a2a\u0a4d\u0a30\u0a3f\u0a38\u0a15\u0a4d\u0a30\u0a3f\u0a2a\u0a38\u0a3c\u0a28 \u0a1c\u0a3e\u0a30\u0a40 \u0a15\u0a30\u0a4b", total_farms: "\u0a15\u0a41\u0a71\u0a32 \u0a2b\u0a3e\u0a30\u0a2e",
  system_overview: "\u0a38\u0a3f\u0a38\u0a1f\u0a2e \u0a1c\u0a3e\u0a23\u0a15\u0a3e\u0a30\u0a40", government_control_center: "\u0a38\u0a30\u0a15\u0a3e\u0a30\u0a40 \u0a15\u0a02\u0a1f\u0a30\u0a4b\u0a32 \u0a38\u0a48\u0a02\u0a1f\u0a30",
  recent_alerts: "\u0a24\u0a3e\u0a1c\u0a3c\u0a3e \u0a05\u0a32\u0a30\u0a1f", high_risk_farms: "\u0a09\u0a71\u0a1a \u0a1c\u0a4b\u0a16\u0a2e \u0a2b\u0a3e\u0a30\u0a2e", high_risk: "\u0a09\u0a71\u0a1a \u0a1c\u0a4b\u0a16\u0a2e", medium_risk: "\u0a26\u0a30\u0a2e\u0a3f\u0a06\u0a28\u0a3e \u0a1c\u0a4b\u0a16\u0a2e", low_risk: "\u0a18\u0a1f\u0a4d\u0a1f \u0a1c\u0a4b\u0a16\u0a2e",
  voice_input: "\u0a05\u0a35\u0a3e\u0a1c\u0a3c \u0a07\u0a28\u0a2a\u0a41\u0a1f", speak_now: "\u0a39\u0a41\u0a23 \u0a2c\u0a4b\u0a32\u0a4b", loading: "\u0a32\u0a4b\u0a21 \u0a39\u0a4b \u0a30\u0a3f\u0a39\u0a3e \u0a39\u0a48...",
  safe_for_sale: "\u0a35\u0a3f\u0a15\u0a30\u0a40 \u0a32\u0a08 \u0a38\u0a41\u0a30\u0a16\u0a3f\u0a05\u0a24", days_remaining: "\u0a26\u0a3f\u0a28 \u0a2c\u0a3e\u0a15\u0a40"
};

const stubKeys = {
  app_name: "FarmGuard", dashboard: "Dashboard", farms: "Farms", animals: "Animals", alerts: "Alerts",
  login: "Login", sign_in: "Sign In", welcome: "Welcome", email: "Email", password: "Password",
  total_animals: "Total Animals", log_treatment: "Log Treatment", add_animal: "Add Animal",
  my_farms: "My Farms", my_animals: "My Animals", my_alerts: "My Alerts", all_animals: "All Animals",
  view_farms: "View Farms", quick_actions: "Quick Actions", risk_insights: "Risk Insights",
  farm_health_summary: "Farm Health Summary", no_alerts: "No recent alerts.",
  farm_risk_list: "Farm Risk List", analytics: "Analytics", resistance_radar: "Resistance Radar", audit_log: "Audit Log",
  assigned_farms: "Assigned Farms", issue_prescription: "Issue Prescription",
  total_farms: "Total Farms", recent_alerts: "Recent Alerts", high_risk_farms: "High Risk Farms",
  voice_input: "Voice Input", speak_now: "Speak now", loading: "Loading...",
  safe_for_sale: "SAFE FOR SALE", days_remaining: "days remaining",
  scan_qr: "Scan QR", download: "Download", print: "Print"
};

fs.writeFileSync('i18n/locales/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('i18n/locales/hi.json', JSON.stringify(hi, null, 2));
fs.writeFileSync('i18n/locales/pa.json', JSON.stringify(pa, null, 2));

for (const lang of ['ta','te','bn','mr','kn','ml','gu','or']) {
  fs.writeFileSync('i18n/locales/' + lang + '.json', JSON.stringify(stubKeys, null, 2));
}

console.log('All 11 locale files updated!');
