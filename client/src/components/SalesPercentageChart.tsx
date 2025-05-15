"use client";
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SalesPercentageChart = ({
  currentSale,
  monthlyTarget,
  isSmall = false,
}: SalesPercentageChartProps) => {
  const [percentange, setPercentage] = useState(0);
  useEffect(() => {
    const per = Math.round((currentSale / monthlyTarget) * 100);
    setPercentage(per);
  }, [currentSale, monthlyTarget]);

  const chartData = [
    { browser: "safari", visitors: percentange, fill: "var(--color-safari)" },
  ];
  const chartConfig = {
    visitors: {
      label: "",
    },
    safari: {
      label: "Safari",
      color: "#00B4D8",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-0 outline-none ring-0 shadow-none w-full h-full flex-grow shrink-0 flex-1 ">
      <CardContent
        className={cn(
          "flex-1 pb-0 border-0 outline-none ring-0 shadow-none",
          isSmall && "w-[200px]"
        )}
      >
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={
              isSmall ? (percentange / 277) * 1000 : (percentange / 277) * 1000
            }
            innerRadius={isSmall ? 65 : 110}
            outerRadius={isSmall ? 115 : 170}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={isSmall ? [75, 55] : [124, 100]}
            />
            <RadialBar dataKey="visitors" background cornerRadius={20} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={cn(
                            "font-semibold fill-primaryGray",
                            isSmall ? "text-2xl" : "text-4xl"
                          )}
                        >
                          {chartData[0].visitors.toLocaleString()}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SalesPercentageChart;
