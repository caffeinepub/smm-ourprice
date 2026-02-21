import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";



actor {
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

  type ServicePackage = {
    id : Nat;
    platform : Platform;
    serviceType : ServiceType;
    quantity : Nat;
    price : Nat; // Price in cents
    priceDh : Nat; // Price in Moroccan Dirhams
    deliveryEstimate : Text;
    description : Text;
    available : Bool;
  };

  type CartItem = {
    packageId : Nat;
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

  module ServicePackage {
    public func compare(a : ServicePackage, b : ServicePackage) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  var nextPackageId = 1;
  var nextOrderId = 1;

  let servicePackages = Map.empty<Nat, ServicePackage>();
  let orders = Map.empty<Nat, Order>();

  public shared ({ caller }) func addServicePackage(
    platform : Platform,
    serviceType : ServiceType,
    quantity : Nat,
    price : Nat,
    priceDh : Nat,
    deliveryEstimate : Text,
    description : Text,
  ) : async Nat {
    let packageId = nextPackageId;
    let servicePackage : ServicePackage = {
      id = packageId;
      platform;
      serviceType;
      quantity;
      price;
      priceDh;
      deliveryEstimate;
      description;
      available = true;
    };

    servicePackages.add(packageId, servicePackage);
    nextPackageId += 1;
    packageId;
  };

  public shared ({ caller }) func updateServicePackage(id : Nat, price : Nat, priceDh : Nat, available : Bool) : async () {
    switch (servicePackages.get(id)) {
      case (null) { Runtime.trap("Service package not found"); };
      case (?package) {
        let updatedPackage = { package with price; priceDh; available };
        servicePackages.add(id, updatedPackage);
      };
    };
  };

  public query ({ caller }) func getAvailableServices() : async [ServicePackage] {
    servicePackages.values().toArray().sort().filter(
      func(servicePackage) {
        servicePackage.available;
      }
    );
  };

  public shared ({ caller }) func placeOrder(customerName : Text, contactInfo : Text, cartItems : [CartItem]) : async Nat {
    var totalAmount = 0;

    for (item in cartItems.values()) {
      switch (servicePackages.get(item.packageId)) {
        case (null) { Runtime.trap("Service package not found"); };
        case (?servicePackage) {
          if (not servicePackage.available) {
            Runtime.trap("Service package not available");
          };
          totalAmount += servicePackage.price * item.quantity;
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
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found"); };
      case (?order) {
        let updatedOrder = { order with status };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };
};
