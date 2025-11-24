import AdminPageHeader from "../../components/admin/AdminPageHeader";
import PromotionManager from "../../components/admin/PromotionManager";

const Promotions = () => {
  return (
    <div className="admin-page">
      <AdminPageHeader title="Промокоди" description="Керуйте акціями та знижками" />
      <PromotionManager />
    </div>
  );
};

export default Promotions;

