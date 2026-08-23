import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Portfolio of Kashfi — Admin Panel" }],
  }),
});

function AdminPage() {
  return <AdminLayout />;
}
