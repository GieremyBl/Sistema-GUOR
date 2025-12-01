export interface PaymentMethod {
  id: string;
  name: string;
  type: 'yape' | 'qr' | 'tarjeta';
  description: string;
  icon?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentDetails {
  methodId: string;
  amount: number;
  reference?: string;
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
}
