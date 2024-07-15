"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({
  className,
  rangePickerDate,
  setRangePickerDate,
}: any) {
  // const [date, setDate] = React.useState<DateRange | undefined>({
  //   from: new Date(2022, 0, 20),
  //   to: addDays(new Date(2022, 0, 20), 20),
  // });

  // console.log(date);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !rangePickerDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {rangePickerDate?.from ? (
              rangePickerDate.to ? (
                <>
                  {format(rangePickerDate.from, "LLL dd, y")} -{" "}
                  {format(rangePickerDate.to, "LLL dd, y")}
                </>
              ) : (
                format(rangePickerDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={rangePickerDate?.from}
            selected={rangePickerDate}
            onSelect={setRangePickerDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
