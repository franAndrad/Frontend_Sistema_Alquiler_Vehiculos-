import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function BarChart({ labels, values }) {
  const canvasRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    if (chartInstance) chartInstance.destroy();

    const ctx = canvasRef.current.getContext("2d");

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Facturación mensual (ARS $)",
            data: values,
            backgroundColor: "rgba(59, 130, 246, 0.6)",
            borderColor: "rgba(37, 99, 235, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
      },
    });

    return () => chartInstance.destroy();
  }, [labels, values]);

  return <canvas ref={canvasRef}></canvas>;
}

export default BarChart;
