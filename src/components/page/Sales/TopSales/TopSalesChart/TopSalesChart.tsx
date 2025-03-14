import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ITopSales } from "../../../../../models/interface/ITopSales";

// Chart.js에서 필요한 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);

interface TopSalesChartProps {
    topSales: ITopSales[];
}

export const TopSalesChart = ({ topSales }: TopSalesChartProps) => {
    // 데이터가 없는 경우 기본값 설정
    const labels = topSales.length > 0 ? topSales.map((item) => item.supplierName) : ["데이터 없음"];
    const dataValues = topSales.length > 0 ? topSales.map((item) => item.performance) : [0];

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#4BC0C0",
                    "#9966FF",
                    "#FF9F40",
                    "#FFCD56",
                    "#C9CBCF",
                    "#4D5360",
                    "#6A1B9A",
                ],
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true, // ✅ 범례 표시 활성화
                position: "top" as const, // ✅ 범례를 차트 상단에 배치
                labels: {
                    font: {
                        size: 14, // ✅ 글씨 크기 설정
                    },
                },
            },
            title: { display: true, text: "Top Sales Distribution (2025년 3월)" },
        },
    };

    return <Pie data={data} options={options} />;
};
