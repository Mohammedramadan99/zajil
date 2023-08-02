import React from "react";
import {
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Typography,
  Paper,
  TablePagination,
  useTheme,
  Button,
  Avatar,
  Stack,
  Card,
} from "@mui/material";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // Import the relativeTime plugin
dayjs.extend(relativeTime); // Extend dayjs with the relativeTime plugin

import EnhancedTableHead from "../../../components/PublicComponents/EnhancedTableHead/EnhancedTableHead";
import { useTable } from "../../../hooks/useTable";
import { sortTable } from "../../../utils/sortTable";

const headers = [
  { id: "message", label: "Message" },
  { id: "type", label: "Type" },
  { id: "clientName", label: "Client Name" },
  { id: "createdAt", label: "Created At" },
];
const ActivitiesTable = ({ data = [] }) => {
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    setRowsPerPage,
    setPage,
    onSortClick,
  } = useTable();
  const theme = useTheme();

  return (
    <>
      <Typography
        variant="body1"
        sx={{ p: 2, color: theme.palette.primary[300] }}>
        Activities
      </Typography>
      <Card sx={{ backgroundColor: theme.palette.grey[900] }}>
        <TableContainer>
          <Table
            xs={{
              "&td": {},
            }}>
            <EnhancedTableHead
              headers={headers}
              order={order}
              orderBy={orderBy}
              onSortClick={onSortClick}
            />
            <TableBody sx={{ p: 3 }}>
              {sortTable(data, order, orderBy)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.businessId}>
                    <TableCell
                      align="left"
                      sx={{ borderColor: "transparent" }}>
                      <Link to={`/admin/users/1`}>
                        <Stack direction={"row"} alignItems={"center"} gap={2}>
                          {item.message}
                        </Stack>
                      </Link>
                    </TableCell>
                    <TableCell align="left" sx={{borderColor:"transparent"}}>
                      <Link to={`/admin/users/1`}>{item.type}</Link>
                    </TableCell>
                    <TableCell align="left" sx={{borderColor:"transparent"}}>
                      <Link to={`/admin/users/1`}>{item.card.clientName}</Link>
                    </TableCell>
                    <TableCell align="left" sx={{borderColor:"transparent"}}>
                      <Link to={`/admin/users/1`}>
                        {dayjs(item.createdAt).fromNow()}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            component={"div"}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            rowsPerPageOptions={[5, 10, 20]}
            onPageChange={(e, page) => {
              setPage(page);
            }}
            onRowsPerPageChange={(e) => {
              setPage(0);
              setRowsPerPage(e.target.value);
            }}
          />
        </TableContainer>
      </Card>
    </>
  );
};

export default ActivitiesTable;
