import type { ServicePackage } from '../backend';

// Platform names in Arabic
const platformNames: Record<string, string> = {
  facebook: 'فيسبوك',
  instagram: 'إنستغرام',
  twitter: 'تويتر',
  youtube: 'يوتيوب',
  tiktok: 'تيك توك',
};

// Service type names in Arabic
const serviceTypeNames: Record<string, string> = {
  followers: 'متابعون',
  likes: 'إعجابات',
  views: 'مشاهدات',
};

/**
 * Generates a WhatsApp URL with pre-filled message for a service package
 * @param service - The service package details
 * @param quantity - The quantity of packages to order
 * @returns WhatsApp URL with encoded message
 */
export function generateWhatsAppUrl(service: ServicePackage, quantity: number = 1): string {
  const whatsappNumber = '212779781318';
  
  const platformName = platformNames[service.platform] || service.platform;
  const serviceTypeName = serviceTypeNames[service.serviceType] || service.serviceType;
  const packageQuantity = Number(service.quantity).toLocaleString();
  const pricePerPackage = Number(service.priceDh);
  const totalPrice = pricePerPackage * quantity;
  
  const message = `مرحباً! أرغب في طلب الخدمة التالية:

📱 المنصة: ${platformName}
📊 نوع الخدمة: ${serviceTypeName}
📦 الكمية: ${quantity}x ${packageQuantity} ${serviceTypeName}
💰 السعر: ${totalPrice} درهم

يرجى تأكيد الطلب وإرسال تفاصيل الدفع.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}
