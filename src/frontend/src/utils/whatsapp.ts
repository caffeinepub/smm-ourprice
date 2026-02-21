import type { Service } from '../backend';

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
 * Generates a WhatsApp URL with pre-filled message for a service with custom quantity
 * @param service - The service details
 * @param quantity - The custom quantity requested by the user
 * @param totalPrice - The calculated total price
 * @returns WhatsApp URL with encoded message
 */
export function generateWhatsAppUrl(service: Service, quantity: number, totalPrice: number): string {
  const whatsappNumber = '212615473531';
  
  const platformName = platformNames[service.platform] || service.platform;
  const serviceTypeName = serviceTypeNames[service.serviceType] || service.serviceType;
  
  const message = `مرحباً! أرغب في طلب الخدمة التالية:

📱 المنصة: ${platformName}
📊 نوع الخدمة: ${serviceTypeName}
📦 الكمية المطلوبة: ${quantity.toLocaleString()} ${serviceTypeName}
💰 السعر الإجمالي: ${totalPrice.toFixed(2)} درهم

يرجى تأكيد الطلب وإرسال تفاصيل الدفع.`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}
