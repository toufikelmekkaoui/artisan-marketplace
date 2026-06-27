/**
 * Generates a WhatsApp deep-link with a pre-filled message.
 * @param whatsappNumber  Digits only, including country code. e.g. "966501234567"
 * @param productTitle    Name of the product
 * @param price           Formatted price string e.g. "$25.00"
 * @param productUrl      Full URL to the product page
 */
export function buildWhatsAppLink(
  whatsappNumber: string,
  productTitle: string,
  price: string,
  productUrl: string
): string {
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  const message = `Hello! I am interested in buying your product:\n\n🛍️ *${productTitle}*\n💰 Price: ${price}\n🔗 ${productUrl}\n\nIs it still available?`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a numeric price with currency symbol.
 */
export function formatPrice(price: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}
