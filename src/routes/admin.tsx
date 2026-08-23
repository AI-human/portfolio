import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "../components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Portfolio Admin Dashboard — Tahmidul Kashfi" }],
  }),
});

function AdminPage() {
  return <AdminLayout />;
}
