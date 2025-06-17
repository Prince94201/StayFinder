require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');

const seed = async () => {
  await mongoose.connect(process.env.DB_CONNECTION);

  await User.deleteMany();
  await Listing.deleteMany();

  const host = await User.create({
    email: 'host@example.com',
    password: 'hostpass',
    name: 'Host User',
    phone: '1234567890',
    role: 'host'
  });

  const guest = await User.create({
    email: 'guest@example.com',
    password: 'guestpass',
    name: 'Guest User',
    phone: '0987654321',
    role: 'guest'
  });

  const listings = [
    {
      title: 'Cozy Apartment',
      description: 'A nice place in the city center.',
      price: 100,
      location: 'New York',
      images: ['https://images.unsplash.com/photo-1737600358169-e39bab47af14'],
      amenities: ['WiFi', 'Kitchen'],
      hostId: host._id,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1
    },
    {
      title: 'Beach House',
      description: 'Enjoy the sea breeze.',
      price: 200,
      location: 'Miami',
      images: ['https://images.unsplash.com/photo-1740479948645-3eb39a64e843'],
      amenities: ['Pool', 'Parking'],
      hostId: host._id,
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2
    },
    {
      title: 'Mountain Cabin',
      description: 'Perfect for a getaway.',
      price: 150,
      location: 'Denver',
      images: ['https://plus.unsplash.com/premium_photo-1734549547989-805c0885dd9c'],
      amenities: ['Fireplace', 'Hiking Trails'],
      hostId: host._id,
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 1
    },
    {
      title: 'Luxury Villa',
      description: 'Live like a king.',
      price: 500,
      location: 'Los Angeles',
      images: ['https://images.unsplash.com/photo-1661211084935-02ac9ec419cc'],
      amenities: ['Spa', 'Gym'],
      hostId: host._id,
      maxGuests: 10,
      bedrooms: 5,
      bathrooms: 4
    },
    {
      title: 'Downtown Studio',
      description: 'Compact and convenient.',
      price: 80,
      location: 'Chicago',
      images: ['https://plus.unsplash.com/premium_photo-1661853413809-6be6bed796d9'],
      amenities: ['WiFi', 'Washer'],
      hostId: host._id,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1
    }
  ];

  await Listing.insertMany(listings);

  console.log('Seed data inserted');
  process.exit();
};

seed();
