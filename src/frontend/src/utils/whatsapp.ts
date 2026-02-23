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
 * Generates a WhatsApp URL with pre-filled message including all order details
 * @param service - The service details
 * @param quantity - The custom quantity requested by the user
 * @param totalPrice - The calculated total price
 * @param username - The username provided by the customer
 * @param accountLink - The account link provided by the customer
 * @param postLink - The post link provided by the customer
 * @returns WhatsApp URL with encoded message
 */
export function generateWhatsAppUrl(
  service: Service,
  quantity: number,
  totalPrice: number,
  username?: string,
  accountLink?: string,
  postLink?: string
): string {
  const whatsappNumber = '212615473531';
  
  const platformName = platformNames[service.platform] || service.platform;
  const serviceTypeName = serviceTypeNames[service.serviceType] || service.serviceType;
  
  let message = `مرحباً! أرغب في طلب الخدمة التالية من IBAZEX Store:

━━━━━━━━━━━━━━━━━━━━
📋 تفاصيل الطلب:
━━━━━━━━━━━━━━━━━━━━

📱 المنصة: ${platformName}
📊 نوع الخدمة: ${serviceTypeName}
📦 الكمية المطلوبة: ${quantity.toLocaleString()} ${serviceTypeName}
💰 السعر الإجمالي: ${totalPrice.toFixed(2)} درهم`;

  // Add customer details if provided
  if (username || accountLink || postLink) {
    message += `

━━━━━━━━━━━━━━━━━━━━
👤 معلومات الحساب:
━━━━━━━━━━━━━━━━━━━━`;

    if (username) {
      message += `\n\n👤 اسم المستخدم: ${username}`;
    }
    if (accountLink) {
      message += `\n🔗 رابط الحساب: ${accountLink}`;
    }
    if (postLink) {
      message += `\n📎 رابط المنشور: ${postLink}`;
    }
  }

  message += `

━━━━━━━━━━━━━━━━━━━━

يرجى تأكيد الطلب وإرسال تفاصيل الدفع. شكراً لكم! 🙏`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}
