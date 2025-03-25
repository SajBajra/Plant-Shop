export const plantsData = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    price: 29.99,
    description: "The Swiss Cheese Plant, known for its unique leaf holes and easy care.",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b",
  },
  {
    id: 2,
    name: "Snake Plant",
    price: 19.99,
    description: "A hardy succulent that can survive in low light and with minimal watering.",
    image: "https://images.unsplash.com/photo-1572688484438-313a6e50c333",
  },
  {
    id: 3,
    name: "Fiddle Leaf Fig",
    price: 49.99,
    description: "A popular indoor tree with large, violin-shaped leaves that can grow up to 10 feet tall.",
    image: "https://images.unsplash.com/photo-1508022713622-df2d8fb7b4cd",
  },
  {
    id: 4,
    name: "Peace Lily",
    price: 24.99,
    description: "An easy-care plant with glossy leaves and white flowers that thrives in low light.",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae2321",
  },
  {
    id: 5,
    name: "Pothos",
    price: 15.99,
    description: "A trailing vine with heart-shaped leaves that's nearly impossible to kill.",
    image: "https://images.unsplash.com/photo-1507746212228-2d3645cbeb56",
  },
  {
    id: 6,
    name: "ZZ Plant",
    price: 22.99,
    description: "A drought-tolerant plant with glossy leaves that can handle neglect and low light.",
    image: "https://images.unsplash.com/photo-1572686972126-be2b38bc138e",
  },
  {
    id: 7,
    name: "Rubber Plant",
    price: 34.99,
    description: "A popular houseplant with thick, glossy leaves that's easy to care for.",
    image: "https://images.unsplash.com/photo-1594576722256-a3f68e39ed26",
  },
  {
    id: 8,
    name: "Aloe Vera",
    price: 12.99,
    description: "A succulent with healing properties that thrives in bright, indirect light.",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09",
  },
  {
    id: 9,
    name: "Spider Plant",
    price: 14.99,
    description: "A classic houseplant that produces baby plantlets and is safe for pets.",
    image: "https://images.unsplash.com/photo-1572688985715-89801e7b7c4a",
  },
]

// Add admin user to localStorage if it doesn't exist
if (!localStorage.getItem("users")) {
  const adminUser = {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "admin123",
    isAdmin: true,
  }

  localStorage.setItem("users", JSON.stringify([adminUser]))
}



