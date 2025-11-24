const { transliterate } = require("transliteration");

const buildBaseSlug = (value, fallback = "item") => {
  if (!value || typeof value !== "string") {
    return fallback;
  }
  
  // Транслітерація українських/кириличних букв в англійські
  const transliterated = transliterate(value);
  
  // Конвертація в lowercase та заміна пробілів/спецсимволів на дефіси
  const slug = transliterated
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Видаляємо всі спецсимволи крім букв, цифр, пробілів та дефісів
    .replace(/[\s_-]+/g, "-") // Замінюємо пробіли, підкреслення та множинні дефіси на один дефіс
    .replace(/^-+|-+$/g, ""); // Видаляємо дефіси на початку та в кінці
  
  return slug || fallback;
};

const createUniqueSlug = async (delegate, base, excludeId) => {
  let candidate = base;
  let counter = 1;
  
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const existing = await delegate.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { NOT: { id: excludeId } } : {}),
        },
        select: { id: true },
      });
      if (!existing) break;
      candidate = `${base}-${counter++}`;
    } catch (error) {
      // Якщо поле slug не існує в моделі, просто повертаємо базовий slug
      console.warn(`Slug field may not exist in model: ${error.message}`);
      break;
    }
  }
  return candidate;
};

const generateSlugFor = async (delegate, value, excludeId, fallbackPrefix = "item") => {
  const base = buildBaseSlug(value, fallbackPrefix);
  return createUniqueSlug(delegate, base, excludeId);
};

module.exports = {
  generateSlugFor,
};

