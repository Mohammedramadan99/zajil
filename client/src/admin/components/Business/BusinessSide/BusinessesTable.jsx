import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Typography,
  Paper,
  TablePagination,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

// import EnhancedTableHead from "../../components/EnhancedTableHead/EnhancedTableHead";
import EnhancedTableHead from "../../PublicComponents/EnhancedTableHead/EnhancedTableHead";
import { useTable } from "../../../hooks/useTable";
import { sortTable } from "../../../utils/sortTable";
const headers = [
  { id: "title", label: "Title" },
  { id: "branches", label: "Branches" },
  { id: "actions", label: "Actions" },
];
const BusinessesTable = ({ data = [] }) => {
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
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="p1"
        component={"p"}
        sx={{ color: theme.palette.grey[300], fontSize: 13, mb: 2 }}>
        All Businesses
      </Typography>
      <TableContainer>
        <Table>
          <EnhancedTableHead
            headers={headers}
            order={order}
            orderBy={orderBy}
            onSortClick={onSortClick}
          />
          <TableBody>
            {sortTable(data, order, orderBy)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
                  </TableCell>
                  <TableCell>{order.dateCreated}</TableCell>
                  <TableCell>
                    <Link to={`/admin/users/1`}>{order.customerName}</Link>
                  </TableCell>
                  <TableCell>{order.amount}$</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <span className={`${order.status}`}>{order.status}</span>
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
    </Paper>
  );
};

export default BusinessesTable;
