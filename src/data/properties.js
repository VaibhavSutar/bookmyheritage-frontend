export const propertyTypes = {
  HOTEL: "hotel",
  VILLA: "villa",
  RESORT: "resort",
  APARTMENT: "apartment",
  BOUTIQUE: "boutique",
  GUESTHOUSE: "guesthouse",
};

export const amenities = {
  WIFI: "wifi",
  POOL: "pool",
  SPA: "spa",
  GYM: "gym",
  RESTAURANT: "restaurant",
  BAR: "bar",
  PARKING: "parking",
  ROOM_SERVICE: "roomService",
  BEACH_ACCESS: "beachAccess",
  MOUNTAIN_VIEW: "mountainView",
  KITCHEN: "kitchen",
  AIR_CONDITIONING: "airConditioning",
  PET_FRIENDLY: "petFriendly",
  FAMILY_FRIENDLY: "familyFriendly",
};

import {collection, getDocs,getDoc ,doc} from "firebase/firestore";
import { db } from "../firebase/config";
// Firebase configuration
// Initialize Firebase
// Fetch data from the 'places' collection
export const fetchPlaces = async () => {
  const placesCollection = collection(db, "places");
  const snapshot = await getDocs(placesCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export const fetchPlaceById = async (docId) => {
  try {
    const placeRef = doc(db, "places", docId);
    const placeSnap = await getDoc(placeRef);
    if (placeSnap.exists()) {
      return { id: placeSnap.id, ...placeSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching place:", error);
    return null;
  }
};

export const properties = [
  {
    id: "luxury-beach-resort",
    name: "Luxury Beach Resort & Spa",
    type: propertyTypes.RESORT,
    location: {
      city: "Maldives",
      country: "Maldives",
      coordinates: { lat: 4.1755, lng: 73.5093 },
    },
    description:
      "Experience ultimate luxury in our overwater villas with private pools and direct ocean access.",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    ],
    price: {
      base: 1200,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 458,
    amenities: [
      amenities.POOL,
      amenities.SPA,
      amenities.BEACH_ACCESS,
      amenities.RESTAURANT,
      amenities.WIFI,
      amenities.ROOM_SERVICE,
    ],
    featured: true,
  },
  {
    id: "mountain-view-lodge",
    name: "Alpine Mountain Lodge",
    type: propertyTypes.HOTEL,
    location: {
      city: "Zermatt",
      country: "Switzerland",
      coordinates: { lat: 46.0207, lng: 7.7491 },
    },
    description:
      "Stunning mountain lodge with panoramic views of the Matterhorn and luxury spa facilities.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd",
      "https://images.unsplash.com/photo-1548704806-074b6d4e5e05",
    ],
    price: {
      base: 800,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 325,
    amenities: [
      amenities.MOUNTAIN_VIEW,
      amenities.SPA,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.WIFI,
    ],
    featured: true,
  },
  {
    id: "tuscany-villa",
    name: "Villa Toscana",
    type: propertyTypes.VILLA,
    location: {
      city: "Florence",
      country: "Italy",
      coordinates: { lat: 43.7696, lng: 11.2558 },
    },
    description:
      "Historic Tuscan villa surrounded by vineyards with private pool and authentic Italian charm.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1542928658-22251e208ac1",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d",
    ],
    price: {
      base: 950,
      currency: "USD",
    },
    rating: 4.7,
    reviews: 189,
    amenities: [
      amenities.POOL,
      amenities.KITCHEN,
      amenities.WIFI,
      amenities.PARKING,
      amenities.AIR_CONDITIONING,
    ],
    featured: true,
  },
  {
    id: "santorini-boutique",
    name: "Santorini Grace",
    type: propertyTypes.BOUTIQUE,
    location: {
      city: "Oia",
      country: "Greece",
      coordinates: { lat: 36.4618, lng: 25.3753 },
    },
    description:
      "Exclusive boutique hotel carved into Santorini's caldera with infinity pools and sunset views.",
    images: [
      "https://images.unsplash.com/photo-1570213489059-0aac6626cade",
      "https://images.unsplash.com/photo-1455587734955-081b22074882",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f",
    ],
    price: {
      base: 1100,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 276,
    amenities: [
      amenities.POOL,
      amenities.SPA,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.WIFI,
    ],
    featured: true,
  },
  {
    id: "bali-villa-retreat",
    name: "Ubud Villa Retreat",
    type: propertyTypes.VILLA,
    location: {
      city: "Ubud",
      country: "Indonesia",
      coordinates: { lat: -8.5069, lng: 115.2625 },
    },
    description:
      "Secluded luxury villa in the heart of Bali's cultural center with private pool and rice field views.",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      "https://images.unsplash.com/photo-1586375300773-8384e3e4916f",
      "https://images.unsplash.com/photo-1545579133-99bb5ab189bd",
    ],
    price: {
      base: 450,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 234,
    amenities: [
      amenities.POOL,
      amenities.SPA,
      amenities.WIFI,
      amenities.AIR_CONDITIONING,
      amenities.ROOM_SERVICE,
    ],
    featured: true,
  },
  {
    id: "dubai-luxury-resort",
    name: "Palm Jumeirah Resort",
    type: propertyTypes.RESORT,
    location: {
      city: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.1124, lng: 55.139 },
    },
    description:
      "Opulent beachfront resort with spectacular views of the Arabian Gulf and Dubai skyline.",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    ],
    price: {
      base: 1500,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 512,
    amenities: [
      amenities.POOL,
      amenities.SPA,
      amenities.GYM,
      amenities.BEACH_ACCESS,
      amenities.RESTAURANT,
      amenities.BAR,
    ],
    featured: true,
  },
  {
    id: "kyoto-ryokan",
    name: "Traditional Kyoto Ryokan",
    type: propertyTypes.BOUTIQUE,
    location: {
      city: "Kyoto",
      country: "Japan",
      coordinates: { lat: 35.0116, lng: 135.7681 },
    },
    description:
      "Experience authentic Japanese hospitality in this traditional ryokan with tatami rooms, onsen baths, and kaiseki dining.",
    images: [
      "https://images.unsplash.com/photo-1578469645742-46cae010e5d4",
      "https://images.unsplash.com/photo-1542640244-7e672d6cef4e",
      "https://images.unsplash.com/photo-1553621042-f6e147245754",
    ],
    price: {
      base: 450,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 287,
    amenities: [
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.AIR_CONDITIONING,
      amenities.ROOM_SERVICE,
    ],
    featured: true,
  },
  {
    id: "paris-luxury-apartment",
    name: "Champs-Élysées Luxury Apartment",
    type: propertyTypes.APARTMENT,
    location: {
      city: "Paris",
      country: "France",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    description:
      "Elegant Parisian apartment with stunning Eiffel Tower views and classic French architecture.",
    images: [
      "https://images.unsplash.com/photo-1549638441-b787d2e11f14",
      "https://images.unsplash.com/photo-1551105378-78e609e1d468",
      "https://images.unsplash.com/photo-1556912998-c57cc6b63cd7",
    ],
    price: {
      base: 750,
      currency: "USD",
    },
    rating: 4.6,
    reviews: 156,
    amenities: [
      amenities.WIFI,
      amenities.KITCHEN,
      amenities.AIR_CONDITIONING,
      amenities.PARKING,
    ],
    featured: true,
  },
  {
    id: "african-safari-lodge",
    name: "Serengeti Safari Lodge",
    type: propertyTypes.RESORT,
    location: {
      city: "Serengeti",
      country: "Tanzania",
      coordinates: { lat: -2.3333, lng: 34.8333 },
    },
    description:
      "Luxury tented camp in the heart of the Serengeti with private game drives and bush dining.",
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      "https://images.unsplash.com/photo-1553653924-39b70295f8da",
    ],
    price: {
      base: 1800,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 145,
    amenities: [
      amenities.POOL,
      amenities.RESTAURANT,
      amenities.WIFI,
      amenities.AIR_CONDITIONING,
    ],
    featured: true,
  },
  {
    id: "iceland-eco-lodge",
    name: "Northern Lights Eco Lodge",
    type: propertyTypes.BOUTIQUE,
    location: {
      city: "Reykjavik",
      country: "Iceland",
      coordinates: { lat: 64.147, lng: -21.9408 },
    },
    description:
      "Sustainable eco-lodge with glass roof for aurora viewing and geothermal hot springs.",
    images: [
      "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f0",
      "https://images.unsplash.com/photo-1517823382935-7c809c684223",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    ],
    price: {
      base: 900,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 203,
    amenities: [
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.MOUNTAIN_VIEW,
    ],
    featured: true,
  },
  {
    id: "santorini-villa",
    name: "Santorini Cliffside Villa",
    type: propertyTypes.VILLA,
    location: {
      city: "Oia",
      country: "Greece",
      coordinates: { lat: 36.4618, lng: 25.3753 },
    },
    description:
      "Stunning white-washed villa perched on the cliffs of Santorini with private infinity pool and breathtaking sunset views over the Aegean Sea.",
    images: [
      "https://images.unsplash.com/photo-1570733577524-3a047079e80d",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e",
      "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f",
    ],
    price: {
      base: 950,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 342,
    amenities: [
      amenities.POOL,
      amenities.WIFI,
      amenities.AIR_CONDITIONING,
      amenities.KITCHEN,
    ],
    featured: true,
  },
  {
    id: "marrakech-riad",
    name: "Luxury Marrakech Riad",
    type: propertyTypes.BOUTIQUE,
    location: {
      city: "Marrakech",
      country: "Morocco",
      coordinates: { lat: 31.6295, lng: -7.9811 },
    },
    description:
      "Traditional Moroccan riad with central courtyard, plunge pool, and rooftop terrace in the heart of the historic Medina.",
    images: [
      "https://images.unsplash.com/photo-1548018560-c7196548e84d",
      "https://images.unsplash.com/photo-1539758462369-43adaa19bc1f",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    ],
    price: {
      base: 380,
      currency: "USD",
    },
    rating: 4.7,
    reviews: 215,
    amenities: [
      amenities.POOL,
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.AIR_CONDITIONING,
      amenities.ROOM_SERVICE,
    ],
    featured: false,
  },
  {
    id: "sydney-harbor-apartment",
    name: "Sydney Harbor View Apartment",
    type: propertyTypes.APARTMENT,
    location: {
      city: "Sydney",
      country: "Australia",
      coordinates: { lat: -33.8568, lng: 151.2153 },
    },
    description:
      "Modern luxury apartment with panoramic views of Sydney Harbor, Opera House, and Harbor Bridge.",
    images: [
      "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
      "https://images.unsplash.com/photo-1556784344-ad913a7d0a8b",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0",
    ],
    price: {
      base: 550,
      currency: "USD",
    },
    rating: 4.6,
    reviews: 189,
    amenities: [
      amenities.WIFI,
      amenities.AIR_CONDITIONING,
      amenities.KITCHEN,
      amenities.GYM,
    ],
    featured: false,
  },
  {
    id: "rio-beachfront-resort",
    name: "Copacabana Beachfront Resort",
    type: propertyTypes.RESORT,
    location: {
      city: "Rio de Janeiro",
      country: "Brazil",
      coordinates: { lat: -22.9068, lng: -43.1729 },
    },
    description:
      "Luxurious beachfront resort with direct access to Copacabana Beach, rooftop infinity pool, and stunning views of Sugarloaf Mountain.",
    images: [
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    ],
    price: {
      base: 680,
      currency: "USD",
    },
    rating: 4.7,
    reviews: 276,
    amenities: [
      amenities.POOL,
      amenities.BEACH_ACCESS,
      amenities.SPA,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.WIFI,
      amenities.ROOM_SERVICE,
    ],
    featured: true,
  },
  {
    id: "safari-lodge-kenya",
    name: "Maasai Mara Safari Lodge",
    type: propertyTypes.RESORT,
    location: {
      city: "Maasai Mara",
      country: "Kenya",
      coordinates: { lat: -1.5066, lng: 35.1245 },
    },
    description:
      "Authentic safari lodge with luxury tented accommodations offering panoramic views of the savanna and wildlife.",
    images: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e",
      "https://images.unsplash.com/photo-1504871881170-d7a31e1f0f1f",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
    ],
    price: {
      base: 890,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 198,
    amenities: [
      amenities.RESTAURANT,
      amenities.WIFI,
      amenities.ROOM_SERVICE,
      amenities.AIR_CONDITIONING,
    ],
    featured: true,
  },
  {
    id: "new-york-luxury-hotel",
    name: "Manhattan Skyline Hotel",
    type: propertyTypes.HOTEL,
    location: {
      city: "New York",
      country: "United States",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    description:
      "Upscale hotel in the heart of Manhattan with stunning city views, rooftop bar, and premium amenities.",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8",
    ],
    price: {
      base: 750,
      currency: "USD",
    },
    rating: 4.6,
    reviews: 412,
    amenities: [
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.GYM,
      amenities.ROOM_SERVICE,
      amenities.AIR_CONDITIONING,
    ],
    featured: false,
  },
  {
    id: "dubai-palm-resort",
    name: "Palm Jumeirah Luxury Resort",
    type: propertyTypes.RESORT,
    location: {
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: { lat: 25.1124, lng: 55.139 },
    },
    description:
      "Opulent beachfront resort on Palm Jumeirah with private beach, multiple infinity pools, and spectacular views of the Dubai skyline.",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6",
      "https://images.unsplash.com/photo-1630460550971-7c7683e26233",
    ],
    price: {
      base: 1100,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 356,
    amenities: [
      amenities.POOL,
      amenities.BEACH_ACCESS,
      amenities.SPA,
      amenities.GYM,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.ROOM_SERVICE,
      amenities.AIR_CONDITIONING,
    ],
    featured: true,
  },
  {
    id: "bali-jungle-villa",
    name: "Ubud Jungle Retreat",
    type: propertyTypes.VILLA,
    location: {
      city: "Ubud",
      country: "Indonesia",
      coordinates: { lat: -8.5069, lng: 115.2625 },
    },
    description:
      "Secluded villa nestled in the lush jungles of Ubud with private infinity pool overlooking rice terraces and tropical forest.",
    images: [
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f",
      "https://images.unsplash.com/photo-1535827841776-24afc1e255ac",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    ],
    price: {
      base: 420,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 278,
    amenities: [
      amenities.POOL,
      amenities.WIFI,
      amenities.SPA,
      amenities.RESTAURANT,
      amenities.AIR_CONDITIONING,
    ],
    featured: true,
  },
  {
    id: "iceland-northern-lights",
    name: "Northern Lights Glass Lodge",
    type: propertyTypes.BOUTIQUE,
    location: {
      city: "Reykjavik",
      country: "Iceland",
      coordinates: { lat: 64.1466, lng: -21.9426 },
    },
    description:
      "Unique glass-ceiling lodge offering unobstructed views of the Northern Lights and Icelandic wilderness from your bed.",
    images: [
      "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f0",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
      "https://images.unsplash.com/photo-1548123378-bde4eca81d2d",
    ],
    price: {
      base: 780,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 187,
    amenities: [
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.AIR_CONDITIONING,
      amenities.MOUNTAIN_VIEW,
    ],
    featured: true,
  },
  {
    id: "paris-luxury-apartment",
    name: "Champs-Élysées Luxury Apartment",
    type: propertyTypes.APARTMENT,
    location: {
      city: "Paris",
      country: "France",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    description:
      "Elegant Parisian apartment with balcony views of the Eiffel Tower, located steps from the famous Champs-Élysées boulevard.",
    images: [
      "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
      "https://images.unsplash.com/photo-1551632811-561732d1e306",
    ],
    price: {
      base: 650,
      currency: "USD",
    },
    rating: 4.7,
    reviews: 231,
    amenities: [amenities.WIFI, amenities.KITCHEN, amenities.AIR_CONDITIONING],
    featured: false,
  },
  {
    id: "cape-town-beachfront",
    name: "Camps Bay Beach Villa",
    type: propertyTypes.VILLA,
    location: {
      city: "Cape Town",
      country: "South Africa",
      coordinates: { lat: -33.9249, lng: 18.4241 },
    },
    description:
      "Stunning beachfront villa with panoramic views of the Atlantic Ocean and Table Mountain, featuring a private pool and direct beach access.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    ],
    price: {
      base: 820,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 195,
    amenities: [
      amenities.POOL,
      amenities.BEACH_ACCESS,
      amenities.WIFI,
      amenities.KITCHEN,
      amenities.AIR_CONDITIONING,
      amenities.MOUNTAIN_VIEW,
    ],
    featured: true,
  },
  {
    id: "venice-canal-apartment",
    name: "Grand Canal Palazzo",
    type: propertyTypes.APARTMENT,
    location: {
      city: "Venice",
      country: "Italy",
      coordinates: { lat: 45.4408, lng: 12.3155 },
    },
    description:
      "Historic palazzo apartment with private terrace overlooking the Grand Canal, featuring original Venetian architecture and modern luxury amenities.",
    images: [
      "https://images.unsplash.com/photo-1534412638304-75a82bff35af",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
    ],
    price: {
      base: 720,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 203,
    amenities: [amenities.WIFI, amenities.AIR_CONDITIONING, amenities.KITCHEN],
    featured: false,
  },
  {
    id: "tokyo-skyscraper-hotel",
    name: "Tokyo Skyline Hotel",
    type: propertyTypes.HOTEL,
    location: {
      city: "Tokyo",
      country: "Japan",
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    description:
      "Ultra-modern hotel in a Tokyo skyscraper with panoramic city views, robot concierge, and cutting-edge technology in every room.",
    images: [
      "https://images.unsplash.com/photo-1480796927426-f609979314bd",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
    ],
    price: {
      base: 580,
      currency: "USD",
    },
    rating: 4.7,
    reviews: 342,
    amenities: [
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.GYM,
      amenities.SPA,
      amenities.ROOM_SERVICE,
      amenities.AIR_CONDITIONING,
    ],
    featured: true,
  },
  {
    id: "amazon-jungle-lodge",
    name: "Amazon Rainforest Eco-Lodge",
    type: propertyTypes.RESORT,
    location: {
      city: "Manaus",
      country: "Brazil",
      coordinates: { lat: -3.119, lng: -60.0217 },
    },
    description:
      "Sustainable eco-lodge built on stilts in the Amazon rainforest, offering guided jungle tours, wildlife watching, and authentic local cuisine.",
    images: [
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86",
      "https://images.unsplash.com/photo-1536768139911-e290a5261b40",
      "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5",
    ],
    price: {
      base: 490,
      currency: "USD",
    },
    rating: 4.8,
    reviews: 156,
    amenities: [
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.AIR_CONDITIONING,
      amenities.FAMILY_FRIENDLY,
    ],
    featured: true,
  },
  {
    id: "scottish-highlands-castle",
    name: "Highland Castle Estate",
    type: propertyTypes.BOUTIQUE,
    location: {
      city: "Inverness",
      country: "Scotland",
      coordinates: { lat: 57.4778, lng: -4.2247 },
    },
    description:
      "Historic 16th-century castle converted into a luxury hotel, set on 200 acres of Highland estate with loch views and traditional Scottish hospitality.",
    images: [
      "https://images.unsplash.com/photo-1533050487297-09b450131914",
      "https://images.unsplash.com/photo-1574236170880-75fa74132d6c",
      "https://images.unsplash.com/photo-1601560496309-911d23cf9db5",
    ],
    price: {
      base: 850,
      currency: "USD",
    },
    rating: 4.9,
    reviews: 178,
    amenities: [
      amenities.WIFI,
      amenities.RESTAURANT,
      amenities.BAR,
      amenities.MOUNTAIN_VIEW,
      amenities.PET_FRIENDLY,
    ],
    featured: true,
  },
];

export const getPropertyById = (id) => {
  return properties.find((property) => property.id === id);
};

export const getPropertiesByType = (type) => {
  return properties.filter((property) => property.type === type);
};

export const getFeaturedProperties = () => {
  return properties.filter((property) => property.featured);
};

export const searchProperties = (query) => {
  const searchTerm = query.toLowerCase();
  return properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm) ||
      property.location.city.toLowerCase().includes(searchTerm) ||
      property.location.country.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm)
  );
};

export const filterPropertiesByAmenities = (amenitiesList) => {
  return properties.filter((property) =>
    amenitiesList.every((amenity) => property.amenities.includes(amenity))
  );
};
