import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

interface LULCData {
  areaName: string;
  level: "county" | "subcounty";
  classes: {
    [className: string]: {
      hectares: number;
      percentage: number;
    };
  };
}

interface LULCDashboardProps {
  data?: LULCData;
}

// Sample data - in production this would come from props/API
const sampleData: LULCData = {
  areaName: "Murang'a County",
  level: "county",
  classes: {
    Crop: { hectares: 129919.25, percentage: 51.1 },
    Trees: { hectares: 51423.65, percentage: 20.23 },
    Road: { hectares: 31428.71, percentage: 12.36 },
    Building: { hectares: 21886.05, percentage: 8.61 },
    "Shrub & Scrub": { hectares: 15931.48, percentage: 6.27 },
    Grass: { hectares: 1442.52, percentage: 0.57 },
    Water: { hectares: 1184.94, percentage: 0.47 },
    "Bare Ground": { hectares: 1007.88, percentage: 0.4 },
  },
};

const LULCDashboard: React.FC<LULCDashboardProps> = ({ data = sampleData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState<"doughnut" | "bar">("doughnut");
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Color palette for different land use classes
  const getClassColor = (className: string): string => {
    const colorMap: { [key: string]: string } = {
      Crop: "#10B981", // Green
      Trees: "#059669", // Dark Green
      Road: "#6B7280", // Gray
      Building: "#EF4444", // Red
      "Shrub & Scrub": "#84CC16", // Light Green
      Grass: "#22C55E", // Medium Green
      Water: "#3B82F6", // Blue
      "Bare Ground": "#A3A3A3", // Light Gray
    };
    return colorMap[className] || "#8B5CF6";
  };

  const classes = Object.keys(data.classes);
  const hectares = classes.map((cls) => data.classes[cls].hectares);
  const percentages = classes.map((cls) => data.classes[cls].percentage);
  const colors = classes.map((cls) => getClassColor(cls));

  const doughnutData = {
    labels: classes,
    datasets: [
      {
        data: percentages,
        backgroundColor: colors,
        borderColor: colors.map((color) => color + "20"),
        borderWidth: 2,
        hoverBorderWidth: 4,
        hoverOffset: 10,
      },
    ],
  };

  const barData = {
    labels: classes,
    datasets: [
      {
        label: "Area (Hectares)",
        data: hectares,
        backgroundColor: colors.map((color) => color + "80"),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const className = context.label;
            const hectares = data.classes[className].hectares.toLocaleString();
            const percentage = data.classes[className].percentage;
            return [`${className}`, `${hectares} hectares (${percentage}%)`];
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutQuart" as const,
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(107, 114, 128, 0.2)",
        },
        ticks: {
          color: "#6B7280",
          callback: (value: any) => `${(value / 1000).toFixed(0)}k`,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          maxRotation: 45,
        },
      },
    },
  };

  const totalArea = Object.values(data.classes).reduce(
    (sum, cls) => sum + cls.hectares,
    0
  );

  const getInsightText = () => {
    const topClass = classes[0];
    const topPercentage = data.classes[topClass].percentage;

    return {
      title: "Land Use Analysis",
      insights: [
        `${topClass} dominates the landscape, covering ${topPercentage}% of ${data.areaName}`,
        `Agricultural activities (Crop + Trees) account for ${(
          data.classes["Crop"]?.percentage + data.classes["Trees"]?.percentage
        ).toFixed(1)}% of total area`,
        `Built environment (Building + Road) covers ${(
          data.classes["Building"]?.percentage +
          data.classes["Road"]?.percentage
        ).toFixed(1)}% of the region`,
        `Natural vegetation (Trees + Shrub & Scrub + Grass) represents ${(
          data.classes["Trees"]?.percentage +
          data.classes["Shrub & Scrub"]?.percentage +
          data.classes["Grass"]?.percentage
        ).toFixed(1)}% coverage`,
      ],
    };
  };

  const insights = getInsightText();

  return (
    <div
      ref={componentRef}
      className={`bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-1000 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{
        minHeight: "500px",
        maxHeight: "calc(100vh - 140px)",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Land Use Land Cover Analysis
            </h2>
            <p className="text-blue-100 mt-1">
              {data.areaName} •{" "}
              {data.level.charAt(0).toUpperCase() + data.level.slice(1)} Level
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {(totalArea / 1000).toFixed(1)}K
            </div>
            <div className="text-blue-100 text-sm">Total Hectares</div>
          </div>
        </div>
      </div>

      {/* Chart Toggle */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView("doughnut")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeView === "doughnut"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Distribution View
          </button>
          <button
            onClick={() => setActiveView("bar")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300  ${
              activeView === "bar"
                ? "bg-blue-100 text-blue-700 shadow-md"
                : "text-gray-600 bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Comparison View
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div className="space-y-4">
            <div className="h-80 relative">
              {activeView === "doughnut" ? (
                <Doughnut data={doughnutData} options={chartOptions} />
              ) : (
                <Bar data={barData} options={barOptions} />
              )}
            </div>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-6">
            {/* Legend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Land Use Classes
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto overflow-x-hidden">
                {classes.map((className) => (
                  <div
                    key={className}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                      hoveredClass === className
                        ? "bg-gray-50 border-gray-300 shadow-md transform scale-105"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onMouseEnter={() => setHoveredClass(className)}
                    onMouseLeave={() => setHoveredClass(null)}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: getClassColor(className) }}
                      />
                      <span className="font-medium text-gray-800">
                        {className}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {data.classes[className].percentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.classes[className].hectares.toLocaleString()} ha
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            {insights.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 transition-all duration-500 transform ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${(index + 1) * 200}ms` }}
              >
                <p className="text-gray-700 text-sm leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700">
              {(
                (data.classes["Crop"]?.hectares || 0) +
                (data.classes["Trees"]?.hectares || 0) / 1000
              ).toFixed(0)}
              K
            </div>
            <div className="text-green-600 text-sm">Agricultural Area (ha)</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">
              {(data.classes["Water"]?.hectares || 0).toFixed(0)}
            </div>
            <div className="text-blue-600 text-sm">Water Bodies (ha)</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">
              {(
                (data.classes["Building"]?.hectares || 0) +
                (data.classes["Road"]?.hectares || 0) / 1000
              ).toFixed(0)}
              K
            </div>
            <div className="text-gray-600 text-sm">Built Environment (ha)</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-700">
              {classes.length}
            </div>
            <div className="text-emerald-600 text-sm">Land Use Classes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LULCDashboard;
