import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Service {
    id: bigint;
    deliveryEstimate: string;
    serviceType: ServiceType;
    baseUnitPriceDh: bigint;
    description: string;
    platform: Platform;
    available: boolean;
    baseUnitPriceCents: bigint;
}
export interface CartItem {
    quantity: bigint;
    serviceId: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: OrderStatus;
    contactInfo: string;
    cartItems: Array<CartItem>;
    totalAmount: bigint;
}
export interface UserProfile {
    name: string;
}
export interface Testimonial {
    customerName: string;
    serviceType: ServiceType;
    testimonialText: string;
    rating: bigint;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addService(platform: Platform, serviceType: ServiceType, baseUnitPriceCents: bigint, baseUnitPriceDh: bigint, deliveryEstimate: string, description: string): Promise<bigint>;
    addTestimonial(customerName: string, serviceType: ServiceType, testimonialText: string, rating: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getAvailableServices(): Promise<Array<Service>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customerName: string, contactInfo: string, cartItems: Array<CartItem>): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<void>;
    updateService(id: bigint, baseUnitPriceCents: bigint, baseUnitPriceDh: bigint, available: boolean): Promise<void>;
}
