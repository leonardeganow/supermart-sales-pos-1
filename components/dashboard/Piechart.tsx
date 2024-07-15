"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DashboardPieChart(props: any) {
  const chartData = [
    {
      type: "Card",
      count: props.chartData.paymentMethods[0].count,
      fill: "var(--color-Card)",
    },
    {
      type: "Momo",
      count: props.chartData.paymentMethods[1].count,
      fill: "var(--color-Momo)",
    },
    {
      type: "Cash",
      count: props.chartData.paymentMethods[2].count,
      fill: "var(--color-Cash)",
    },
  ];

  const chartConfig = {
    paymethod: {
      label: "Paymethod",
    },
    Card: {
      label: "card",
      color: "hsl(var(--chart-1))",
    },
    Momo: {
      label: "mobile money",
      color: "hsl(var(--chart-2))",
    },
    Cash: {
      label: "cash",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Total count</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="paymethod" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="type"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing payment methods used the most
        </div>
      </CardFooter>
    </Card>
  );
}
