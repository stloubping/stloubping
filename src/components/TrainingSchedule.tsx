"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  return (
    <Card className="bg-clubLight shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl text-clubDark">Planning des Entraînements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-clubDark text-clubDark-foreground hover:bg-clubDark">
                <TableHead className="text-clubDark-foreground w-[80px]">Heure</TableHead>
                <TableHead className="text-clubDark-foreground">Lun</TableHead>
                <TableHead className="text-clubDark-foreground">Mar</TableHead>
                <TableHead className="text-clubDark-foreground">Mer</TableHead>
                <TableHead className="text-clubDark-foreground">Jeu</TableHead>
                <TableHead className="text-clubDark-foreground">Ven</TableHead>
                <TableHead className="text-clubDark-foreground">Sam</TableHead>
                <TableHead className="text-clubDark-foreground">Dim</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleData.map((row, index) => (
                <TableRow key={index} className="text-clubLight-foreground">
                  <TableCell className="font-medium">{row.time}</TableCell>
                  <TableCell>{row.mon}</TableCell>
                  <TableCell>{row.tue}</TableCell>
                  <TableCell>{row.wed}</TableCell>
                  <TableCell>{row.thu}</TableCell>
                  <TableCell>{row.fri}</TableCell>
                  <TableCell>{row.sat}</TableCell>
                  <TableCell>{row.sun}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Les créneaux "Libre" sont ouverts à tous les adhérents. Les entraînements spécifiques sont encadrés.
        </p>
      </CardContent>
    </Card>
  );
};

export default TrainingSchedule;