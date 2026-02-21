import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ServicePackage, Order, CartItem, Platform, ServiceType, OrderStatus } from '../backend';

export function useGetAvailableServices() {
  const { actor, isFetching } = useActor();

  return useQuery<ServicePackage[]>({
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

export function useAddServicePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      platform,
      serviceType,
      quantity,
      price,
      priceDh,
      deliveryEstimate,
      description,
    }: {
      platform: Platform;
      serviceType: ServiceType;
      quantity: bigint;
      price: bigint;
      priceDh: bigint;
      deliveryEstimate: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addServicePackage(platform, serviceType, quantity, price, priceDh, deliveryEstimate, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useUpdateServicePackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, price, priceDh, available }: { id: bigint; price: bigint; priceDh: bigint; available: boolean }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateServicePackage(id, price, priceDh, available);
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
