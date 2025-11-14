"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Import cn for conditional class merging

const TrainingSchedule = () => {
  const scheduleData = [
    { time: "09:00", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "Loisirs Primaire", sun: "" },
    { time: "10:00", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "9H-10H30", sun: "" },
    { time: "10:30", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "Loisirs Collège", sun: "" },
    { time: "11:00", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "10H30-12H", sun: "" },
    { time: "12:00", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" },
    { time: "16:00", mon: "", tue: "", wed: "Jeunes Débutants", thu: "", fri: "", sat: "", sun: "" },
    { time: "16:30", mon: "", tue: "", wed: "16H30-17H30", thu: "", fri: "", sat: "", sun: "" },
    { time: "17:00", mon: "", tue: "", wed: "Jeunes Compétiteurs", thu: "Loisirs Primaire", fri: "Jeunes Débutant", sat: "", sun: "" },
    { time: "17:30", mon: "", tue: "", wed: "17H30-19H", thu: "17H-18H", fri: "17H-18H30", sat: "", sun: "" },
    { time: "18:00", mon: "Libre", tue: "Libre", wed: "Adultes Compétiteurs", thu: "Loisirs Collège", fri: "Jeunes Compétiteurs", sat: "", sun: "" },
    { time: "18:30", mon: "18H-20H", tue: "18H-20H", wed: "19H-20H30", thu: "18H-19H30", fri: "18H30-20H", sat: "", sun: "" },
    { time: "19:00", mon: "", tue: "", wed: "", thu: "Adultes Loisirs", fri: "", sat: "", sun: "" },
    { time: "19:30", mon: "", tue: "", wed: "", thu: "19H30-21H", fri: "", sat: "", sun: "" },
    { time: "20:00", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" },
    { time: "21:00", mon: "", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "" },
  ];

  const renderCellContent = (content: string) => {
    if (!content) {
      return <span className="text-muted-foreground/60 text-xs">-</span>;
    }

    let cellClasses = "px-2 py-1 rounded-md text-center text-xs md:text-sm";
    let textClasses = "font-medium";

    if (content.includes("Libre")) {
      cellClasses = cn(cellClasses, "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200");
    } else if (content.includes("Compétiteurs")) {
      cellClasses = cn(cellClasses, "bg-clubPrimary/10 text-clubPrimary dark:bg-clubPrimary/20 dark:text-clubPrimary-foreground");
      textClasses = cn(textClasses, "font-bold");
    } else if (content.includes("Débutants") || content.includes("Loisirs")) {
      cellClasses = cn(cellClasses, "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200");
    } else if (content.includes("Primaire") || content.includes("Collège")) {
      cellClasses = cn(cellClasses, "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200");
    } else {
      cellClasses = cn(cellClasses, "bg-clubSection text-clubDark dark:bg-clubSection/20 dark:text-clubLight-foreground");
    }

    return <span className={cellClasses}><span className={textClasses}>{content}</span></span>;
  };

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl text-clubDark">Planning des Entraînements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-full divide-y divide-border">
            <TableHeader>
              <TableRow className="bg-clubDark text-clubDark-foreground hover:bg-clubDark">
                <TableHead className="text-clubDark-foreground w-[80px] text-center py-3 px-2">Heure</TableHead>
                <TableHead className="text-clubDark-foreground text-center py-3 px-2">Lun</TableHead>
                <TableHead className="text-clubDark-foreground text-center py-3 px-2">Mar</TableHead>
                <TableHead className="text-clubDark-foreground text-center py-3 px-2">Mer</TableHead>
                <TableHead className="text-clubDark-foreground text-center py-3 px-2">Jeu</TableHead>
                <TableHead className="text-clubDark-foreground text-center py-3 px-2">Ven</TableHead>
                <TableHead className="text-clubDark-foreground text-center py-3 px-2">Sam</TableHead>
                <TableHead className="text-clubDark-foreground text-center py-3 px-2">Dim</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleData.map((row, index) => (
                <TableRow key={index} className="even:bg-clubSection/20 odd:bg-clubLight hover:bg-clubSection/40 transition-colors duration-200 border-b border-border">
                  <TableCell className="font-semibold text-clubDark text-center py-2 px-2 text-sm md:text-base">{row.time}</TableCell>
                  <TableCell className="py-2 px-2 text-center">{renderCellContent(row.mon)}</TableCell>
                  <TableCell className="py-2 px-2 text-center">{renderCellContent(row.tue)}</TableCell>
                  <TableCell className="py-2 px-2 text-center">{renderCellContent(row.wed)}</TableCell>
                  <TableCell className="py-2 px-2 text-center">{renderCellContent(row.thu)}</TableCell>
                  <TableCell className="py-2 px-2 text-center">{renderCellContent(row.fri)}</TableCell>
                  <TableCell className="py-2 px-2 text-center">{renderCellContent(row.sat)}</TableCell>
                  <TableCell className="py-2 px-2 text-center">{renderCellContent(row.sun)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground text-center">
          Les créneaux "Libre" sont ouverts à tous les adhérents. Les entraînements spécifiques sont encadrés.
        </p>
      </CardContent>
    </Card>
  );
};

export default TrainingSchedule;