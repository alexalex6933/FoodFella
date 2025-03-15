export interface User {
  id: string;
  email: string;
  password: string;
  type: 'customer' | 'merchant';
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  rating: number;
  cuisineType: string[];
  merchantId: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  available: boolean;
  isMysteryBag: boolean;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'customer@example.com',
    password: 'password123',
    type: 'customer'
  },
  {
    id: '2',
    email: 'merchant@example.com',
    password: 'password123',
    type: 'merchant'
  }
];

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Garden Cafe',
    description: 'Sustainable cafe offering fresh, local ingredients',
    address: '123 Green St, Sydney',
    coordinates: {
      lat: -33.8688,
      lng: 151.2093
    },
    image: 'https://images.unsplash.com/photo-1564759224907-65b945ff0e84',
    rating: 4.5,
    cuisineType: ['Cafe', 'Healthy', 'Vegetarian'],
    merchantId: '2'
  },
  {
    id: '2',
    name: 'Eco Bites',
    description: 'Zero-waste restaurant with daily specials',
    address: '456 Eco Lane, Sydney',
    coordinates: {
      lat: -33.8712,
      lng: 151.2046
    },
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9',
    rating: 4.8,
    cuisineType: ['Modern', 'Sustainable', 'Local'],
    merchantId: '2'
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Mystery Lunch Bag',
    description: 'A surprise selection of our daily specials',
    price: 25.00,
    discountedPrice: 12.50,
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false
    },
    available: true,
    isMysteryBag: true
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Surplus Salad Bowl',
    description: 'Fresh daily salad made from surplus produce',
    price: 18.00,
    discountedPrice: 9.00,
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true
    },
    available: true,
    isMysteryBag: false
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    restaurantId: '1',
    userId: '1',
    rating: 5,
    comment: 'Amazing mystery bag! Great value and delicious food.',
    date: '2024-02-28'
  },
  {
    id: '2',
    restaurantId: '2',
    userId: '1',
    rating: 4,
    comment: 'Love their commitment to zero waste. Food was great!',
    date: '2024-02-27'
  }
];