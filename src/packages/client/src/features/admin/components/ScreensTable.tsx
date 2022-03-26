import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { ScreenContent, ScreenDto } from "../../../shared/Screen";
import { selectScreens } from "../slice";

function renderContent(content: ScreenContent | null) {
  if (!content)
    return (
      <Typography fontSize="inherit" fontStyle="italic">
        Keiner
      </Typography>
    );

  if (content.type === "url") {
    return <Typography fontSize="inherit">{content.url}</Typography>;
  }
}

type Props = {
  onDelete: (screen: ScreenDto) => void;
  onEdit: (screen: ScreenDto) => void;
};

export default function ScreensTable({ onDelete, onEdit }: Props) {
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
            <TableCell>{renderContent(x.content)}</TableCell>
            <TableCell>
              <Button onClick={() => onDelete(x)}>Löschen</Button>
              <Button onClick={() => onEdit(x)}>Bearbeiten</Button>
              <Button>Url kopieren</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
