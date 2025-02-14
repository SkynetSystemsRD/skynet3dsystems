export interface ModelItem {
  id: number
  fileName: string
  filePath: string
  format: string
  isSupported: boolean
  size: number
  imageContent: string
  octetStreamContent: string
  uuid: string
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
