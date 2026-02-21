import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ServicePackage {
    id: bigint;
    deliveryEstimate: string;
    serviceType: ServiceType;
    description: string;
    platform: Platform;
    available: boolean;
    priceDh: bigint;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    contactInfo: string;
    cartItems: Array<CartItem>;
    totalAmount: bigint;
}
export interface CartItem {
    quantity: bigint;
    packageId: bigint;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed"
}
export enum Platform {
    tiktok = "tiktok",
    instagram = "instagram",
    facebook = "facebook",
    youtube = "youtube"
}
export enum ServiceType {
    views = "views",
    likes = "likes",
    followers = "followers"
}
export interface backendInterface {
    addServicePackage(platform: Platform, serviceType: ServiceType, quantity: bigint, price: bigint, priceDh: bigint, deliveryEstimate: string, description: string): Promise<bigint>;
    getAllOrders(): Promise<Array<Order>>;
    getAvailableServices(): Promise<Array<ServicePackage>>;
    placeOrder(customerName: string, contactInfo: string, cartItems: Array<CartItem>): Promise<bigint>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateServicePackage(id: bigint, price: bigint, priceDh: bigint, available: boolean): Promise<void>;
}
