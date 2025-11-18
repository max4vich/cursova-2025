import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="page not-found-page">
    <h1>404</h1>
    <p>Сторінку не знайдено</p>
    <Link to="/" className="pill-button">
      На головну
    </Link>
  </div>
);

export default NotFound;

