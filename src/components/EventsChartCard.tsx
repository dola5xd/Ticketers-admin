import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getEvents } from "@/lib/api";

// Define all 12 month labels.
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function EventsLineChartCard() {
  const [data, setData] = useState<{ month: string; events: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const events = await getEvents();
      const currentYear = new Date().getFullYear();

      // Initialize counts for each month (all 12 months)
      const monthCounts: Record<string, number> = {};
      MONTH_LABELS.forEach((label) => {
        monthCounts[label] = 0;
      });

      events.forEach(({ dateTime }) => {
        const eventDate = new Date(dateTime);
        // Only include events for the current year
        if (eventDate.getFullYear() === currentYear) {
          const monthIndex = eventDate.getMonth(); // 0 = Jan, 11 = Dec
          const label = MONTH_LABELS[monthIndex];
          monthCounts[label] = (monthCounts[label] || 0) + 1;
        }
      });

      // Map MONTH_LABELS to chart data (ensuring all 12 months appear)
      const chartData = MONTH_LABELS.map((label) => ({
        month: label,
        events: monthCounts[label],
      }));

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 h-full">
      <CardHeader>
        <CardTitle>Events Over the Year</CardTitle>
        <CardDescription>{new Date().getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#666"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#E5E7EB", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#E5E7EB", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="events"
              stroke="#fff"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
