import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Platform = {
    #facebook;
    #instagram;
    #youtube;
    #tiktok;
  };

  type ServiceType = {
    #followers;
    #likes;
    #views;
  };

  type Service = {
    id : Nat;
    platform : Platform;
    serviceType : ServiceType;
    baseUnitPriceCents : Nat; // Price per unit in cents
    baseUnitPriceDh : Nat; // Price per unit in Moroccan Dirhams
    deliveryEstimate : Text;
    description : Text;
    available : Bool;
  };

  type CartItem = {
    serviceId : Nat;
    quantity : Nat;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    contactInfo : Text;
    cartItems : [CartItem];
    totalAmount : Nat;
    status : OrderStatus;
  };

  type OrderStatus = {
    #pending;
    #completed;
    #cancelled;
  };

  type Testimonial = {
    customerName : Text;
    serviceType : ServiceType;
    testimonialText : Text;
    rating : Nat; // 1-5 stars
  };

  module Service {
    public func compare(a : Service, b : Service) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  var nextServiceId = 1;
  var nextOrderId = 1;

  let services = Map.empty<Nat, Service>();
  let orders = Map.empty<Nat, Order>();
  let testimonials = Map.empty<Nat, Testimonial>();

  public shared ({ caller }) func addService(
    platform : Platform,
    serviceType : ServiceType,
    baseUnitPriceCents : Nat,
    baseUnitPriceDh : Nat,
    deliveryEstimate : Text,
    description : Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };

    let serviceId = nextServiceId;
    let service : Service = {
      id = serviceId;
      platform;
      serviceType;
      baseUnitPriceCents;
      baseUnitPriceDh;
      deliveryEstimate;
      description;
      available = true;
    };

    services.add(serviceId, service);
    nextServiceId += 1;
    serviceId;
  };

  public shared ({ caller }) func updateService(id : Nat, baseUnitPriceCents : Nat, baseUnitPriceDh : Nat, available : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };

    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found"); };
      case (?service) {
        let updatedService = { service with baseUnitPriceCents; baseUnitPriceDh; available };
        services.add(id, updatedService);
      };
    };
  };

  public shared ({ caller }) func updateServicePrice(id : Nat, newPriceDh : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update service prices");
    };

    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found"); };
      case (?service) {
        let updatedService = { service with baseUnitPriceDh = newPriceDh };
        services.add(id, updatedService);
      };
    };
  };

  public query ({ caller }) func getAvailableServices() : async [Service] {
    services.values().toArray().sort().filter(
      func(service) {
        service.available;
      }
    );
  };

  public shared ({ caller }) func placeOrder(customerName : Text, contactInfo : Text, cartItems : [CartItem]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    var totalAmount = 0;

    for (item in cartItems.values()) {
      switch (services.get(item.serviceId)) {
        case (null) { Runtime.trap("Service not found"); };
        case (?service) {
          if (not service.available) {
            Runtime.trap("Service not available");
          };
          totalAmount += service.baseUnitPriceCents * item.quantity;
        };
      };
    };

    let orderId = nextOrderId;
    let order : Order = {
      id = orderId;
      customerName;
      contactInfo;
      cartItems;
      totalAmount;
      status = #pending;
    };

    orders.add(orderId, order);
    nextOrderId += 1;
    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found"); };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };

    orders.values().toArray();
  };

  public shared ({ caller }) func addTestimonial(customerName : Text, serviceType : ServiceType, testimonialText : Text, rating : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add testimonials");
    };

    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let testimonial : Testimonial = {
      customerName;
      serviceType;
      testimonialText;
      rating;
    };

    testimonials.add(testimonials.size() + 1, testimonial);
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };
};
