import AdminLayout from "@components/admin/AdminLayout";
import api from "@utils/api";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard by default
    router.replace("/admin/dashboard");
  }, []);

  useEffect(() => {
    api
      .get("/api/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => alert(err.response?.data?.message || "Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <h2>All Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}