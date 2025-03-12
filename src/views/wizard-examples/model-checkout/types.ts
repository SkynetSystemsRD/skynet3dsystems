export interface ModelItem {
  id: number
  fileName: string
  filePath: string
  size: number
  octetStreamContent: string
  uuid: string
  dimentions: xyz;
  weight: number;
  price: number;
}

interface xyz {
  x: number | undefined,
  y: number | undefined,
  z: number | undefined,
}

export interface Addresses {
  title: string
  email: string
  desc: string
  subtitle: string
  value: string
}

interface bankInfo {
  name: string
  owner: string
  accountNumber: number
  accountType: string
}

interface paymentMethod {
  cash: boolean
  transfer: bankInfo
  card: string | null // as a token
}

export interface ModelCheckoutData {
  modelItems: ModelItem[]
  promoCode: string
  note: string
  orderAmount: number
  deliveryAddress: string
  deliverySpeed: string
  deliveryCharges: number
  addresses: Addresses[]
  paymentMethod: paymentMethod
}
