const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Orphanage = require('./models/Orphanage');

// Load env vars
dotenv.config();

// Andhra Pradesh Orphanages Dataset - BLACKBOXAI Enhanced (24 locations)
const orphanagesData = [
  {
    name: "Sunrise Children Home",
    city: "Tirupati",
    phone: "9123456780",
    address: "Leela Mahal Circle, Tirupati",
    lat: 13.6355,
    lng: 79.4237
  },
  {
    name: "Sai Ananda Orphanage",
    city: "Tirupati",
    phone: "9345678901",
    address: "KT Road, Tirupati",
    lat: 13.6281,
    lng: 79.4198
  },
  {
    name: "Little Hearts Shelter",
    city: "Puttur",
    phone: "9012345678",
    address: "Railway Station Road, Puttur",
    lat: 13.4418,
    lng: 79.5532
  },
  {
    name: "Grace Children Care",
    city: "Puttur",
    phone: "9876543210",
    address: "Bazaar Street, Puttur",
    lat: 13.4439,
    lng: 79.5501
  },
  {
    name: "Hope Nest Home",
    city: "Vijayawada",
    phone: "9988776655",
    address: "Benz Circle, Vijayawada",
    lat: 16.5062,
    lng: 80.648
  },
  {
    name: "Good Shepherd Orphanage",
    city: "Vijayawada",
    phone: "9556677889",
    address: "Patamata, Vijayawada",
    lat: 16.5033,
    lng: 80.6465
  },
  {
    name: "Bright Future Home",
    city: "Guntur",
    phone: "9445566778",
    address: "Arundelpet, Guntur",
    lat: 16.3067,
    lng: 80.4365
  },
  {
    name: "Mother Care Shelter",
    city: "Guntur",
    phone: "9001122334",
    address: "Brodipet, Guntur",
    lat: 16.2991,
    lng: 80.4376
  },
  {
    name: "Helping Angels Home",
    city: "Nellore",
    phone: "9334455667",
    address: "Magunta Layout, Nellore",
    lat: 14.4426,
    lng: 79.9865
  },
  {
    name: "Mercy Children Trust",
    city: "Nellore",
    phone: "9112233445",
    address: "Stonehousepet, Nellore",
    lat: 14.4492,
    lng: 79.9841
  },
  {
    name: "New Life Kids Home",
    city: "Kurnool",
    phone: "9223344556",
    address: "Nandyal Road, Kurnool",
    lat: 15.8281,
    lng: 78.0373
  },
  {
    name: "Shalom Orphan Care",
    city: "Kurnool",
    phone: "9887766554",
    address: "Budhawarpet, Kurnool",
    lat: 15.8304,
    lng: 78.0412
  },
  {
    name: "Happy Hearts Foundation",
    city: "Chittoor",
    phone: "9665544332",
    address: "Palamaner Road, Chittoor",
    lat: 13.2172,
    lng: 79.1003
  },
  {
    name: "Divine Children Shelter",
    city: "Chittoor",
    phone: "9776655443",
    address: "Greamspet, Chittoor",
    lat: 13.2108,
    lng: 79.0974
  },
  {
    name: "Care & Share Home",
    city: "Anantapur",
    phone: "9898989898",
    address: "Ramnagar, Anantapur",
    lat: 14.6819,
    lng: 77.6006
  },
  {
    name: "Joyful Kids Orphanage",
    city: "Anantapur",
    phone: "9787878787",
    address: "Clock Tower Area, Anantapur",
    lat: 14.6765,
    lng: 77.5931
  },
  {
    name: "Blessed Hope Home",
    city: "Rajahmundry",
    phone: "9676767676",
    address: "Danavaipeta, Rajahmundry",
    lat: 17.0005,
    lng: 81.804
  },
  {
    name: "Child Smile Shelter",
    city: "Rajahmundry",
    phone: "9565656565",
    address: "Tilak Road, Rajahmundry",
    lat: 17.0021,
    lng: 81.7895
  },
  {
    name: "Tender Hearts Home",
    city: "Visakhapatnam",
    phone: "9454545454",
    address: "MVP Colony, Visakhapatnam",
    lat: 17.726,
    lng: 83.3152
  },
  {
    name: "Seaside Children Care",
    city: "Visakhapatnam",
    phone: "9343434343",
    address: "Maddilapalem, Visakhapatnam",
    lat: 17.7421,
    lng: 83.3178
  },
  {
    name: "Rainbow Kids Home",
    city: "Kadapa",
    phone: "9232323232",
    address: "RTC Bus Stand Road, Kadapa",
    lat: 14.4673,
    lng: 78.8242
  },
  {
    name: "Shelter of Love",
    city: "Kadapa",
    phone: "9121212121",
    address: "YV Street, Kadapa",
    lat: 14.4741,
    lng: 78.8296
  },
  {
    name: "Helping Minds Foundation",
    city: "Ongole",
    phone: "9010101010",
    address: "Trunk Road, Ongole",
    lat: 15.5057,
    lng: 80.0499
  },
  {
    name: "Care Home for Children",
    city: "Ongole",
    phone: "9909090909",
    address: "Kurnool Road, Ongole",
    lat: 15.5082,
    lng: 80.0444
  }
];

async function seedOrphanages() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log('✅ MongoDB Connected - Seeding Andhra Pradesh Orphanages');

    // Clear existing (reset for clean seed)
    await Orphanage.deleteMany({});
    console.log('🗑️ Cleared previous data');

    // Bulk insert 24 orphanages
    const seeded = await Orphanage.insertMany(orphanagesData);
    console.log(`✅ Successfully seeded ${seeded.length} orphanages!`);

    // Stats
    const stats = await Orphanage.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('📊 City Distribution:', JSON.stringify(stats, null, 2));

    console.log('🚀 Ready! Run `node server.js` to test API');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
}

seedOrphanages();

