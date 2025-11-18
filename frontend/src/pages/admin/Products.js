import { useState } from "react";
import { toast } from "sonner";
import { products as initialProducts, categories } from "../../data/mockData";

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: categories[0].slug,
    stock: 0,
  });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newProduct = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: "https://placehold.co/600x400/1a1a20/ffffff?text=New+Product",
      rating: 5,
      reviews: 0,
    };
    setProducts([newProduct, ...products]);
    setForm({ ...form, name: "", price: "", stock: 0 });
    toast.success("Товар додано");
  };

  return (
    <div className="admin-page">
      <h1>Товари</h1>
      <div className="admin-grid">
        <section className="card">
          <h3>Додати товар</h3>
          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              Назва
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Ціна
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Категорія
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Кількість
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
              />
            </label>
            <button className="pill-button" type="submit">
              Зберегти
            </button>
          </form>
        </section>

        <section className="card">
          <h3>Каталог</h3>
          <table>
            <thead>
              <tr>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Ціна</th>
                <th>Наявність</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toLocaleString("uk-UA")} ₴</td>
                  <td>{product.stock} шт</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Products;

