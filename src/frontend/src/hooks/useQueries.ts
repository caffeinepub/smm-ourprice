import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Service, Order, CartItem, Platform, ServiceType, OrderStatus, Testimonial } from '../backend';

export function useGetAvailableServices() {
  const { actor, isFetching } = useActor();

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerName,
      contactInfo,
      cartItems,
    }: {
      customerName: string;
      contactInfo: string;
      cartItems: CartItem[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.placeOrder(customerName, contactInfo, cartItems);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      platform,
      serviceType,
      baseUnitPriceCents,
      baseUnitPriceDh,
      deliveryEstimate,
      description,
    }: {
      platform: Platform;
      serviceType: ServiceType;
      baseUnitPriceCents: bigint;
      baseUnitPriceDh: bigint;
      deliveryEstimate: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addService(platform, serviceType, baseUnitPriceCents, baseUnitPriceDh, deliveryEstimate, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, baseUnitPriceCents, baseUnitPriceDh, available }: { id: bigint; baseUnitPriceCents: bigint; baseUnitPriceDh: bigint; available: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateService(id, baseUnitPriceCents, baseUnitPriceDh, available);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useAddTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerName,
      serviceType,
      testimonialText,
      rating,
    }: {
      customerName: string;
      serviceType: ServiceType;
      testimonialText: string;
      rating: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addTestimonial(customerName, serviceType, testimonialText, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}
