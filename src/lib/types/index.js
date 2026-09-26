/**
 * @fileoverview  Shared data types / shapes for the real-estate + hotel platform.
 * Written as JSDoc so they work in plain JavaScript and are IDE-friendly.
 * Replace with TypeScript interfaces when migrating to .ts.
 */

// ─── SHARED ─────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Location
 * @property {string} address
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} [zip]
 * @property {number} [lat]
 * @property {number} [lng]
 */

/**
 * @typedef {Object} Image
 * @property {string} src
 * @property {string} alt
 * @property {boolean} [primary]
 */

/**
 * @typedef {Object} Review
 * @property {string}  id
 * @property {string}  authorName
 * @property {string}  authorAvatar
 * @property {number}  rating        — 1-5
 * @property {string}  comment
 * @property {string}  date          — ISO date string
 */

// ─── AGENT ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Agent
 * @property {string} id
 * @property {string} name
 * @property {string} photo
 * @property {string} phone
 * @property {string} email
 * @property {number} [listingCount]
 * @property {number} [yearsExperience]
 */

// ─── PROPERTY ────────────────────────────────────────────────────────────────

/**
 * @typedef {'apartment'|'house'|'villa'|'penthouse'|'studio'|'duplex'|'land'|'commercial'} PropertyType
 */

/**
 * @typedef {'sale'|'rent'|'short-let'} ListingType
 */

/**
 * @typedef {Object} PropertyAmenity
 * @property {string} icon   — name/identifier for the icon
 * @property {string} label
 */

/**
 * @typedef {Object} Property
 * @property {string}           id
 * @property {string}           slug
 * @property {string}           title
 * @property {string}           description
 * @property {Location}         location
 * @property {number}           price
 * @property {'NGN'|'USD'|'GBP'|'EUR'} currency
 * @property {string}           [pricePeriod]   — e.g. "/month", "/year"
 * @property {PropertyType}     propertyType
 * @property {ListingType}      listingType
 * @property {number}           bedrooms
 * @property {number}           bathrooms
 * @property {number}           area            — in sqm
 * @property {Image[]}          images
 * @property {PropertyAmenity[]} amenities
 * @property {string[]}         features
 * @property {boolean}          featured
 * @property {boolean}          recent
 * @property {Agent}            agent
 * @property {string}           createdAt       — ISO date string
 * @property {number}           [yearBuilt]
 * @property {string}           [parkingSpaces]
 */

// ─── HOTEL ───────────────────────────────────────────────────────────────────

/**
 * @typedef {'hotel'|'resort'|'boutique'|'aparthotel'|'villa'|'lodge'} HotelType
 */

/**
 * @typedef {Object} HotelAmenity
 * @property {string} icon
 * @property {string} label
 * @property {boolean} [highlight]
 */

/**
 * @typedef {Object} RoomAmenity
 * @property {string} icon
 * @property {string} label
 */

/**
 * @typedef {'king'|'queen'|'twin'|'single'|'double'|'bunk'} BedType
 */

/**
 * @typedef {Object} Room
 * @property {string}       id
 * @property {string}       hotelId
 * @property {string}       name
 * @property {string}       description
 * @property {Image[]}      images
 * @property {BedType}      bedType
 * @property {number}       bedCount
 * @property {number}       maxGuests
 * @property {number}       size          — sqm
 * @property {RoomAmenity[]} amenities
 * @property {number}       pricePerNight
 * @property {'NGN'|'USD'|'GBP'|'EUR'} currency
 * @property {boolean}      breakfastIncluded
 * @property {boolean}      freeCancellation
 * @property {number}       availableRooms
 * @property {string}       [view]
 */

/**
 * @typedef {Object} HotelPolicy
 * @property {string} checkIn
 * @property {string} checkOut
 * @property {string} cancellation
 * @property {string} [children]
 * @property {string} [pets]
 * @property {string} [smoking]
 */

/**
 * @typedef {Object} Hotel
 * @property {string}         id
 * @property {string}         slug
 * @property {string}         name
 * @property {string}         description
 * @property {HotelType}      hotelType
 * @property {Location}       location
 * @property {number}         starRating    — 1-5
 * @property {number}         guestRating   — 0-10
 * @property {number}         reviewCount
 * @property {Image[]}        images
 * @property {HotelAmenity[]} amenities
 * @property {Room[]}         rooms
 * @property {HotelPolicy}    policies
 * @property {Review[]}       reviews
 * @property {boolean}        featured
 * @property {number}         priceFrom     — lowest room price
 * @property {'NGN'|'USD'|'GBP'|'EUR'} currency
 * @property {string[]}       [nearbyAttractions]
 */

// ─── BOOKING ──────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} Guest
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} phone
 * @property {string} [specialRequests]
 */

/**
 * @typedef {'pending'|'confirmed'|'cancelled'|'completed'} BookingStatus
 */

/**
 * @typedef {Object} Booking
 * @property {string}        id
 * @property {string}        hotelId
 * @property {string}        roomId
 * @property {Guest}         guest
 * @property {string}        checkIn     — ISO date
 * @property {string}        checkOut    — ISO date
 * @property {number}        nights
 * @property {number}        guests
 * @property {number}        rooms
 * @property {number}        pricePerNight
 * @property {number}        subtotal
 * @property {number}        taxes
 * @property {number}        serviceFee
 * @property {number}        total
 * @property {'NGN'|'USD'|'GBP'|'EUR'} currency
 * @property {BookingStatus} status
 * @property {string}        createdAt
 * @property {string}        [reference]
 */

export {};
