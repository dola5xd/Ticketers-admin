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
    <Card className="h-[75vh] bg-[var(--color-tuna-50)] dark:bg-[var(--color-tuna-1000)]">
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
              stroke="var(--chart-axis)"
            />
            <XAxis
              type="number"
              tick={{ fill: "var(--chart-axis)", fontSize: 14 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={140}
            />
            <Tooltip
              cursor={{ fill: "rgba(255, 255, 255, 0)" }}
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                border: "none",
              }}
              labelStyle={{ color: "var(--chart-tooltip-text)" }}
              itemStyle={{ color: "var(--chart-tooltip-text)" }}
              formatter={(value) => [value, "Events"]}
            />
            <Bar
              dataKey="count"
              fill="var(--chart-fill)"
              barSize={30}
              radius={[8, 8, 8, 8]}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((_, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={
                    hoveredIndex === index
                      ? "var(--chart-fill-hover)"
                      : "var(--chart-fill)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
