# 🍽️ FoodFella

## Overview

### Inspiration
Food wastage is a massive global issue, with restaurants alone contributing to millions of tons of wasted food each year. As university students, we struggled to find affordable meals while witnessing perfectly good food being discarded. With the ongoing cost-of-living crisis, we saw an opportunity to create a solution that helps both consumers and businesses while reducing food waste.

![Screenshot 2025-03-16 155235](https://github.com/user-attachments/assets/762d4537-dad0-4fd4-9f30-79ec21889458)


### What it does
Food Fella is a dynamic platform that connects customers with restaurants offering surplus food at discounted prices. The app allows users to:

- View a map of nearby participating restaurants.
- Purchase "mystery bags" or specific discounted food items.
- Filter food based on dietary preferences.
- Leave reviews and ratings for restaurants.

For restaurants, Food Fella provides:
- A dashboard to list surplus food items.
- Order management and tracking features.

![image](https://github.com/user-attachments/assets/8ad368bc-bc2f-480f-ad27-dab3765fe918)





## Tech Stack
- **Frontend:** React.js, Tailwind CSS, JavaScript, TypeScript
- **Database:** Supabase
- **Authentication:** Supabase Auth
- **Hosting:** Netlify

## How we built it
We developed Food Fella as a full-stack application using:
- **Frontend:** React.js, Tailwind CSS, hosted on Netlify.
- **Database:** Initially DataStax Astra DB, later migrated to Supabase for better integration.

## Challenges we ran into
- **Database Migration:** Initially used DataStax Astra DB but faced integration challenges. Switched to Supabase for better ease of use.
- **Backend Hosting:** Tried Render but faced issues with server hosting. Opted for a serverless solution.
- **Authentication & User Flow:** Implemented authentication for both customers and merchants, ensuring secure and seamless login.

## Accomplishments that we're proud of
- Successfully built our first full-stack application from scratch.
- Tackled the global issue of food wastage with a practical solution.
- Implemented real-time pricing updates for food items with price depreciation enabled.
- Designed a user-friendly interface for both customers and merchants.

## What we learned
- The importance of time management in a fast-paced development cycle.
- Setting up the backend infrastructure beforehand prevents roadblocks in development.
- Handling authentication and authorization efficiently is crucial for security.
- Integrating mapping services for a seamless user experience.

## What's next for Food Fella
- **User Onboarding:** Increase restaurant partnerships and onboard more users.
- **Expand to Grocery Stores:** Extend the platform to include surplus grocery items from supermarkets.
- **Enhance Features:** Implement an AI-based recommendation system for users and automated reports for restaurants to track waste reduction.
- **Payment Integration:** Enable in-app payments for seamless transactions.

## Installation & Setup
```bash
# Clone the repository
git clone https://github.com/alexalex6933/FoodFella.git
cd FoodFella

# Install dependencies
npm install  # or yarn install

# Run the development server
npm start  # or yarn start
```

## Contributing
Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.

## Access the website here!
[foodfella.netlify.app](https://foodfella.netlify.app/)

Happy coding! 🚀

