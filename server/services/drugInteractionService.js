/**
 * Veterinary Drug Interaction Database
 * Based on WHO/FAO and veterinary pharmacology references
 */
const DRUG_INTERACTIONS = [
  {
    drugs: ['Penicillin', 'Tetracycline', 'Oxytetracycline', 'Doxycycline'],
    severity: 'caution',
    effect: 'Antagonistic effect - bactericidal + bacteriostatic drugs reduce each other\'s efficacy',
    recommendation: 'Avoid combining. Use one or the other. If both needed, give bactericidal first.',
  },
  {
    drugs: ['Gentamicin', 'Furosemide'],
    severity: 'dangerous',
    effect: 'Increased risk of nephrotoxicity and ototoxicity',
    recommendation: 'Monitor kidney function closely. Reduce gentamicin dose if possible.',
  },
  {
    drugs: ['Oxytetracycline', 'Iron', 'Iron supplements'],
    severity: 'caution',
    effect: 'Iron reduces tetracycline absorption by up to 80%',
    recommendation: 'Administer at least 2 hours apart.',
  },
  {
    drugs: ['Enrofloxacin', 'Theophylline'],
    severity: 'dangerous',
    effect: 'Enrofloxacin inhibits theophylline metabolism, risk of theophylline toxicity',
    recommendation: 'Reduce theophylline dose by 50% or use alternative antibiotic.',
  },
  {
    drugs: ['Amoxicillin', 'Colistin'],
    severity: 'caution',
    effect: 'Antagonistic - colistin may reduce amoxicillin efficacy against gram-negative bacteria',
    recommendation: 'Avoid combination. Choose one based on culture results.',
  },
  {
    drugs: ['Florfenicol', 'Macrolides', 'Erythromycin', 'Tylosin', 'Tilmicosin'],
    severity: 'caution',
    effect: 'Both bind to 50S ribosomal subunit - competitive antagonism',
    recommendation: 'Do not use together. Wait 48 hours between treatments.',
  },
  {
    drugs: ['Sulfonamides', 'Procaine'],
    severity: 'dangerous',
    effect: 'Procaine breaks down to PABA which completely neutralizes sulfonamides',
    recommendation: 'Never combine procaine-penicillin with sulfa drugs.',
  },
  {
    drugs: ['Ivermectin', 'Chloramphenicol'],
    severity: 'caution',
    effect: 'Potential increased toxicity risk in some species',
    recommendation: 'Use with caution. Monitor for adverse reactions.',
  },
  {
    drugs: ['Dexamethasone', 'NSAIDs', 'Meloxicam', 'Flunixin', 'Ketoprofen', 'Aspirin'],
    severity: 'dangerous',
    effect: 'Severe risk of gastrointestinal ulceration and hemorrhage',
    recommendation: 'Avoid combination. If both needed, use gastroprotectants.',
  },
  {
    drugs: ['Oxytocin', 'Dexamethasone', 'Corticosteroids'],
    severity: 'caution',
    effect: 'Corticosteroids may reduce oxytocin response',
    recommendation: 'Monitor uterine response. May need higher oxytocin dose.',
  },
  {
    drugs: ['Trimethoprim', 'Doxycycline'],
    severity: 'caution',
    effect: 'Doxycycline is bacteriostatic and may reduce trimethoprim efficacy',
    recommendation: 'Use sequential rather than concurrent administration.',
  },
  {
    drugs: ['Ciprofloxacin', 'Enrofloxacin', 'Antacids', 'Magnesium', 'Calcium', 'Aluminum'],
    severity: 'caution',
    effect: 'Antacids dramatically reduce fluoroquinolone absorption',
    recommendation: 'Administer fluoroquinolones 2 hours before or 6 hours after antacids.',
  },
  {
    drugs: ['Metronidazole', 'Alcohol', 'Ethanol'],
    severity: 'dangerous',
    effect: 'Disulfiram-like reaction - severe nausea, vomiting, cardiovascular distress',
    recommendation: 'Never administer alcohol-containing products with metronidazole.',
  },
  {
    drugs: ['Ketoprofen', 'Gentamicin'],
    severity: 'dangerous',
    effect: 'NSAIDs increase gentamicin nephrotoxicity risk by reducing renal blood flow',
    recommendation: 'Avoid combination. Use paracetamol instead of ketoprofen if gentamicin is required.',
  },
  {
    drugs: ['Vitamin E', 'Selenium'],
    severity: 'caution',
    effect: 'Synergistic at low doses but toxic at high doses - risk of selenium poisoning',
    recommendation: 'Use only at recommended doses. Do not exceed 0.1mg/kg selenium.',
  },
];

/**
 * Check all interactions among a list of drug names
 * @param {string[]} drugNames - Array of drug names being used together
 * @returns {Object[]} - Array of matching interactions
 */
function checkInteractions(drugNames) {
  if (!drugNames || drugNames.length < 2) return [];

  const normalized = drugNames.map(d => d.trim().toLowerCase());
  const matches = [];

  for (const interaction of DRUG_INTERACTIONS) {
    const interactionDrugs = interaction.drugs.map(d => d.toLowerCase());
    const matchingDrugs = drugNames.filter(d =>
      interactionDrugs.some(id => id.includes(d.toLowerCase()) || d.toLowerCase().includes(id))
    );

    if (matchingDrugs.length >= 2) {
      matches.push({
        drugs: matchingDrugs,
        severity: interaction.severity,
        effect: interaction.effect,
        recommendation: interaction.recommendation,
      });
    }
  }

  return matches;
}

/**
 * Check if a new drug interacts with any existing drugs
 * @param {string[]} existingDrugs - Already administered drugs
 * @param {string} newDrug - New drug being considered
 * @returns {Object[]} - Array of matching interactions
 */
function checkNewDrug(existingDrugs, newDrug) {
  if (!existingDrugs || !newDrug) return [];
  return checkInteractions([...existingDrugs, newDrug]);
}

module.exports = { checkInteractions, checkNewDrug, DRUG_INTERACTIONS };
