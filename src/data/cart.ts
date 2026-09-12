import type {
  StoreProduct,
} from './products'

export type CartItem = {
  product: StoreProduct
  size: string
  quantity: number
}