import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getEvents, getCinemas } from "@/lib/api";
import type { Events, Cinema } from "@/lib/api";

export function CinemasChartCard() {
  const [data, setData] = useState<{ name: string; count: number }[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [events, cinemas] = await Promise.all([getEvents(), getCinemas()]);

      const counts: Record<string, number> = {};
      events.forEach((event: Events) => {
        const cinemaId = event.cinema._ref;
        counts[cinemaId] = (counts[cinemaId] || 0) + 1;
      });

      const chartData = cinemas
        .map((cinema: Cinema) => ({
          name: cinema.name,
          count: counts[cinema._id] || 0,
        }))
        .filter((item: { count: number }) => item.count > 0);

      chartData.sort(
        (a: { count: number }, b: { count: number }) => b.count - a.count
      );

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 h-[75vh]">
      <CardHeader>
        <CardTitle className="text-sm">Cinemas with Most Events</CardTitle>
        <CardDescription className="text-gray-400">
          Full Year Statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <ResponsiveContainer width="125%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            barCategoryGap={15}
            className="-translate-x-14"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#666"
            />
            <XAxis
              type="number"
              tick={{ fill: "#E5E7EB", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "#E5E7EB", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0)" }}
              contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
              formatter={(value) => [value, "Events"]}
            />
            <Bar
              dataKey="count"
              fill="#c2c2c2"
              barSize={30}
              radius={[8, 8, 8, 8]}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={hoveredIndex === index ? "#5E40BE" : "#876FD4"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
