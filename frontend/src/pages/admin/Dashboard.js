import { salesByCategory, monthlyRevenue, products } from "../../data/mockData";

const Dashboard = () => {
  const topProducts = [...products]
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 5);

  return (
    <div className="admin-page">
      <h1>Дашборд</h1>
      <div className="admin-grid">
        <section className="card">
          <h3>Продажі по категоріях</h3>
          <table>
            <thead>
              <tr>
                <th>Категорія</th>
                <th>Продажі</th>
                <th>Замовлення</th>
              </tr>
            </thead>
            <tbody>
              {salesByCategory.map((category) => (
                <tr key={category.category}>
                  <td>{category.category}</td>
                  <td>{category.sales.toLocaleString("uk-UA")} ₴</td>
                  <td>{category.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h3>Доходи за період</h3>
          <ul className="admin-list">
            {monthlyRevenue.map((item) => (
              <li key={item.month}>
                <span>{item.month}</span>
                <strong>{item.revenue.toLocaleString("uk-UA")} ₴</strong>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h3>Найпопулярніші товари</h3>
          <ul className="admin-list">
            {topProducts.map((product) => (
              <li key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <p className="muted">{product.reviews} відгуків</p>
                </div>
                <span>{product.price.toLocaleString("uk-UA")} ₴</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

