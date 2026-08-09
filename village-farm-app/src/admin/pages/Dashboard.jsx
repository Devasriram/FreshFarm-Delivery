import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import { getDashboardSummary } from "../services/dashboardService";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h2 className="text-xl">Loading Dashboard...</h2>;
  }

  const cards = [
    {
      title: "Total Customers",
      value: summary.total_customers,
      color: "#2563EB",
    },
    {
      title: "Total Categories",
      value: summary.total_categories,
      color: "#7C3AED",
    },
    {
      title: "Total Products",
      value: summary.total_products,
      color: "#059669",
    },
    {
      title: "Total Orders",
      value: summary.total_orders,
      color: "#EA580C",
    },
    {
      title: "Pending Orders",
      value: summary.pending_orders,
      color: "#D97706",
    },
    {
      title: "Delivered Orders",
      value: summary.delivered_orders,
      color: "#16A34A",
    },
    {
      title: "Total Revenue",
      value: `₹${summary.total_revenue}`,
      color: "#DC2626",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;