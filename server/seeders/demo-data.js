require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sequelize, User, Farm, Animal, Drug, AmuLog, Alert, RiskAssessment } = require('../models');
const drugsList = require('./drugs-master');
const { updateFarmRiskScore } = require('../services/riskEngine');

// ─── HELPERS ───
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── DATA ───
const DEMO_PASSWORD = 'Feb@2008';
const STATE = 'Punjab';

const usersData = [
  { name: 'Harpreet Singh', email: 'harpreet@farmguard.demo', password: DEMO_PASSWORD, role: 'farmer', phone: '9876543210', district: 'Ludhiana', state: STATE },
  { name: 'Gurpreet Kaur', email: 'gurpreet@farmguard.demo', password: DEMO_PASSWORD, role: 'farmer', phone: '9876543211', district: 'Jalandhar', state: STATE },
  { name: 'Manpreet Singh', email: 'manpreet@farmguard.demo', password: DEMO_PASSWORD, role: 'farmer', phone: '9876543212', district: 'Patiala', state: STATE },
  { name: 'Dr. Amarjeet Singh', email: 'amarjeet@farmguard.demo', password: DEMO_PASSWORD, role: 'vet', phone: '9876543213', district: 'Ludhiana', state: STATE },
  { name: 'Dr. Simran Kaur', email: 'simran@farmguard.demo', password: DEMO_PASSWORD, role: 'vet', phone: '9876543214', district: 'Amritsar', state: STATE },
  { name: 'Dr. Rajesh Kumar', email: 'admin@farmguard.demo', password: DEMO_PASSWORD, role: 'admin', phone: '9876543215', district: 'Chandigarh', state: STATE },
];

// 5 farms: 2 RED (heavy AMU), 2 YELLOW (moderate), 1 GREEN (minimal)
const farmsData = [
  { name: 'Singh Dairy Farm', district: 'Ludhiana', state: STATE, location: 'Village Khanna, Ludhiana', area_acres: 25.0, ownerIndex: 0 },
  { name: 'Kaur Poultry Farm', district: 'Jalandhar', state: STATE, location: 'Nakodar Road, Jalandhar', area_acres: 15.0, ownerIndex: 1 },
  { name: 'Green Valley Farm', district: 'Patiala', state: STATE, location: 'Rajpura Road, Patiala', area_acres: 40.0, ownerIndex: 2 },
  { name: 'Moga Livestock Farm', district: 'Moga', state: STATE, location: 'Moga-Ferozepur Road', area_acres: 30.0, ownerIndex: 0 },
  { name: 'Amrit Goat Farm', district: 'Amritsar', state: STATE, location: 'Tarn Taran Road, Amritsar', area_acres: 12.0, ownerIndex: 2 },
];

// 20 animals distributed across 5 farms
const animalsData = [
  // Farm 1 — Singh Dairy Farm (4 cattle + 1 buffalo)
  { farmIndex: 0, tag_number: 'COW-001', species: 'cattle', breed: 'Sahiwal', weight_kg: 450, gender: 'female', date_of_birth: '2021-03-15' },
  { farmIndex: 0, tag_number: 'COW-002', species: 'cattle', breed: 'Gir', weight_kg: 400, gender: 'female', date_of_birth: '2022-01-10' },
  { farmIndex: 0, tag_number: 'COW-003', species: 'cattle', breed: 'Tharparkar', weight_kg: 380, gender: 'female', date_of_birth: '2020-07-22' },
  { farmIndex: 0, tag_number: 'BUF-001', species: 'buffalo', breed: 'Murrah', weight_kg: 550, gender: 'female', date_of_birth: '2019-11-05' },
  { farmIndex: 0, tag_number: 'COW-004', species: 'cattle', breed: 'Red Sindhi', weight_kg: 420, gender: 'female', date_of_birth: '2023-02-18' },
  // Farm 2 — Kaur Poultry Farm (4 poultry)
  { farmIndex: 1, tag_number: 'HEN-001', species: 'poultry', breed: 'White Leghorn', weight_kg: 1.8, gender: 'female', date_of_birth: '2024-06-01' },
  { farmIndex: 1, tag_number: 'HEN-002', species: 'poultry', breed: 'Rhode Island Red', weight_kg: 2.2, gender: 'female', date_of_birth: '2024-06-01' },
  { farmIndex: 1, tag_number: 'HEN-003', species: 'poultry', breed: 'White Leghorn', weight_kg: 1.9, gender: 'female', date_of_birth: '2024-05-15' },
  { farmIndex: 1, tag_number: 'BRO-001', species: 'poultry', breed: 'Cobb 500', weight_kg: 3.0, gender: 'male', date_of_birth: '2025-01-10' },
  // Farm 3 — Green Valley Farm (3 cattle + 1 sheep)
  { farmIndex: 2, tag_number: 'COW-005', species: 'cattle', breed: 'Holstein Friesian', weight_kg: 520, gender: 'female', date_of_birth: '2021-08-20' },
  { farmIndex: 2, tag_number: 'COW-006', species: 'cattle', breed: 'Jersey', weight_kg: 380, gender: 'female', date_of_birth: '2022-04-12' },
  { farmIndex: 2, tag_number: 'SHP-001', species: 'sheep', breed: 'Nali', weight_kg: 45, gender: 'male', date_of_birth: '2023-01-05' },
  { farmIndex: 2, tag_number: 'COW-007', species: 'cattle', breed: 'Sahiwal', weight_kg: 460, gender: 'female', date_of_birth: '2020-12-01' },
  // Farm 4 — Moga Livestock Farm (2 swine + 2 goat)
  { farmIndex: 3, tag_number: 'SWG-001', species: 'swine', breed: 'Large White', weight_kg: 120, gender: 'male', date_of_birth: '2023-06-15' },
  { farmIndex: 3, tag_number: 'SWG-002', species: 'swine', breed: 'Landrace', weight_kg: 110, gender: 'female', date_of_birth: '2023-09-20' },
  { farmIndex: 3, tag_number: 'GOT-001', species: 'goat', breed: 'Beetal', weight_kg: 55, gender: 'female', date_of_birth: '2023-03-10' },
  { farmIndex: 3, tag_number: 'GOT-002', species: 'goat', breed: 'Jamunapari', weight_kg: 60, gender: 'male', date_of_birth: '2022-11-25' },
  // Farm 5 — Amrit Goat Farm (3 goat)
  { farmIndex: 4, tag_number: 'GOT-003', species: 'goat', breed: 'Barbari', weight_kg: 35, gender: 'female', date_of_birth: '2024-01-15' },
  { farmIndex: 4, tag_number: 'GOT-004', species: 'goat', breed: 'Sirohi', weight_kg: 42, gender: 'female', date_of_birth: '2023-08-20' },
  { farmIndex: 4, tag_number: 'GOT-005', species: 'goat', breed: 'Beetal', weight_kg: 50, gender: 'male', date_of_birth: '2023-05-10' },
];

// ─── SEED FUNCTION ───
async function seed() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected.\n');

    // Disable FK checks for truncation
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Clear existing data
    console.log('Clearing existing data...');
    await Alert.destroy({ where: {}, truncate: true });
    await RiskAssessment.destroy({ where: {}, truncate: true });
    await AmuLog.destroy({ where: {}, truncate: true });
    await Animal.destroy({ where: {}, truncate: true });
    await Farm.destroy({ where: {}, truncate: true });
    await Drug.destroy({ where: {}, truncate: true });
    await User.destroy({ where: {}, truncate: true });

    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Data cleared.\n');

    // ── 1. USERS ──
    console.log('Creating 6 users...');
    const users = [];
    for (const u of usersData) {
      const user = await User.create(u);
      users.push(user);
      console.log(`  ${user.role}: ${user.name} (${user.email})`);
    }

    // ── 2. FARMS ──
    console.log('\nCreating 5 farms...');
    const farms = [];
    for (const f of farmsData) {
      const farm = await Farm.create({
        name: f.name,
        owner_id: users[f.ownerIndex].id,
        location: f.location,
        district: f.district,
        state: f.state,
        area_acres: f.area_acres,
      });
      farms.push(farm);
      console.log(`  ${farm.name} — ${farm.district} (owner: ${users[f.ownerIndex].name})`);
    }

    // ── 3. ANIMALS ──
    console.log('\nCreating 20 animals...');
    const animals = [];
    for (const a of animalsData) {
      const animal = await Animal.create({
        farm_id: farms[a.farmIndex].id,
        tag_number: a.tag_number,
        species: a.species,
        breed: a.breed,
        weight_kg: a.weight_kg,
        gender: a.gender,
        date_of_birth: a.date_of_birth,
      });
      animals.push(animal);
    }
    console.log(`  Created ${animals.length} animals across all farms.`);

    // ── 4. DRUGS ──
    console.log('\nSeeding 50 veterinary drugs...');
    const drugs = [];
    for (const d of drugsList) {
      const drug = await Drug.create(d);
      drugs.push(drug);
    }
    console.log(`  Seeded ${drugs.length} drugs.`);

    // ── 5. AMU LOGS ──
    console.log('\nCreating 50 AMU log entries...');
    const vets = users.filter(u => u.role === 'vet');

    // Helper: find a seeded drug by name
    const findDrug = (name) => drugs.find(d => d.name === name);
    // Helper: get animals for a farm
    const farmAnimals = (farmIdx) => animals.filter(a => a.farm_id === farms[farmIdx].id);

    // Pick specific drugs for targeted risk scoring
    const criticalDrugs = [
      findDrug('Enrofloxacin'),
      findDrug('Ciprofloxacin Hydrochloride'),
      findDrug('Colistin Sulfate'),
      findDrug('Marbofloxacin'),
    ];
    const mrlDrug = findDrug('Oxytetracycline Dihydrate');     // mrl_limit 0.1
    const overdoseDrug = findDrug('Amoxicillin Trihydrate');    // dosage_per_kg 10.0
    const normalDrugs = [
      findDrug('Penicillin G Procaine'),
      findDrug('Sulfadiazine'),
      findDrug('Fenbendazole'),
      findDrug('Meloxicam'),
      findDrug('Tylosin Tartrate'),
      findDrug('Florfenicol'),
    ];

    const reasons = [
      'Mastitis treatment', 'Respiratory infection', 'Fever and infection',
      'Wound treatment', 'Foot rot', 'Diarrhea', 'Milk fever prophylaxis',
      'Parasite control', 'Post-surgical antibiotic', 'Preventive treatment',
    ];
    const frequencies = ['Once daily', 'Twice daily', 'Every 12 hours', 'Once every 48 hours'];

    // Helper: create one AMU log entry
    async function createLog(farmIdx, drug, animal, user, vet, daysBack, opts = {}) {
      const treatmentDate = daysAgo(daysBack);
      const duration = randomInt(3, 10);
      const endDate = new Date(treatmentDate);
      endDate.setDate(endDate.getDate() + duration);

      let dosage = drug.dosage_per_kg ? drug.dosage_per_kg * Number(animal.weight_kg) : randomInt(5, 50);
      if (opts.overdose) dosage *= 2.5;
      if (opts.mrlViolation) dosage *= 3;

      const withdrawalEndMeat = drug.withdrawal_days_meat
        ? new Date(endDate.getTime() + drug.withdrawal_days_meat * 86400000) : null;
      const withdrawalEndMilk = drug.withdrawal_days_milk && ['cattle', 'buffalo', 'goat'].includes(animal.species)
        ? new Date(endDate.getTime() + drug.withdrawal_days_milk * 86400000) : null;
      const withdrawalEndEgg = drug.withdrawal_days_egg && animal.species === 'poultry'
        ? new Date(endDate.getTime() + drug.withdrawal_days_egg * 86400000) : null;
      const safeSaleDates = [withdrawalEndMeat, withdrawalEndMilk, withdrawalEndEgg].filter(Boolean);
      const safeSaleDate = safeSaleDates.length > 0 ? new Date(Math.max(...safeSaleDates)) : null;

      await AmuLog.create({
        animal_id: animal.id, farm_id: farms[farmIdx].id, drug_id: drug.id,
        user_id: user.id, vet_id: vet.id,
        dosage: Math.round(dosage * 100) / 100,
        dosage_unit: drug.unit || 'mg',
        frequency: pickRandom(frequencies), duration_days: duration,
        reason: pickRandom(reasons),
        treatment_start_date: treatmentDate,
        treatment_end_date: endDate.toISOString().split('T')[0],
        withdrawal_end_date_meat: withdrawalEndMeat ? withdrawalEndMeat.toISOString().split('T')[0] : null,
        withdrawal_end_date_milk: withdrawalEndMilk ? withdrawalEndMilk.toISOString().split('T')[0] : null,
        withdrawal_end_date_egg: withdrawalEndEgg ? withdrawalEndEgg.toISOString().split('T')[0] : null,
        safe_sale_date: safeSaleDate ? safeSaleDate.toISOString().split('T')[0] : null,
        is_overdose: !!opts.overdose, is_mrl_violation: !!opts.mrlViolation, notes: null,
      });
    }

    const fa = [farmAnimals(0), farmAnimals(1), farmAnimals(2), farmAnimals(3), farmAnimals(4)];
    let logCount = 0;

    // ── FARM 0 — Singh Dairy (RED target ≥70) ──
    // 12 treatments in last 30 days (25pts) + 2 MRL (30pts) + 2 overdoses (16pts) + 2 critical (10pts) = 81
    for (let d = 1; d <= 12; d++) {
      const animal = pickRandom(fa[0]);
      const vet = pickRandom(vets);
      if (d <= 2) {
        await createLog(0, criticalDrugs[0], animal, users[0], vet, d, { overdose: true, mrlViolation: true }); logCount++;
      } else if (d <= 4) {
        await createLog(0, criticalDrugs[1], animal, users[0], vet, d, { overdose: true }); logCount++;
      } else if (d <= 6) {
        await createLog(0, criticalDrugs[0], animal, users[0], vet, d); logCount++;
      } else {
        await createLog(0, pickRandom(normalDrugs), animal, users[0], vet, d); logCount++;
      }
    }
    // 3 older entries (31-90 days) for realism
    for (let d = 35; d <= 80; d += 22) {
      await createLog(0, pickRandom(normalDrugs), pickRandom(fa[0]), users[0], pickRandom(vets), d); logCount++;
    }

    // ── FARM 1 — Kaur Poultry (RED target ≥70) ──
    // 10 treatments in last 30 days (25pts) + 1 MRL (15pts) + 2 overdoses (16pts) + 3 critical (15pts) = 71
    for (let d = 2; d <= 11; d++) {
      const animal = pickRandom(fa[1]);
      const vet = pickRandom(vets);
      if (d === 2) {
        await createLog(1, criticalDrugs[2], animal, users[1], vet, d, { mrlViolation: true }); logCount++;
      } else if (d <= 4) {
        await createLog(1, criticalDrugs[3], animal, users[1], vet, d, { overdose: true }); logCount++;
      } else if (d <= 6) {
        await createLog(1, criticalDrugs[1], animal, users[1], vet, d); logCount++;
      } else if (d <= 8) {
        await createLog(1, criticalDrugs[0], animal, users[1], vet, d); logCount++;
      } else {
        await createLog(1, pickRandom(normalDrugs), animal, users[1], vet, d); logCount++;
      }
    }
    // 2 older entries
    for (let d = 40; d <= 70; d += 30) {
      await createLog(1, pickRandom(normalDrugs), pickRandom(fa[1]), users[1], pickRandom(vets), d); logCount++;
    }

    // ── FARM 2 — Green Valley (YELLOW target 31-69) ──
    // 6 treatments in last 30 days (12pts) + 1 MRL (15pts) + 1 critical (5pts) = 32
    for (let d = 3; d <= 8; d++) {
      const animal = pickRandom(fa[2]);
      const vet = pickRandom(vets);
      if (d === 3) {
        await createLog(2, mrlDrug, animal, users[2], vet, d, { mrlViolation: true }); logCount++;
      } else if (d === 4) {
        await createLog(2, criticalDrugs[0], animal, users[2], vet, d); logCount++;
      } else {
        await createLog(2, pickRandom(normalDrugs), animal, users[2], vet, d); logCount++;
      }
    }
    // 4 older entries
    for (let d = 35; d <= 85; d += 14) {
      await createLog(2, pickRandom(normalDrugs), pickRandom(fa[2]), users[2], pickRandom(vets), d); logCount++;
    }

    // ── FARM 3 — Moga Livestock (YELLOW target 31-69) ──
    // 5 treatments in last 30 days (12pts) + 2 overdoses (16pts) + 1 critical (5pts) = 33
    for (let d = 5; d <= 9; d++) {
      const animal = pickRandom(fa[3]);
      const vet = pickRandom(vets);
      if (d <= 6) {
        await createLog(3, overdoseDrug, animal, users[0], vet, d, { overdose: true }); logCount++;
      } else if (d === 7) {
        await createLog(3, criticalDrugs[2], animal, users[0], vet, d); logCount++;
      } else {
        await createLog(3, pickRandom(normalDrugs), animal, users[0], vet, d); logCount++;
      }
    }
    // 3 older entries
    for (let d = 40; d <= 80; d += 20) {
      await createLog(3, pickRandom(normalDrugs), pickRandom(fa[3]), users[0], pickRandom(vets), d); logCount++;
    }

    // ── FARM 4 — Amrit Goat (GREEN target ≤30) ──
    // 2 treatments in last 30 days (5pts) = 5
    await createLog(4, normalDrugs[0], pickRandom(fa[4]), users[2], pickRandom(vets), 10); logCount++;
    await createLog(4, normalDrugs[1], pickRandom(fa[4]), users[2], pickRandom(vets), 20); logCount++;
    // 3 older entries
    for (let d = 45; d <= 85; d += 20) {
      await createLog(4, pickRandom(normalDrugs), pickRandom(fa[4]), users[2], pickRandom(vets), d); logCount++;
    }

    console.log(`  Created ${logCount} AMU log entries (targeted drug assignment).`);

    // ── 6. RISK SCORES ──
    console.log('\nCalculating risk scores for all farms...');
    for (const farm of farms) {
      const result = await updateFarmRiskScore(farm.id);
      console.log(`  ${farm.name}: Score ${result.assessment.score} (${result.assessment.level.toUpperCase()})`);
    }

    // ── SUMMARY ──
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('SEED COMPLETE — Record counts:');
    console.log(`  Users:           ${await User.count()}`);
    console.log(`  Farms:           ${await Farm.count()}`);
    console.log(`  Animals:         ${await Animal.count()}`);
    console.log(`  Drugs:           ${await Drug.count()}`);
    console.log(`  AMU Logs:        ${await AmuLog.count()}`);
    console.log(`  Risk Assessments:${await RiskAssessment.count()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('DEMO ACCOUNTS:');
    console.log('  Email                          | Role   | Password');
    console.log('  -------------------------------|--------|---------');
    for (const u of usersData) {
      console.log(`  ${u.email.padEnd(30)} | ${u.role.padEnd(6)} | ${DEMO_PASSWORD}`);
    }
    console.log('');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await sequelize.close();
    process.exit(1);
  }
}

seed();
