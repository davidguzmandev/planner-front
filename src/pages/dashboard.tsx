import useAuthStore from "@/store/authStore";

export default function Dashboard() {

  const user = useAuthStore((state) =>  state.user);
  if (!user) {
    return <p>You must be logged in to view the dashboard.</p>;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Bienvenido al panel de control. Aquí puedes ver estadísticas, gráficos y accesos rápidos.</p>
    </div>
  )
}
