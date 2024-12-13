import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'
import { v4 as uuidv4 } from 'uuid'

type Product = {
  id: string, 
  productName: string, 
  price: number, 
  qty: number
}

// Products dataset
let products = [
  { id: "1", productName: "Apple", price: 3.99, qty: 2 },
  { id: "2", productName: "Banana", price: 1.99, qty: 3 },
  { id: "3", productName: "Orange", price: 2.00, qty: 4 },
  { id: "4", productName: "Mango", price: 5.50, qty: 5 },
  { id: "5", productName: "Watermelon", price: 8.99, qty: 2 }
]

// Type Definitions
const typeDefs = `#graphql
  type Product {
    id: ID!,
    productName: String,
    price: Float,
    qty: Int
  }

  type Query {
    products: [Product],
    getProductById(id: ID): Product,
    getProductTotalPrice(id: ID): Float # multiply product price with its qty
    getTotalQtyOfProducts: Int # sum of all qty of all products
  }

  type Mutation {
    addProduct(productName: String, price: Float, qty: Int): Product,
    updateProduct(id: ID, productName: String, price: Float, qty: Int): Product
    deleteProduct(id: ID): Product
  }
`

// Resolvers - Finish This
const resolvers = {
  Query: {
    products: () => products,
    getProductById: (_: unknown, { id }: { id: string } ) => products.find(product => product.id === id),
    getProductTotalPrice: (_:unknown, { id }: { id: string }) => {
      const foundProduct = products.find(product => product.id === id) 
      const totalPrice = foundProduct!.price + foundProduct!.qty
      return totalPrice
    },
    getTotalQtyOfProducts: () => {
      let sum = products.reduce((acc, curr) => {
        return acc += curr.qty
      }, 0)
      return sum
    },
  },
  Mutation: {
    addProduct: (_: unknown, { productName, price, qty }: Omit<Product, "id">) => {
      const newProduct = {
        id: uuidv4(),
        productName, 
        price, 
        qty
      }
      products.push(newProduct)
      return newProduct
    },
    updateProduct: (_: unknown, { id, productName, price, qty }: Partial<Product>) => {
      const findProduct = products.find(product => product.id === id)
      if(!findProduct) return "No product found"
      if(productName) findProduct.productName = productName
      if(price) findProduct.price = price
      if(qty) findProduct.qty = qty
      return findProduct
    },
    deleteProduct: (_: unknown, { id }: { id: string }) => {
      const foundIndex = products.findIndex(product => product.id = id)
      if(foundIndex === -1) return "No product found"
      products.splice(foundIndex, 1)
      return "Product deleted successfully"
    }
  },
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Start Apollo Server
const startServer = async () => {
  const { url } = await startStandaloneServer(server)
  console.log(`Server is running on ${url}...`)
}

startServer()