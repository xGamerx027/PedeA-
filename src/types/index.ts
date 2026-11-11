export type OrderStatus = 'recebido'|'confirmado'|'em_preparo'|'pronto'|'saiu_para_entrega'|'entregue'|'cancelado';
export type DeliveryType = 'entrega'|'retirada';
export interface Category { id: string; name: string; order: number }
export interface Product { id: string; name: string; description: string; price: number; imageUrl: string; categoryId: string; available: boolean }
export interface OrderItem { productId: string; name: string; price: number; quantity: number }
export interface Order { id: string; code: string; customerName: string; phone: string; deliveryType: DeliveryType; address?: string; paymentMethod: string; notes?: string; items: OrderItem[]; subtotal: number; deliveryFee: number; total: number; status: OrderStatus; createdAt: string }
export interface CreateOrderInput { customerName: string; phone: string; deliveryType: DeliveryType; address?: string; paymentMethod: string; notes?: string; items: { productId: string; quantity: number }[] }
export interface Store { slug: string; name: string; logoUrl: string; coverUrl: string; phone: string; address: string; hours: string; deliveryFee: number; estimatedTime: string; paymentMethods: string[] }
export interface Dashboard { ordersToday: number; revenue: number; avgTicket: number; pending: number; sales: { label: string; value: number }[]; recent: Order[] }
export interface AuthSession { token: string; user: { name: string; email: string } }
