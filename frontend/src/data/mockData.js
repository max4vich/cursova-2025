
export const categories = [
  { id: 1, name: "Електроніка", slug: "electronics" },
  { id: 2, name: "Одяг", slug: "clothing" },
  { id: 3, name: "Взуття", slug: "shoes" },
  { id: 4, name: "Аксесуари", slug: "accessories" },
  { id: 5, name: "Дім та сад", slug: "home-garden" },
];

export const products = [
  {
    id: 1,
    name: "Бездротові навушники Sony WH-1000XM5",
    description:
      "Преміальні навушники з активним шумозаглушенням, бездротовим підключенням і тривалістю роботи до 30 годин.",
    price: 12999,
    category: "electronics",
    stock: 45,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Sony+XM5",
    rating: 4.8,
    reviews: 234,
    discount: 15,
  },
  {
    id: 2,
    name: 'MacBook Pro 14" M3 Pro',
    description:
      "Потужний ноутбук з чіпом Apple M3 Pro, 18GB RAM, 512GB SSD. Ідеальний для розробки та дизайну.",
    price: 89999,
    category: "electronics",
    stock: 12,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=MacBook+Pro",
    rating: 4.9,
    reviews: 567,
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max 256GB",
    description:
      "Флагманський смартфон Apple з титановим корпусом, чіпом A17 Pro та революційною камерою 48MP.",
    price: 54999,
    category: "electronics",
    stock: 28,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=iPhone+15+Pro+Max",
    rating: 4.9,
    reviews: 892,
    discount: 5,
  },
  {
    id: 4,
    name: "Чоловіча куртка Columbia Omni-Heat",
    description:
      "Тепла зимова куртка з технологією Omni-Heat для максимального збереження тепла.",
    price: 4599,
    category: "clothing",
    stock: 67,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Columbia",
    rating: 4.6,
    reviews: 145,
  },
  {
    id: 5,
    name: "Жіноче плаття Zara Elegant Evening",
    description: "Елегантне вечірнє плаття з якісної тканини для особливих подій.",
    price: 2899,
    category: "clothing",
    stock: 34,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Zara+Dress",
    rating: 4.7,
    reviews: 89,
    discount: 20,
  },
  {
    id: 6,
    name: "Кросівки Nike Air Max 270",
    description:
      "Стильні та комфортні кросівки з технологією Air для максимальної амортизації.",
    price: 3999,
    category: "shoes",
    stock: 156,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Nike+Air+Max+270",
    rating: 4.8,
    reviews: 432,
  },
  {
    id: 7,
    name: "Жіночі черевики Timberland Classic",
    description:
      "Класичні черевики Timberland з натуральної шкіри. Водонепроникні та надзвичайно міцні.",
    price: 5699,
    category: "shoes",
    stock: 78,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Timberland",
    rating: 4.7,
    reviews: 267,
  },
  {
    id: 8,
    name: "Розумний годинник Apple Watch Series 9",
    description:
      "Останнє покоління Apple Watch з яскравим дисплеєм, датчиками здоров'я та підтримкою watchOS 10.",
    price: 18999,
    category: "accessories",
    stock: 92,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Apple+Watch",
    rating: 4.9,
    reviews: 678,
    discount: 10,
  },
  {
    id: 9,
    name: "Шкіряний гаманець Tommy Hilfiger",
    description:
      "Класичний чоловічий гаманець з натуральної шкіри з логотипом Tommy Hilfiger.",
    price: 1899,
    category: "accessories",
    stock: 234,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Wallet",
    rating: 4.5,
    reviews: 156,
  },
  {
    id: 10,
    name: "Рюкзак для ноутбука SwissGear",
    description:
      "Міцний рюкзак з відділенням для ноутбука до 17 дюймів. Ергономічний дизайн і багато кишень.",
    price: 2499,
    category: "accessories",
    stock: 187,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Backpack",
    rating: 4.6,
    reviews: 324,
  },
  {
    id: 11,
    name: "Кавоварка De'Longhi Magnifica",
    description:
      "Автоматична кавоварка для еспресо, капучино та латте з вбудованою кавомолкою.",
    price: 15999,
    category: "home-garden",
    stock: 23,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Delonghi",
    rating: 4.8,
    reviews: 189,
  },
  {
    id: 12,
    name: "Робот-пилосос Xiaomi Roborock S7",
    description:
      "Розумний робот-пилосос з функцією вологого прибирання й навігацією LiDAR.",
    price: 14999,
    category: "home-garden",
    stock: 45,
    image: "https://placehold.co/600x400/1a1a20/ffffff?text=Roborock+S7",
    rating: 4.7,
    reviews: 456,
    discount: 12,
  },
];

export const promoCodes = [
  {
    id: 1,
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderAmount: 1000,
    expiryDate: "2025-12-31",
    description: "10% знижка для нових клієнтів",
  },
  {
    id: 2,
    code: "SAVE500",
    type: "fixed",
    value: 500,
    minOrderAmount: 5000,
    expiryDate: "2025-06-30",
    description: "500 грн знижки при замовленні від 5000 грн",
  },
  {
    id: 3,
    code: "SUMMER25",
    type: "percentage",
    value: 25,
    minOrderAmount: 3000,
    expiryDate: "2025-08-31",
    description: "25% літня знижка",
  },
];

export const mockUsers = [
  {
    id: 1,
    name: "Іван Петренко",
    email: "ivan@example.com",
    phone: "+380501234567",
    address: "вул. Хрещатик 1, Київ",
    role: "customer",
  },
  {
    id: 2,
    name: "Марія Коваленко",
    email: "maria@example.com",
    phone: "+380502345678",
    address: "вул. Шевченка 45, Львів",
    role: "customer",
  },
  {
    id: 3,
    name: "Адміністратор",
    email: "admin@shop.com",
    phone: "+380503456789",
    address: "",
    role: "admin",
  },
];

export const mockOrders = [
  {
    id: 1,
    customerName: "Іван Петренко",
    customerEmail: "ivan@example.com",
    items: [
      { productId: 1, name: "Бездротові навушники Sony", quantity: 1, price: 12999 },
      { productId: 6, name: "Кросівки Nike Air Max 270", quantity: 1, price: 3999 },
    ],
    total: 16998,
    discount: 0,
    status: "delivered",
    paymentMethod: "card",
    deliveryMethod: "courier",
    createdAt: "2025-01-10",
  },
  {
    id: 2,
    customerName: "Марія Коваленко",
    customerEmail: "maria@example.com",
    items: [{ productId: 3, name: "iPhone 15 Pro Max", quantity: 1, price: 54999 }],
    total: 52249,
    discount: 2750,
    status: "processing",
    paymentMethod: "paypal",
    deliveryMethod: "post",
    createdAt: "2025-01-15",
  },
  {
    id: 3,
    customerName: "Іван Петренко",
    customerEmail: "ivan@example.com",
    items: [
      { productId: 5, name: "Жіноче плаття Zara", quantity: 2, price: 2899 },
      { productId: 9, name: "Шкіряний гаманець", quantity: 1, price: 1899 },
    ],
    total: 7697,
    discount: 0,
    status: "shipped",
    paymentMethod: "card",
    deliveryMethod: "courier",
    createdAt: "2025-01-12",
  },
];

export const salesByCategory = [
  { category: "Електроніка", sales: 187500, count: 45 },
  { category: "Одяг", sales: 64320, count: 89 },
  { category: "Взуття", sales: 48900, count: 67 },
  { category: "Аксесуари", sales: 35670, count: 123 },
  { category: "Дім та сад", sales: 78450, count: 34 },
];

export const monthlyRevenue = [
  { month: "Січень", revenue: 145000 },
  { month: "Лютий", revenue: 178000 },
  { month: "Березень", revenue: 192000 },
  { month: "Квітень", revenue: 167000 },
  { month: "Травень", revenue: 203000 },
  { month: "Червень", revenue: 225000 },
];

