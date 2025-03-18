import { Bar, Pie } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, scales, Title, Tooltip } from "chart.js";
import { ITopSales, ITopSalesResponse } from "../../../../../models/interface/ITopSales";
import { useEffect, useState } from "react";
import { searchApi } from "../../../../../api/SalesApi/searchApi";
import { TopSales } from "../../../../../api/api";

// Chart.js에서 필요한 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, scales);

export const TopSalesBar = () => {
    const [topSales, setTopSales] = useState<ITopSales[]>([]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    useEffect(() => {
        searchTopSales();
    }, []);

    const searchTopSales = async (currentPage?: number) => {
        const result = await searchApi<ITopSalesResponse>(TopSales.searchList, {
            searchYear: String(currentYear),
            searchMonth: String(currentMonth),
            currentPage,
            pageSize: 10,
        });
        if (result) {
            let data = result.topSalesList;

            while (data.length < 10) {
                data.push({
                    currentRank: "-",
                    supplierName: "-",
                    performance: "-",
                } as ITopSales);
            }
            setTopSales(result.topSalesList);
        }
    };

    const chartData = topSales.filter((item) => item.performance !== "-");

    // 데이터가 없는 경우 기본값 설정
    const labels = chartData.length > 0 ? chartData.map((item) => item.supplierName) : ["데이터 없음"];
    const dataValues = chartData.length > 0 ? chartData.map((item) => item.performance) : [0];

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
            },
        ],
    };

    const reportOptions = {
        responsive: true,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            title: {
                display: true,
                text: " 기업별 매출 리포트",
                font: {
                    size: 16,
                    weight: "bold" as const,
                },
            },
            legend: {
                display: false,
                position: "bottom" as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                },
            },
            datalabels: {
                color: "black",
                formatter: function (value: any, context: any) {
                    return `${value.toLocaleString("ko-KR")}원`; // 라벨과 값을 함께 표시
                },
                anchor: "center" as const, // 중앙에 텍스트 배치
                align: "center" as const, // 중앙 정렬
                font: {
                    size: 13, // 라벨 크기 설정
                    weight: 700, // 라벨 글씨 두께
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => value.toLocaleString() + "원",
                },
            },
        },
    };

    return <Bar data={data} options={reportOptions} />;
};
