/**
 * Indian Government Schemes for Livestock Farmers
 */
const SCHEMES = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN',
    nameHi: '\u092a\u0940\u090f\u092e \u0915\u093f\u0938\u093e\u0928',
    description: 'Income support of \u20b96,000 per year to all farmer families, payable in 3 installments of \u20b92,000 each.',
    eligibility: ['All farmer families with cultivable land', 'Subject to certain exclusions like income tax payers'],
    benefitAmount: '\u20b96,000/year',
    howToApply: 'Register at pmkisan.gov.in or visit your local Patwari/block office with Aadhaar and land records.',
    link: 'https://pmkisan.gov.in',
    category: 'income_support',
    matchFn: () => true, // All farmers eligible
  },
  {
    id: 'livestock-insurance',
    name: 'Livestock Insurance Scheme',
    nameHi: '\u092a\u0936\u0941\u092a\u093e\u0932\u0928 \u092c\u0940\u092e\u093e \u092f\u094b\u091c\u0928\u093e',
    description: 'Subsidized insurance for high-yielding cattle and buffalo against death due to disease, accident, or natural calamities.',
    eligibility: ['Owner of cattle, buffalo, sheep, goat, pig', 'Animals aged between 1 day to 12 years (cattle/buffalo)'],
    benefitAmount: 'Up to 75% premium subsidy (50% for others)',
    howToApply: 'Contact your nearest veterinary hospital or insurance company branch.',
    link: 'https://dahd.nic.in',
    category: 'insurance',
    matchFn: (farm) => farm.animalCount > 0,
  },
  {
    id: 'national-livestock-mission',
    name: 'National Livestock Mission',
    nameHi: '\u0930\u093e\u0937\u094d\u091f\u094d\u0930\u0940\u092f \u092a\u0936\u0941\u092a\u093e\u0932\u0928 \u092e\u093f\u0936\u0928',
    description: 'Comprehensive scheme for development of livestock sector including breeding, feed, and disease management.',
    eligibility: ['Individual farmers', 'Farmer Producer Organizations', 'Self Help Groups', 'Cooperatives'],
    benefitAmount: 'Varies by component - up to 50% subsidy',
    howToApply: 'Apply through State Animal Husbandry Department.',
    link: 'https://nlm.gov.in',
    category: 'development',
    matchFn: () => true,
  },
  {
    id: 'rashtriya-gokul-mission',
    name: 'Rashtriya Gokul Mission',
    nameHi: '\u0930\u093e\u0937\u094d\u091f\u094d\u0930\u0940\u092f \u0917\u094b\u0915\u0941\u0932 \u092e\u093f\u0936\u0928',
    description: 'Development and conservation of indigenous bovine breeds through selective breeding and genetic upgradation.',
    eligibility: ['Dairy farmers with indigenous cattle breeds', 'Bull mother farms', 'Heifer rearing farms'],
    benefitAmount: 'Up to \u20b950,000 for purchase of high genetic merit bulls',
    howToApply: 'Contact District Animal Husbandry Officer or state dairy department.',
    link: 'https://rashtriyagokulmission.udyamiaryana.in',
    category: 'breeding',
    matchFn: (farm) => farm.species?.includes('cattle') || farm.species?.includes('buffalo'),
  },
  {
    id: 'dairy-infrastructure',
    name: 'Dairy Processing & Infrastructure Development Fund',
    nameHi: '\u0921\u0947\u0930\u0940 \u092a\u094d\u0930\u094b\u0938\u0947\u0938\u093f\u0902\u0917 \u090f\u0935\u0902 \u092a\u0942\u0930\u094d\u0935\u0924\u093e \u0935\u093f\u0915\u093e\u0938 \u092b\u0902\u0921',
    description: 'NABARD fund for modernization and capacity expansion of dairy processing infrastructure.',
    eligibility: ['Dairy cooperatives', 'Farmer Producer Organizations', 'Private dairy companies'],
    benefitAmount: 'Loan at 6.5% interest for 10 years',
    howToApply: 'Apply through NABARD or your district cooperative bank.',
    link: 'https://www.nabard.org',
    category: 'infrastructure',
    matchFn: (farm) => farm.animalCount >= 5,
  },
  {
    id: 'ah-infrastructure',
    name: 'Animal Husbandry Infrastructure Development Fund',
    nameHi: '\u092a\u0936\u0941\u092a\u093e\u0932\u0928 \u092a\u093e\u0932\u0928 \u092a\u0942\u0930\u094d\u0935\u0924\u093e \u0935\u093f\u0915\u093e\u0938 \u092b\u0902\u0921',
    description: 'Support for establishment of dairy processing, meat processing, and animal feed plants.',
    eligibility: ['FPOs', 'Cooperatives', 'Companies', 'Individual entrepreneurs with viable projects'],
    benefitAmount: '3% interest subvention on loans up to \u20b925 crore',
    howToApply: 'Apply through NABARD with project proposal.',
    link: 'https://www.nabard.org',
    category: 'infrastructure',
    matchFn: (farm) => farm.animalCount >= 10,
  },
  {
    id: 'nadcp',
    name: 'National Animal Disease Control Programme',
    nameHi: '\u0930\u093e\u0937\u094d\u091f\u094d\u0930\u0940\u092f \u092a\u0936\u0941\u092a\u093e\u0932\u0928 \u0930\u094b\u0917 \u0928\u093f\u092f\u0902\u0924\u094d\u0930\u0923 \u0915\u093e\u0930\u094d\u092f\u0915\u094d\u0930\u092e',
    description: 'Free vaccination against Foot and Mouth Disease (FMD) and Brucellosis to control and eventually eradicate these diseases.',
    eligibility: ['All livestock owners - cattle, buffalo, sheep, goat, pig', 'Completely free of cost'],
    benefitAmount: 'Free vaccination',
    howToApply: 'Veterinarians visit villages for vaccination drives. Contact local veterinary hospital.',
    link: 'https://nadcp.dahd.gov.in',
    category: 'disease_control',
    matchFn: () => true,
  },
  {
    id: 'kcc-ah',
    name: 'Kisan Credit Card for Animal Husbandry & Fisheries',
    nameHi: '\u0915\u093f\u0938\u093e\u0928 \u0915\u094d\u0930\u0947\u0921\u093f\u091f \u0915\u093e\u0930\u094d\u0921 - \u092a\u0936\u0941\u092a\u093e\u0932\u0928 \u092a\u093e\u0932\u0928',
    description: 'Affordable credit for animal husbandry and fisheries at 4% interest (after subvention). Covers purchase of animals, feed, and equipment.',
    eligibility: ['Individual farmers', 'SHGs', 'Joint liability groups', 'Tenant farmers with valid documents'],
    benefitAmount: 'Loan up to \u20b93 lakh at 4% interest',
    howToApply: 'Apply at any commercial bank, cooperative bank, or RRB with land documents and animal details.',
    link: 'https://www.nabard.org',
    category: 'credit',
    matchFn: (farm) => farm.animalCount > 0,
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana',
    nameHi: '\u092a\u0940\u090f\u092e \u092b\u0938\u0932 \u092c\u0940\u092e\u093e \u092f\u094b\u091c\u0928\u093e',
    description: 'Crop insurance scheme covering feed crops against natural calamities, pests, and diseases.',
    eligibility: ['All farmers growing notified crops', 'Sharecroppers and tenant farmers included'],
    benefitAmount: 'Up to \u20b92 lakh per hectare',
    howToApply: 'Apply through bank, CSC, or pmfby.gov.in during notified period.',
    link: 'https://pmfby.gov.in',
    category: 'insurance',
    matchFn: (farm) => farm.areaAcres > 0,
  },
  {
    id: 'sub-mission-mechanization',
    name: 'Sub-Mission on Agricultural Mechanization',
    nameHi: '\u0915\u0943\u0937\u093f \u092f\u0902\u0924\u094d\u0930\u0940\u0915\u0930\u0923 \u0909\u092a \u092e\u093f\u0936\u0928',
    description: 'Subsidy on purchase of farm machinery including chaff cutters, feed mixers, and milking machines.',
    eligibility: ['Individual farmers', 'FPOs', 'Cooperatives', 'Custom Hiring Centres'],
    benefitAmount: '40-50% subsidy on machinery',
    howToApply: 'Apply on state agriculture department portal or visit district agriculture office.',
    link: 'https://agrimachinery.nic.in',
    category: 'mechanization',
    matchFn: (farm) => farm.areaAcres > 1,
  },
];

/**
 * Get schemes relevant to a farm profile
 * @param {Object} farmProfile - { animalCount, species, areaAcres, state, district }
 * @returns {Object[]} - Relevant schemes
 */
function getRelevantSchemes(farmProfile = {}) {
  const profile = {
    animalCount: farmProfile.animalCount || 0,
    species: farmProfile.species || [],
    areaAcres: farmProfile.areaAcres || 0,
    state: farmProfile.state || '',
    district: farmProfile.district || '',
  };

  return SCHEMES.filter(scheme => {
    try {
      return scheme.matchFn(profile);
    } catch {
      return true;
    }
  });
}

/**
 * Get all schemes
 * @returns {Object[]} - All schemes
 */
function getAllSchemes() {
  return SCHEMES.map(({ matchFn, ...scheme }) => scheme);
}

module.exports = { getRelevantSchemes, getAllSchemes, SCHEMES };
