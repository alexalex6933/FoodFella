import { format } from 'date-fns';

export interface User {
  id: string;
  email: string;
  password: string;
  type: 'customer' | 'merchant';
}

export interface PriceDepreciation {
  enabled: boolean;
  startTime: string;
  ratePerMinute: number;
  lowerBound: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  dietary: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
  };
  available: boolean;
  priceDepreciation?: PriceDepreciation;
  createdAt: string;
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
  availableHours: {
    open: string;
    close: string;
  };
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  userId: string;
  items: {
    itemId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  status: 'processing' | 'cooking' | 'ready';
  totalAmount: number;
  createdAt: string;
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
  },
  {
    id: '3',
    email: 'taehun900@gmail.com',
    password: 'taehunkim123',
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
    merchantId: '2',
    availableHours: {
      open: '08:00',
      close: '20:00'
    }
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
    merchantId: '3',
    availableHours: {
      open: '11:00',
      close: '22:00'
    }
  },
  {
    id: '3',
    name: 'Fresh Fusion',
    description: 'Innovative fusion cuisine with sustainable practices',
    address: '789 Fusion Ave, Sydney',
    coordinates: {
      lat: -33.8650,
      lng: 151.2094
    },
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae',
    rating: 4.7,
    cuisineType: ['Fusion', 'Asian', 'Modern'],
    merchantId: '4',
    availableHours: {
      open: '10:00',
      close: '23:00'
    }
  },
  {
    id: '4',
    name: 'Harvest Kitchen',
    description: 'Farm-to-table dining experience',
    address: '321 Harvest Rd, Sydney',
    coordinates: {
      lat: -33.8730,
      lng: 151.2010
    },
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17',
    rating: 4.9,
    cuisineType: ['Local', 'Organic', 'Seasonal'],
    merchantId: '5',
    availableHours: {
      open: '07:00',
      close: '21:00'
    }
  },
  {
    id: '5',
    name: 'Urban Plates',
    description: 'Modern eatery focusing on reducing food waste',
    address: '567 Urban St, Sydney',
    coordinates: {
      lat: -33.8690,
      lng: 151.2100
    },
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    rating: 4.6,
    cuisineType: ['Contemporary', 'International', 'Sustainable'],
    merchantId: '6',
    availableHours: {
      open: '09:00',
      close: '22:00'
    }
  }
];

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Mystery Lunch Bag',
    description: 'A surprise selection of our daily specials',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false
    },
    available: true,
    priceDepreciation: {
      enabled: true,
      startTime: new Date().toISOString(),
      ratePerMinute: 0.1,
      lowerBound: 12.50
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Surplus Salad Bowl',
    description: 'Fresh daily salad made from surplus produce',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true
    },
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    restaurantId: '2',
    name: 'Rescued Ratatouille',
    description: 'Classic French dish made with rescued vegetables',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5',
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true
    },
    available: true,
    priceDepreciation: {
      enabled: true,
      startTime: new Date().toISOString(),
      ratePerMinute: 0.08,
      lowerBound: 15.00
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    restaurantId: '2',
    name: 'Sustainable Seafood Curry',
    description: 'Rich curry made with locally-sourced sustainable seafood',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
    dietary: {
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      dairyFree: true
    },
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    restaurantId: '3',
    name: 'Asian Fusion Bowl',
    description: 'Mix of Asian flavors with sustainable ingredients',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true
    },
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    restaurantId: '3',
    name: 'Kimchi Fried Rice',
    description: 'Korean-inspired fried rice with house-made kimchi',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1567529684892-09290a1b2d05',
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false
    },
    available: true,
    priceDepreciation: {
      enabled: true,
      startTime: new Date().toISOString(),
      ratePerMinute: 0.05,
      lowerBound: 12.00
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    restaurantId: '4',
    name: 'Farm Fresh Breakfast',
    description: 'Complete breakfast with locally sourced ingredients',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666',
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      dairyFree: false
    },
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    restaurantId: '4',
    name: 'Seasonal Harvest Plate',
    description: 'Selection of seasonal vegetables and grains',
    price: 23.00,
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6',
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true
    },
    available: true,
    priceDepreciation: {
      enabled: true,
      startTime: new Date().toISOString(),
      ratePerMinute: 0.07,
      lowerBound: 14.00
    },
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    restaurantId: '5',
    name: 'Urban Bowl',
    description: 'Modern take on traditional grain bowl',
    price: 21.00,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    dietary: {
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      dairyFree: true
    },
    available: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '10',
    restaurantId: '5',
    name: 'Rescued Pizza',
    description: 'Artisanal pizza with surplus ingredients',
    price: 26.00,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    dietary: {
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      dairyFree: false
    },
    available: true,
    priceDepreciation: {
      enabled: true,
      startTime: new Date().toISOString(),
      ratePerMinute: 0.09,
      lowerBound: 15.00
    },
    createdAt: new Date().toISOString()
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    restaurantId: '1',
    userId: '1',
    rating: 5,
    comment: 'Amazing mystery bag! Great value and delicious food.',
    date: format(new Date('2024-02-28'), 'yyyy-MM-dd')
  },
  {
    id: '2',
    restaurantId: '1',
    userId: '4',
    rating: 4,
    comment: 'Fresh ingredients and creative dishes. Love their sustainable approach.',
    date: format(new Date('2024-02-27'), 'yyyy-MM-dd')
  },
  {
    id: '3',
    restaurantId: '2',
    userId: '1',
    rating: 5,
    comment: 'The ratatouille was incredible! So much flavor from rescued vegetables.',
    date: format(new Date('2024-02-26'), 'yyyy-MM-dd')
  },
  {
    id: '4',
    restaurantId: '2',
    userId: '5',
    rating: 4,
    comment: 'Sustainable seafood curry was amazing. Great to see responsible sourcing.',
    date: format(new Date('2024-02-25'), 'yyyy-MM-dd')
  },
  {
    id: '5',
    restaurantId: '3',
    userId: '6',
    rating: 5,
    comment: 'Best fusion food in Sydney! The kimchi fried rice is a must-try.',
    date: format(new Date('2024-02-24'), 'yyyy-MM-dd')
  },
  {
    id: '6',
    restaurantId: '3',
    userId: '7',
    rating: 4,
    comment: 'Innovative combinations and great atmosphere. Will definitely return.',
    date: format(new Date('2024-02-23'), 'yyyy-MM-dd')
  },
  {
    id: '7',
    restaurantId: '4',
    userId: '8',
    rating: 5,
    comment: 'Farm fresh breakfast was incredible. You can taste the quality.',
    date: format(new Date('2024-02-22'), 'yyyy-MM-dd')
  },
  {
    id: '8',
    restaurantId: '4',
    userId: '9',
    rating: 5,
    comment: 'Love their commitment to seasonal ingredients. Everything was perfect.',
    date: format(new Date('2024-02-21'), 'yyyy-MM-dd')
  },
  {
    id: '9',
    restaurantId: '5',
    userId: '10',
    rating: 4,
    comment: 'Urban Bowl was delicious and filling. Great value for money.',
    date: format(new Date('2024-02-20'), 'yyyy-MM-dd')
  },
  {
    id: '10',
    restaurantId: '5',
    userId: '11',
    rating: 5,
    comment: 'The Rescued Pizza is genius! Helping reduce waste while being delicious.',
    date: format(new Date('2024-02-19'), 'yyyy-MM-dd')
  }
];

export const mockOrders = [
  {
    id: '1',
    restaurantId: '1',
    userId: '1',
    items: [
      {
        itemId: '1',
        quantity: 1,
        priceAtPurchase: 20.00
      }
    ],
    status: 'processing',
    totalAmount: 20.00,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    restaurantId: '1',
    userId: '3',
    items: [
      {
        itemId: '1',
        quantity: 2,
        priceAtPurchase: 18.50
      },
      {
        itemId: '2',
        quantity: 1,
        priceAtPurchase: 15.00
      }
    ],
    status: 'cooking',
    totalAmount: 52.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: '3',
    restaurantId: '1',
    userId: '4',
    items: [
      {
        itemId: '2',
        quantity: 3,
        priceAtPurchase: 16.00
      }
    ],
    status: 'ready',
    totalAmount: 48.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
  },
  {
    id: '4',
    restaurantId: '1',
    userId: '5',
    items: [
      {
        itemId: '1',
        quantity: 1,
        priceAtPurchase: 19.00
      },
      {
        itemId: '2',
        quantity: 2,
        priceAtPurchase: 15.50
      }
    ],
    status: 'ready',
    totalAmount: 50.00,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
  }
];

export const addMenuItem = (item: Omit<MenuItem, 'id' | 'createdAt'>) => {
  const newItem: MenuItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  mockMenuItems.push(newItem);
  return newItem;
};

export const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
  const index = mockMenuItems.findIndex(item => item.id === id);
  if (index !== -1) {
    mockMenuItems[index] = { ...mockMenuItems[index], ...updates };
    return mockMenuItems[index];
  }
  return null;
};

export const deleteMenuItem = (id: string) => {
  const index = mockMenuItems.findIndex(item => item.id === id);
  if (index !== -1) {
    mockMenuItems.splice(index, 1);
  }
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const order = mockOrders.find(order => order.id === orderId);
  if (order) {
    order.status = status;
    return order;
  }
  return null;
};

export const addReview = (review: Omit<Review, 'id' | 'date'>) => {
  const newReview: Review = {
    ...review,
    id: Math.random().toString(36).substr(2, 9),
    date: format(new Date(), 'yyyy-MM-dd')
  };
  mockReviews.push(newReview);
  return newReview;
};