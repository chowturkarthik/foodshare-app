const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Orphanage = require('./models/Orphanage');

// Load env vars
dotenv.config();

// Sample orphanages for Andhra Pradesh
const sampleOrphanages = [
  {
    name: 'Balaji Orphanage',
    city: 'Tirupati',
    phone: '9848023456',
    address: 'Near Kapada Road, Tirupati, AP 517501'
  },
  {
    name: 'Sai Baba Orphanage',
    city: 'Puttur',
    phone: '8912345678',
    address: 'Karvetinagar Road, Puttur, AP 517583'
  },
  {
    name: 'Mother Teresa Home',
    city: 'Tirupati',
    phone: '8765432109',
    address: 'Renigunta Road, Tirupati, AP 517501'
  },
  {
    name: 'Annamacharya Orphanage',
    city: 'Kadapa',
    phone: '7654321980',
    address: 'Mydukur Road, Kadapa, AP 516003'
  },
  {
    name: 'Little Flowers Orphanage',
    city: 'Puttur',
    phone: '6543210987',
    address: 'Naidupeta Road, Puttur, AP 517583'
  }
];

async function seedOrphanages() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to append)
    await Orphanage.deleteMany({});
    console.log('🗑️ Cleared existing orphanages');

    // Insert samples
    await Orphanage.insertMany(sampleOrphanages);
    console.log(`✅ Seeded ${sampleOrphanages.length} orphanages successfully!`);

    // Verify
    const count = await Orphanage.countDocuments();
    console.log(`📊 Total orphanages in DB: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedOrphanages();

