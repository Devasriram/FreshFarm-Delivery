import { useEffect, useState } from "react";
import {
    getSummary,
    getMonthlySales,
} from "../services/reportService";
import { Bar } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

function Reports() {
    const [summary, setSummary] = useState(null);
    const [monthlySales, setMonthlySales] = useState([]);

    useEffect(() => {
        loadSummary();
        loadMonthlySales();
    }, []);

    const loadSummary = async () => {
        try {
            const data = await getSummary();
            setSummary(data);
        } catch (error) {
            console.error(error);
            alert("Failed to load reports.");
        }
    };
    const loadMonthlySales = async () => {
        try {
            const data = await getMonthlySales();
            setMonthlySales(data);
        } catch (error) {
            console.error(error);
        }
    };

    if (!summary) {
        return <p className="text-lg">Loading Reports...</p>;
    }
    const chartData = {
        labels: monthlySales.map((item) => `Month ${item.month}`),

        datasets: [
            {
                label: "Revenue",

                data: monthlySales.map((item) => item.revenue),
            },
        ],
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Reports & Analytics
            </h1>

            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded shadow">
                    <h2>Total Revenue</h2>
                    <p className="text-3xl font-bold text-green-700">
                        ₹{summary.revenue}
                    </p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2>Total Orders</h2>
                    <p className="text-3xl font-bold">
                        {summary.orders}
                    </p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2>Total Customers</h2>
                    <p className="text-3xl font-bold">
                        {summary.customers}
                    </p>
                </div>
                <div className="bg-white mt-8 p-6 rounded shadow">

                    <h2 className="text-2xl font-bold mb-5">
                        Monthly Sales
                    </h2>

                    <Bar data={chartData} />

                </div>
            </div>
        </div>
    );
}

export default Reports;