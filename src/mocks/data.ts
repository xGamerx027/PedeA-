import type { Category, Order, Product, Store } from '../types';
// Dados fictícios apenas para demonstrar a interface. Mutáveis em memória.
const now = () => new Date().toISOString();
export const db = {
  store: { slug: 'demo', name: 'Lanchonete Exemplo', logoUrl: '', coverUrl: '', phone: '(00) 00000-0000', address: 'Rua Exemplo, 123 - Centro', hours: 'Seg a Sex: 11h às 22h\nSáb e Dom: 12h às 23h', deliveryFee: 6, estimatedTime: '30-45 min', paymentMethods: ['Pix', 'Dinheiro', 'Cartão de débito'] } as Store,
  categories: [{ id: 'c1', name: 'Lanches', order: 1 }, { id: 'c2', name: 'Porções', order: 2 }, { id: 'c3', name: 'Bebidas', order: 3 }] as Category[],
  products: [
    { id: 'p1', name: 'X-Burger', description: 'Pão, hambúrguer, queijo e salada.', price: 24.9, imageUrl: '', categoryId: 'c1', available: true },
    { id: 'p2', name: 'X-Bacon', description: 'Hambúrguer, bacon crocante e queijo.', price: 29.9, imageUrl: '', categoryId: 'c1', available: true },
    { id: 'p3', name: 'Batata frita', description: 'Porção média com sal e orégano.', price: 18, imageUrl: '', categoryId: 'c2', available: true },
    { id: 'p4', name: 'Refrigerante lata', description: '350 ml.', price: 6.5, imageUrl: '', categoryId: 'c3', available: true },
    { id: 'p5', name: 'Suco natural', description: 'Laranja ou limão, 400 ml.', price: 9, imageUrl: '', categoryId: 'c3', available: false },
  ] as Product[],
  orders: [
    { id: 'o1', code: '#1001', customerName: 'Cliente Um', phone: '(00) 90000-0001', deliveryType: 'entrega', address: 'Rua A, 10', paymentMethod: 'Pix', notes: 'Sem cebola', items: [{ productId: 'p1', name: 'X-Burger', price: 24.9, quantity: 2 }], subtotal: 49.8, deliveryFee: 6, total: 55.8, status: 'recebido', createdAt: now() },
    { id: 'o2', code: '#1002', customerName: 'Cliente Dois', phone: '(00) 90000-0002', deliveryType: 'retirada', paymentMethod: 'Dinheiro', items: [{ productId: 'p3', name: 'Batata frita', price: 18, quantity: 1 }, { productId: 'p4', name: 'Refrigerante lata', price: 6.5, quantity: 1 }], subtotal: 24.5, deliveryFee: 0, total: 24.5, status: 'em_preparo', createdAt: now() },
    { id: 'o3', code: '#1003', customerName: 'Cliente Três', phone: '(00) 90000-0003', deliveryType: 'entrega', address: 'Av. B, 200', paymentMethod: 'Cartão de débito', items: [{ productId: 'p2', name: 'X-Bacon', price: 29.9, quantity: 1 }], subtotal: 29.9, deliveryFee: 6, total: 35.9, status: 'entregue', createdAt: now() },
  ] as Order[],
};
