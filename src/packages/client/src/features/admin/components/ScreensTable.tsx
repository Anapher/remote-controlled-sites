import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { ScreenDto } from "../../../shared/Screen";
import { selectScreens } from "../slice";

type Props = {
  onDelete: (screen: ScreenDto) => void;
};

export default function ScreensTable({ onDelete }: Props) {
  const screens = useSelector(selectScreens);
  console.log(screens);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Aktueller Content</TableCell>
          <TableCell>Aktionen</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {screens?.map((x) => (
          <TableRow key={x.name}>
            <TableCell>{x.name}</TableCell>
            <TableCell>asd</TableCell>
            <TableCell>
              <Button onClick={() => onDelete(x)}>Löschen</Button>
              <Button>Bearbeiten</Button>
              <Button>Url kopieren</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
