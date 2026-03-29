import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface StatusSummary {
  COMPLETED?: number;
  CANCELLED?: number;
  PENDING?: number;
  CONFIRMED?: number;
  REJECTED?: number;
}

interface Props {
  data: StatusSummary;
}

const COLORS = ["#4caf50", "#f44336", "#ff9800", "#2196f3", "#9e9e9e"]; // Customize if needed

const CustomPieChart = ({ data }: Props) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  if (chartData.length === 0) return <p>No data available</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
