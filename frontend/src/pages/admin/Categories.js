import AdminPageHeader from "../../components/admin/AdminPageHeader";
import CategoryManager from "../../components/admin/CategoryManager";

const Categories = () => {
  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Категорії"
        description="Структуруйте каталог та керуйте ієрархією"
      />
      <CategoryManager />
    </div>
  );
};

export default Categories;

