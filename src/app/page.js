import RestaurantCard from '../components/RestaurantCard';

const restaurants = [
  { name: "Restaurant A", image: "/imageA.jpg", isOpen: true },
  { name: "Restaurant B", image: "/imageB.jpg", isOpen: false }
];

export default function HomePage() {
  return (
    <div>
      <h1>Restaurants</h1>
      <div className="restaurant-list">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
