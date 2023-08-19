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
  Button,
  Avatar,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";

// import EnhancedTableHead from "../../components/EnhancedTableHead/EnhancedTableHead";
import EnhancedTableHead from "../../components/PublicComponents/EnhancedTableHead/EnhancedTableHead";
import { useTable } from "../../utils/useTable";
import { sortTable } from "../../utils/sortTable";

const headers = [
  { id: "id", label: "ID" },
  { id: "customer", label: "Customer" },
  { id: "date", label: "Date" },
  { id: "items", label: "Items" },
  { id: "price", label: "Price" },
  { id: "status", label: "Status" },
  { id: "action", label: "" },
];
const OrdersTable = ({ data = [] }) => {
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

  const onDelete = (id) => {
    
  };
  return (
    <Paper sx={{ p: 3, backgroundColor: theme.palette.grey[900] }}>
      <Typography
        variant="p1"
        component={"p"}
        sx={{ color: theme.palette.grey[300], fontSize: 13, mb: 2 }}>
        All orders
      </Typography>
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
          <TableBody>
            {sortTable(data, order, orderBy)
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell align="right">
                    <Link to={`/admin/orders/${item.id}`}>{item.id}</Link>
                  </TableCell>

                  <TableCell align="right">
                    <Link to={`/admin/users/1`}>
                      <Stack direction={"row"} alignItems={"center"} gap={2}>
                        <Avatar src={item.customer.avatar} />
                        <span> {item.customer.name} </span>
                      </Stack>
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    <Link to={`/admin/users/1`}>{item.date}</Link>
                  </TableCell>
                  <TableCell align="right">
                    <Link to={`/admin/users/1`}>{item.items.length}</Link>
                  </TableCell>
                  <TableCell align="right">
                    <Link to={`/admin/users/1`}>{item.price}</Link>
                  </TableCell>
                  <TableCell align="right">
                    <span className={`${item.status}`}>{item.status}</span>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => onDelete(item.id)}>
                      delete
                    </Button>
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

export default OrdersTable;
