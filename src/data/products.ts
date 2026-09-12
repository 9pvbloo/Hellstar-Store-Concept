import hoodie01 from '../assets/products/hoodie-01-black-path-to-paradise.webp'
import hoodie02 from '../assets/products/hoodie-02-grey-pink-flame.webp'
import hoodie03 from '../assets/products/hoodie-03-red-records.webp'

import tee01 from '../assets/products/tee-01-black-boxing.webp'
import tee02 from '../assets/products/tee-02-cream-enlightenment.webp'
import tee03 from '../assets/products/tee-03-black-skull-football.webp'

import shorts01 from '../assets/products/shorts-01-black-burning-face.webp'
import shorts02 from '../assets/products/shorts-02-black-path-to-paradise.webp'
import shorts03 from '../assets/products/shorts-03-black-records.webp'

import cap01 from '../assets/products/cap-01-red-flame.webp'
import cap02 from '../assets/products/cap-02-black-grey-flame.webp'

export type StoreProduct = {
  id: string
  name: string
  category: string
  image: string
  layout: string
  sizes: string[]
  colorway: string

  pricePen: number
  priceUsd: number

  compareAtPen?: number
  compareAtUsd?: number
}

export const products: StoreProduct[] = [
  {
    id: '01',
    name: 'PATH TO PARADISE',
    category: 'HOODIE',
    image: hoodie01,
    layout: 'drop-card--hero',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'BLACK / BONE',

    pricePen: 349.9,
    priceUsd: 94.9,

    compareAtPen: 389.9,
    compareAtUsd: 105.9,
  },

  {
    id: '02',
    name: 'BLACK BOXING',
    category: 'T-SHIRT',
    image: tee01,
    layout: 'drop-card--left',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'BLACK / WHITE',

    pricePen: 249.9,
    priceUsd: 67.9,
  },

  {
    id: '03',
    name: 'GREY PINK FLAME',
    category: 'HOODIE',
    image: hoodie02,
    layout: 'drop-card--right',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'GREY / PINK',

    pricePen: 329.9,
    priceUsd: 89.9,
  },

  {
    id: '04',
    name: 'BURNING FACE',
    category: 'SHORTS',
    image: shorts01,
    layout: 'drop-card--center-small',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'BLACK',

    pricePen: 199.9,
    priceUsd: 54.9,

    compareAtPen: 229.9,
    compareAtUsd: 62.9,
  },

  {
    id: '05',
    name: 'RED FLAME',
    category: 'CAP',
    image: cap01,
    layout: 'drop-card--left-small',
    sizes: ['ONE SIZE'],
    colorway: 'RED / BLACK',

    pricePen: 169.9,
    priceUsd: 45.9,
  },

  {
    id: '06',
    name: 'ENLIGHTENMENT',
    category: 'T-SHIRT',
    image: tee02,
    layout: 'drop-card--right-large',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'CREAM',

    pricePen: 259.9,
    priceUsd: 69.9,
  },

  {
    id: '07',
    name: 'RED RECORDS',
    category: 'HOODIE',
    image: hoodie03,
    layout: 'drop-card--left-large',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'RED / BLACK',

    pricePen: 349.9,
    priceUsd: 94.9,

    compareAtPen: 399.9,
    compareAtUsd: 108.9,
  },

  {
    id: '08',
    name: 'PATH TO PARADISE',
    category: 'SHORTS',
    image: shorts02,
    layout: 'drop-card--right-small',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'BLACK / BONE',

    pricePen: 219.9,
    priceUsd: 59.9,
  },

  {
    id: '09',
    name: 'SKULL FOOTBALL',
    category: 'T-SHIRT',
    image: tee03,
    layout: 'drop-card--center',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'BLACK / WHITE',

    pricePen: 239.9,
    priceUsd: 64.9,

    compareAtPen: 269.9,
    compareAtUsd: 73.9,
  },

  {
    id: '10',
    name: 'BLACK GREY FLAME',
    category: 'CAP',
    image: cap02,
    layout: 'drop-card--left-small',
    sizes: ['ONE SIZE'],
    colorway: 'BLACK / GREY',

    pricePen: 179.9,
    priceUsd: 48.9,
  },

  {
    id: '11',
    name: 'RECORDS',
    category: 'SHORTS',
    image: shorts03,
    layout: 'drop-card--right',
    sizes: ['S', 'M', 'L', 'XL'],
    colorway: 'BLACK',

    pricePen: 209.9,
    priceUsd: 56.9,
  },
]
