import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getCustomers } from "@/lib/api";

export function CustomersChartCard() {
  const [data, setData] = useState<{ ageGroup: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const customers = await getCustomers();
      const ageBins: Record<string, number> = {
        "Under 20": 0,
        "20-29": 0,
        "30-39": 0,
        "40-49": 0,
        "50+": 0,
      };

      customers.forEach((customer) => {
        // Convert age to a number (if stored as string)
        const age =
          typeof customer.age === "string"
            ? parseInt(customer.age, 10)
            : customer.age;
        if (isNaN(age)) return;
        if (age < 20) {
          ageBins["Under 20"] += 1;
        } else if (age < 30) {
          ageBins["20-29"] += 1;
        } else if (age < 40) {
          ageBins["30-39"] += 1;
        } else if (age < 50) {
          ageBins["40-49"] += 1;
        } else {
          ageBins["50+"] += 1;
        }
      });

      setData(
        Object.entries(ageBins).map(([ageGroup, count]) => ({
          ageGroup,
          count,
        }))
      );
    };

    fetchData();
  }, []);

  const COLORS = ["#B6A6E9", "#876FD4", "#5E40BE", "#3D2785", "#21134D"];

  return (
    <Card className="bg-tuna-50 dark:bg-gray-800 h-[60vh]">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">
          Customers by Age
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Distribution of new customers by age group
        </CardDescription>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Pie
              data={data}
              dataKey="count"
              nameKey="ageGroup"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              fill="#4F46E5"
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
