/**
 * 50 Veterinary Drugs with MRL and withdrawal data
 * Sources: FAO/WHO Codex Alimentarius, FSSAI India standards
 */

const drugs = [
  // === PENICILLINS (Access) ===
  { name: 'Amoxicillin Trihydrate', generic_name: 'Amoxicillin', drug_class: 'Penicillin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, buffalo, goat, sheep', withdrawal_days_meat: 14, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 10.0, unit: 'mg', route: 'injection' },
  { name: 'Ampicillin Sodium', generic_name: 'Ampicillin', drug_class: 'Penicillin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine', withdrawal_days_meat: 10, withdrawal_days_milk: 2, withdrawal_days_egg: null, dosage_per_kg: 7.0, unit: 'mg', route: 'injection' },
  { name: 'Penicillin G Procaine', generic_name: 'Penicillin G', drug_class: 'Penicillin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine, sheep', withdrawal_days_meat: 10, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 12.0, unit: 'mg', route: 'injection' },
  { name: 'Cloxacillin Sodium', generic_name: 'Cloxacillin', drug_class: 'Penicillin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.03, mrl_species: 'cattle', withdrawal_days_meat: 7, withdrawal_days_milk: 2, withdrawal_days_egg: null, dosage_per_kg: 5.0, unit: 'mg', route: 'intramammary' },

  // === CEPHALOSPORINS 1st Gen (Access) ===
  { name: 'Cefalexin Monohydrate', generic_name: 'Cefalexin', drug_class: 'Cephalosporin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine', withdrawal_days_meat: 8, withdrawal_days_milk: 2, withdrawal_days_egg: null, dosage_per_kg: 15.0, unit: 'mg', route: 'oral' },
  { name: 'Cefazolin Sodium', generic_name: 'Cefazolin', drug_class: 'Cephalosporin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine', withdrawal_days_meat: 10, withdrawal_days_milk: 2, withdrawal_days_egg: null, dosage_per_kg: 10.0, unit: 'mg', route: 'injection' },

  // === CEPHALOSPORINS 3rd Gen (Watch) ===
  { name: 'Ceftiofur Hydrochloride', generic_name: 'Ceftiofur', drug_class: 'Cephalosporin', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 8, withdrawal_days_milk: 2, withdrawal_days_egg: 1, dosage_per_kg: 2.0, unit: 'mg', route: 'injection' },
  { name: 'Cefquinome Sulfate', generic_name: 'Cefquinome', drug_class: 'Cephalosporin', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine', withdrawal_days_meat: 5, withdrawal_days_milk: 2, withdrawal_days_egg: null, dosage_per_kg: 1.0, unit: 'mg', route: 'injection' },

  // === TETRACYCLINES (Access) ===
  { name: 'Oxytetracycline Dihydrate', generic_name: 'Oxytetracycline', drug_class: 'Tetracycline', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry, fish', withdrawal_days_meat: 14, withdrawal_days_milk: 4, withdrawal_days_egg: 2, dosage_per_kg: 20.0, unit: 'mg', route: 'injection' },
  { name: 'Chlortetracycline Hydrochloride', generic_name: 'Chlortetracycline', drug_class: 'Tetracycline', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 7, withdrawal_days_milk: 2, withdrawal_days_egg: 1, dosage_per_kg: 22.0, unit: 'mg', route: 'oral' },
  { name: 'Doxycycline Hyclate', generic_name: 'Doxycycline', drug_class: 'Tetracycline', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'swine, poultry', withdrawal_days_meat: 10, withdrawal_days_milk: null, withdrawal_days_egg: 2, dosage_per_kg: 10.0, unit: 'mg', route: 'oral' },

  // === SULFONAMIDES (Access) ===
  { name: 'Sulfadiazine', generic_name: 'Sulfadiazine', drug_class: 'Sulfonamide', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 10, withdrawal_days_milk: 3, withdrawal_days_egg: 2, dosage_per_kg: 50.0, unit: 'mg', route: 'oral' },
  { name: 'Sulfamethoxazole', generic_name: 'Sulfamethoxazole', drug_class: 'Sulfonamide', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine', withdrawal_days_meat: 12, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 25.0, unit: 'mg', route: 'oral' },
  { name: 'Trimethoprim', generic_name: 'Trimethoprim', drug_class: 'Sulfonamide', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 8, withdrawal_days_milk: 2, withdrawal_days_egg: 2, dosage_per_kg: 5.0, unit: 'mg', route: 'oral' },
  { name: 'Sulfadimethoxine', generic_name: 'Sulfadimethoxine', drug_class: 'Sulfonamide', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, poultry', withdrawal_days_meat: 7, withdrawal_days_milk: 3, withdrawal_days_egg: 5, dosage_per_kg: 55.0, unit: 'mg', route: 'oral' },

  // === AMINOGLYCOSIDES (Watch) ===
  { name: 'Gentamicin Sulfate', generic_name: 'Gentamicin', drug_class: 'Aminoglycoside', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 40, withdrawal_days_milk: 4, withdrawal_days_egg: null, dosage_per_kg: 4.0, unit: 'mg', route: 'injection' },
  { name: 'Streptomycin Sulfate', generic_name: 'Streptomycin', drug_class: 'Aminoglycoside', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.5, mrl_species: 'cattle, swine', withdrawal_days_meat: 30, withdrawal_days_milk: 2, withdrawal_days_egg: null, dosage_per_kg: 10.0, unit: 'mg', route: 'injection' },
  { name: 'Neomycin Sulfate', generic_name: 'Neomycin', drug_class: 'Aminoglycoside', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.5, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 20, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 10.0, unit: 'mg', route: 'oral' },
  { name: 'Kanamycin Sulfate', generic_name: 'Kanamycin', drug_class: 'Aminoglycoside', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.15, mrl_species: 'cattle, swine', withdrawal_days_meat: 30, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 15.0, unit: 'mg', route: 'injection' },

  // === MACROLIDES (Watch) ===
  { name: 'Tylosin Tartrate', generic_name: 'Tylosin', drug_class: 'Macrolide', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 14, withdrawal_days_milk: 3, withdrawal_days_egg: 1, dosage_per_kg: 10.0, unit: 'mg', route: 'injection' },
  { name: 'Erythromycin Thiocyanate', generic_name: 'Erythromycin', drug_class: 'Macrolide', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 14, withdrawal_days_milk: 3, withdrawal_days_egg: 1, dosage_per_kg: 10.0, unit: 'mg', route: 'injection' },
  { name: 'Tilmicosin Phosphate', generic_name: 'Tilmicosin', drug_class: 'Macrolide', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine', withdrawal_days_meat: 42, withdrawal_days_milk: 4, withdrawal_days_egg: null, dosage_per_kg: 20.0, unit: 'mg', route: 'oral' },
  { name: 'Tulathromycin', generic_name: 'Tulathromycin', drug_class: 'Macrolide', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine', withdrawal_days_meat: 49, withdrawal_days_milk: null, withdrawal_days_egg: null, dosage_per_kg: 2.5, unit: 'mg', route: 'subcutaneous' },

  // === FLUOROQUINOLONES (Watch — highest concern) ===
  { name: 'Enrofloxacin', generic_name: 'Enrofloxacin', drug_class: 'Fluoroquinolone', who_category: 'Watch', is_critical: true, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 14, withdrawal_days_milk: 4, withdrawal_days_egg: 2, dosage_per_kg: 5.0, unit: 'mg', route: 'injection' },
  { name: 'Ciprofloxacin Hydrochloride', generic_name: 'Ciprofloxacin', drug_class: 'Fluoroquinolone', who_category: 'Watch', is_critical: true, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, poultry', withdrawal_days_meat: 14, withdrawal_days_milk: 4, withdrawal_days_egg: 2, dosage_per_kg: 10.0, unit: 'mg', route: 'oral' },
  { name: 'Marbofloxacin', generic_name: 'Marbofloxacin', drug_class: 'Fluoroquinolone', who_category: 'Watch', is_critical: true, mrl_limit_mg_kg: 0.075, mrl_species: 'cattle, swine', withdrawal_days_meat: 10, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 2.0, unit: 'mg', route: 'injection' },
  { name: 'Danofloxacin Mesylate', generic_name: 'Danofloxacin', drug_class: 'Fluoroquinolone', who_category: 'Watch', is_critical: true, mrl_limit_mg_kg: 0.03, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 14, withdrawal_days_milk: 4, withdrawal_days_egg: 2, dosage_per_kg: 1.25, unit: 'mg', route: 'injection' },

  // === LINCOSAMIDES (Access) ===
  { name: 'Lincomycin Hydrochloride', generic_name: 'Lincomycin', drug_class: 'Lincosamide', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'swine, poultry', withdrawal_days_meat: 6, withdrawal_days_milk: null, withdrawal_days_egg: 1, dosage_per_kg: 11.0, unit: 'mg', route: 'injection' },
  { name: 'Clindamycin Hydrochloride', generic_name: 'Clindamycin', drug_class: 'Lincosamide', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine', withdrawal_days_meat: 6, withdrawal_days_milk: 1, withdrawal_days_egg: null, dosage_per_kg: 5.0, unit: 'mg', route: 'oral' },

  // === PLEUROMUTILINS (Watch) ===
  { name: 'Tiamulin Hydrogen Fumarate', generic_name: 'Tiamulin', drug_class: 'Pleuromutilin', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'swine, poultry', withdrawal_days_meat: 7, withdrawal_days_milk: null, withdrawal_days_egg: 2, dosage_per_kg: 15.0, unit: 'mg', route: 'oral' },
  { name: 'Valnemulin Hydrochloride', generic_name: 'Valnemulin', drug_class: 'Pleuromutilin', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'swine', withdrawal_days_meat: 5, withdrawal_days_milk: null, withdrawal_days_egg: null, dosage_per_kg: 7.5, unit: 'mg', route: 'oral' },

  // === POLYMYXINS (Reserve — highest priority) ===
  { name: 'Colistin Sulfate', generic_name: 'Colistin', drug_class: 'Polymyxin', who_category: 'Reserve', is_critical: true, mrl_limit_mg_kg: 0.15, mrl_species: 'cattle, swine, poultry', withdrawal_days_meat: 28, withdrawal_days_milk: 4, withdrawal_days_egg: 2, dosage_per_kg: 100.0, unit: 'mg', route: 'oral' },

  // === PHENICOLS (Watch) ===
  { name: 'Florfenicol', generic_name: 'Florfenicol', drug_class: 'Phenicol', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, swine, fish', withdrawal_days_meat: 30, withdrawal_days_milk: null, withdrawal_days_egg: null, dosage_per_kg: 20.0, unit: 'mg', route: 'injection' },
  { name: 'Thiamphenicol', generic_name: 'Thiamphenicol', drug_class: 'Phenicol', who_category: 'Watch', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, fish', withdrawal_days_meat: 14, withdrawal_days_milk: null, withdrawal_days_egg: null, dosage_per_kg: 15.0, unit: 'mg', route: 'injection' },

  // === NITROFURANES (Banned in many countries — critical) ===
  { name: 'Furazolidone', generic_name: 'Furazolidone', drug_class: 'Nitrofurane', who_category: 'Reserve', is_critical: true, mrl_limit_mg_kg: 0.0, mrl_species: 'all food-producing animals', withdrawal_days_meat: 0, withdrawal_days_milk: 0, withdrawal_days_egg: 0, dosage_per_kg: null, unit: 'mg', route: 'oral' },
  { name: 'Nitrofurantoin', generic_name: 'Nitrofurantoin', drug_class: 'Nitrofurane', who_category: 'Reserve', is_critical: true, mrl_limit_mg_kg: 0.0, mrl_species: 'all food-producing animals', withdrawal_days_meat: 0, withdrawal_days_milk: 0, withdrawal_days_egg: 0, dosage_per_kg: null, unit: 'mg', route: 'oral' },

  // === ANTHELMINTICS (Access) ===
  { name: 'Albendazole', generic_name: 'Albendazole', drug_class: 'Benzimidazole', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle, sheep, goat', withdrawal_days_meat: 14, withdrawal_days_milk: 4, withdrawal_days_egg: null, dosage_per_kg: 7.5, unit: 'mg', route: 'oral' },
  { name: 'Fenbendazole', generic_name: 'Fenbendazole', drug_class: 'Benzimidazole', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, sheep, goat, swine', withdrawal_days_meat: 14, withdrawal_days_milk: 4, withdrawal_days_egg: null, dosage_per_kg: 5.0, unit: 'mg', route: 'oral' },
  { name: 'Ivermectin', generic_name: 'Ivermectin', drug_class: 'Avermectin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.02, mrl_species: 'cattle, sheep, goat, swine', withdrawal_days_meat: 28, withdrawal_days_milk: 7, withdrawal_days_egg: null, dosage_per_kg: 0.2, unit: 'mg', route: 'subcutaneous' },
  { name: 'Doramectin', generic_name: 'Doramectin', drug_class: 'Avermectin', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.01, mrl_species: 'cattle, swine', withdrawal_days_meat: 42, withdrawal_days_milk: null, withdrawal_days_egg: null, dosage_per_kg: 0.2, unit: 'mg', route: 'injection' },
  { name: 'Levamisole Hydrochloride', generic_name: 'Levamisole', drug_class: 'Imidazothiazole', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.01, mrl_species: 'cattle, sheep, goat, swine', withdrawal_days_meat: 14, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 8.0, unit: 'mg', route: 'oral' },
  { name: 'Praziquantel', generic_name: 'Praziquantel', drug_class: 'Isoquinoline', who_category: 'Access', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, sheep', withdrawal_days_meat: 14, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 5.0, unit: 'mg', route: 'oral' },

  // === ANTI-PROTOZOAL (Access) ===
  { name: 'Dimetridazole', generic_name: 'Dimetridazole', drug_class: 'Nitroimidazole', who_category: 'Reserve', is_critical: true, mrl_limit_mg_kg: 0.0, mrl_species: 'all food-producing animals', withdrawal_days_meat: 0, withdrawal_days_milk: 0, withdrawal_days_egg: 0, dosage_per_kg: null, unit: 'mg', route: 'oral' },
  { name: 'Ronidazole', generic_name: 'Ronidazole', drug_class: 'Nitroimidazole', who_category: 'Reserve', is_critical: true, mrl_limit_mg_kg: 0.0, mrl_species: 'poultry', withdrawal_days_meat: 0, withdrawal_days_milk: null, withdrawal_days_egg: 0, dosage_per_kg: null, unit: 'mg', route: 'oral' },

  // === AMINOCOUMARIN (Reserve) ===
  { name: 'Novobiocin Sodium', generic_name: 'Novobiocin', drug_class: 'Aminocoumarin', who_category: 'Reserve', is_critical: true, mrl_limit_mg_kg: 0.1, mrl_species: 'cattle', withdrawal_days_meat: 14, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 10.0, unit: 'mg', route: 'intramammary' },

  // === STEROIDAL ANTI-INFLAMMATORY (Supportive) ===
  { name: 'Dexamethasone Sodium Phosphate', generic_name: 'Dexamethasone', drug_class: 'Corticosteroid', who_category: 'Not Listed', is_critical: false, mrl_limit_mg_kg: 0.002, mrl_species: 'cattle, swine, horse', withdrawal_days_meat: 21, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 0.05, unit: 'mg', route: 'injection' },
  { name: 'Flumethasone', generic_name: 'Flumethasone', drug_class: 'Corticosteroid', who_category: 'Not Listed', is_critical: false, mrl_limit_mg_kg: 0.001, mrl_species: 'cattle, swine', withdrawal_days_meat: 21, withdrawal_days_milk: 3, withdrawal_days_egg: null, dosage_per_kg: 0.02, unit: 'mg', route: 'injection' },

  // === NSAIDs (Supportive) ===
  { name: 'Meloxicam', generic_name: 'Meloxicam', drug_class: 'NSAID', who_category: 'Not Listed', is_critical: false, mrl_limit_mg_kg: 0.02, mrl_species: 'cattle, swine', withdrawal_days_meat: 15, withdrawal_days_milk: 5, withdrawal_days_egg: null, dosage_per_kg: 0.5, unit: 'mg', route: 'injection' },
  { name: 'Flunixin Meglumine', generic_name: 'Flunixin', drug_class: 'NSAID', who_category: 'Not Listed', is_critical: false, mrl_limit_mg_kg: 0.025, mrl_species: 'cattle, swine, horse', withdrawal_days_meat: 10, withdrawal_days_milk: 1, withdrawal_days_egg: null, dosage_per_kg: 2.2, unit: 'mg', route: 'injection' },
  { name: 'Ketoprofen', generic_name: 'Ketoprofen', drug_class: 'NSAID', who_category: 'Not Listed', is_critical: false, mrl_limit_mg_kg: 0.05, mrl_species: 'cattle, swine, horse', withdrawal_days_meat: 7, withdrawal_days_milk: 2, withdrawal_days_egg: null, dosage_per_kg: 3.0, unit: 'mg', route: 'injection' },
];

module.exports = drugs;
