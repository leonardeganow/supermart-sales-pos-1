import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
function Loading() {
  return (
    <div>
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="border">Name</TableHead>
            <TableHead className="border">Role</TableHead>
            <TableHead className="border">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="border">
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell className="border">
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
            <TableCell className="border">
              <Skeleton className="h-4 w-1/2" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default Loading;
