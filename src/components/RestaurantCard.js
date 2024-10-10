const RestaurantCard = ({ restaurant }) => {
  const { name, image, isOpen } = restaurant;

  return (
    <div className={`restaurant-card ${!isOpen ? "closed" : ""}`}>
      <img src={image} alt={`${name}`} />
      <h2>{name}</h2>
      {!isOpen && <span>Closed</span>}
    </div>
  );
};

export default RestaurantCard;
