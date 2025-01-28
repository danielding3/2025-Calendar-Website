export const PRODUCT_DATA = {
  name: "2025 Riso Calendar Poster",
  description: "11\” x 17\”\nPrinted on Risograph in NYC\nMohawk Superfine Paper\n215gsm / 80lb ",
  printedInfo: "This poster was designed and printed by Jennifer Yejin Lee in New York. All posters will be packaged by hand and shipped carefully with love!\n \nOrders must be placed <span class='underline-span'>before 1/29 9am EST</span>.  Limited stock available.",
  variants: [
    {
      title: "2025 Calendar Poster - Bubblegum",
      price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUBBLEGUM ?? '',
      price: 1500, // Price in USD cents
      images: [
        "/images/blue-and-pink.png",
        "/images/blue-and-pink-mockup.png",
        '/images/blue-and-pink-mockup-2.png'
      ],
      soldOut: true,
    },
    {
      title: "2025 Calendar Poster - Metallic Gold",
      price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_METALLIC_GOLD ?? '',
      price: 1500, // Price in USD cents
      images: [
        "/images/blue-and-gold.png",
        "/images/blue-and-gold-mockup.png",
      ],
      soldOut: false,
    }
  ]
}; 