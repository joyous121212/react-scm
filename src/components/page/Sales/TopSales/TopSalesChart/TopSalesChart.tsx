import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ITopSales } from "../../../../../models/interface/ITopSales";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Chart.js에서 필요한 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

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
                    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
                    "#FFCD56", "#C9CBCF", "#4D5360", "#6A1B9A"
                ],
                hoverOffset: 4,
            }
        ]
        
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true, // ✅ 범례 표시 활성화
                position: "top"as const, // ✅ 범례를 차트 상단에 배치
                labels: {
                    font: {
                        size: 14, // ✅ 글씨 크기 설정
                    },
                },
            },           
            datalabels: {
                color: "#000000",
                formatter: function (value: any, context: any) {
                    const label = context.chart.data.labels[context.dataIndex];
                    const dataset = context.chart.data.datasets[0].data; // 전체 데이터셋
                    const total = dataset.reduce((acc: number, curr: number) => acc + curr, 0); // 전체 합계
                    const percentage = ((value / total) * 100).toFixed(1); // 퍼센트 계산 및 소수점 1자리까지 표시
                    return `${label}: ${percentage}%`; // 라벨과 값을 함께 표시
                },
                anchor: "center" as const, // 중앙에 텍스트 배치
                align: "center" as const, // 중앙 정렬
                font: {
                    size: 15, // 라벨 크기 설정
                    weight: 700, // 라벨 글씨 두께
                },
                padding: 5, // 라벨과 차트 사이의 여백
            }
        }
    };

    return <Pie data={data} options={options} />;
};
