import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    label: string; 
    totalEarnings: number;
  }[];
  month?: number; 
}

const CustomGraph = ({ data, month }: Props) => {
  const formatLabel = (label: string) => {
    if (month) {
      // Daily View: label = day of month (1–31)
      return `Day ${label}`;
    } else {
      // Monthly View: convert "5" → "May"
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return monthNames[parseInt(label) - 1] || label;
    }
  };

  if (!data || data.length === 0) return <p>No earnings data</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" tickFormatter={formatLabel} />
        <YAxis />
        <Tooltip formatter={(value: number) => `₹${value}`} labelFormatter={formatLabel} />
        <Bar dataKey="totalEarnings" fill="#1976d2" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomGraph;
