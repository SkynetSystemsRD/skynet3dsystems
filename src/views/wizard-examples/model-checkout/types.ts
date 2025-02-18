export interface ModelItem {
  id: number
  fileName: string
  filePath: string
  format: string
  size: number
  octetStreamContent: string
  uuid: string
  dimentions: xyz;
  weight: number;
}

interface xyz {
  x: number | undefined,
  y: number | undefined,
  z: number | undefined,
}

export interface Addresses {
  title: string
  desc: string
  subtitle: string
  value: string
}

export interface ModelCheckoutData {
  modelItems: ModelItem[]
  promoCode: string
  orderAmount: number
  deliveryAddress: string
  deliverySpeed: string
  deliveryCharges: number
  addresses: Addresses[]
}
