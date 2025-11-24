import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Shield, Users as UsersIcon } from "lucide-react";
import useAdminData from "../../hooks/useAdminData";
import { adminApi } from "../../api/admin";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminToolbar from "../../components/admin/AdminToolbar";
import AdminTable from "../../components/admin/AdminTable";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";

const roleOptions = ["ADMIN", "CUSTOMER"];

const Users = () => {
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: users = [], loading, reload } = useAdminData(
    () => adminApi.getUsers(),
    [],
    { initialData: [] }
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSearch =
        !search ||
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [roleFilter, search, users]);

  const stats = [
    {
      label: "Всього користувачів",
      value: users.length,
      icon: <UsersIcon size={18} />,
    },
    {
      label: "Адміністратори",
      value: users.filter((user) => user.role === "ADMIN").length,
      icon: <Shield size={18} />,
    },
  ];

  const handleRoleChange = async (userId, role) => {
    try {
      await adminApi.updateUserRole(userId, role);
      toast.success("Роль оновлено");
      reload();
    } catch (error) {
      toast.error(error.message || "Не вдалося оновити роль");
    }
  };

  return (
    <div className="admin-page">
      <AdminPageHeader title="Користувачі" description="Керуйте командами та клієнтами" />

      <AdminStatsGrid items={stats} />

      <AdminToolbar>
        <input placeholder="Пошук" value={search} onChange={(event) => setSearch(event.target.value)} />
        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          <option value="all">Усі ролі</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </AdminToolbar>

      <section className="card">
        {loading ? (
          <p className="muted">Завантаження…</p>
        ) : (
          <AdminTable
            data={filteredUsers}
            columns={[
              {
                header: "Ім'я",
                render: (user) => (
                  <div>
                    <strong>{user.name}</strong>
                    <p className="muted small">{user.email}</p>
                  </div>
                ),
              },
              {
                header: "Телефон",
                render: (user) => user.phone || "—",
              },
              {
                header: "Замовлення",
                render: (user) => user._count?.orders || 0,
              },
              {
                header: "Роль",
                render: (user) => (
                  <select value={user.role} onChange={(event) => handleRoleChange(user.id, event.target.value)}>
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                ),
              },
            ]}
            emptyLabel="Користувачі ще не зареєстровувались"
          />
        )}
      </section>
    </div>
  );
};

export default Users;

