const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const express = require("express");

// Construct a schema, using GraphQL schema language
const restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];

const schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);

// The root provides a resolver function for each API endpoint
const root = {

  restaurant: ({ id }) => restaurants.find(r => r.id === id),

  restaurants: () => restaurants,

  setrestaurant: ({ input }) => {
    const newId  = Math.max(...restaurants.map(r => r.id)) + 1;
    const newRestaurant = { id: newId, name: input.name, description: input.description, dishes: [] };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },

  deleterestaurant: ({ id }) => {
    const idx = restaurants.findIndex(r => r.id === id);
    const found = (idx !== -1);
    if (found) {
      restaurants.splice(idx, 1);
    }
    return { ok: found };
  },

  editrestaurant: ({ id, name }) => {
    const idx = restaurants.findIndex(r => r.id === id);
    restaurants[idx].name = name;
    return restaurants[idx];
  }
};

const app = express();
const port = 5500;

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(5500, () => console.log("Running Graphql on Port:" + port));
