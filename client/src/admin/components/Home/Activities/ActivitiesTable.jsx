import React, { useEffect } from "react";
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
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // Import the relativeTime plugin
dayjs.extend(relativeTime); // Extend dayjs with the relativeTime plugin

import EnhancedTableHead from "../../../components/PublicComponents/EnhancedTableHead/EnhancedTableHead";
import { useTable } from "../../../hooks/useTable";
import { sortTable } from "../../../utils/sortTable";
import BasicSelect from "../BasicSelect";
import { useDispatch, useSelector } from "react-redux";
import { getBusinesses } from "../../../../store/businessSlice";

const headers = [
  { id: "message", label: "Message" },
  { id: "type", label: "Type" },
  { id: "clientName", label: "Client Name" },
  { id: "createdAt", label: "Created At" },
];
const ActivitiesTable = ({
  data = [],
  activitiesTableSelect,
  setActivitiesTableSelect,
}) => {
  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    setRowsPerPage,
    setPage,
    onSortClick,
  } = useTable();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { businesses } = useSelector((state) => state.businesses);
  const handleChange = (e) => {
    setActivitiesTableSelect(e.target.value);
  };
  useEffect(() => {
    dispatch(getBusinesses());
  }, []);

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}>
        <Typography
          variant="body1"
          sx={{ p: 2, color: theme.palette.primary[300] }}>
          Activities
        </Typography>
        <Box sx={{ width: "150px", m: 2 }}>
          <BasicSelect
            handleChange={handleChange}
            value={activitiesTableSelect}
            items={businesses}
          />
        </Box>
      </Stack>
      <Card sx={{ backgroundColor: theme.palette.grey[900] }}>
        {/* {activities?.length > 0 && ( */}
        <TableContainer>
          <Table
            sx={{ height: "450px" }}
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
                  <TableRow key={item.businessId} sx={{ width: "100px" }}>
                    <TableCell
                      align="left"
                      sx={{
                        borderColor: "transparent",
                        color: theme.palette.secondary[500],
                        maxWidth: item.message ? "200px" : "100px",
                        width: "100%",
                      }}>
                      {/* <Link to={`/admin/users/1`}> */}
                      <Stack direction={"row"} alignItems={"center"} gap={2}>
                        {item.message.replace(
                          "ITEMS_SUBSCRIPTION",
                          "SUBSCRIPTION"
                        )}
                      </Stack>
                      {/* </Link> */}
                    </TableCell>
                    <TableCell align="left" sx={{ borderColor: "transparent" }}>
                      <Typography
                        fontSize={12}
                        sx={{
                          backgroundColor: theme.palette.light[1],
                          color: theme.palette.primary[200],
                          p: "2px 5px",
                          borderRadius: 2,
                          textAlign: "center",
                        }}>
                        {item.type}
                      </Typography>
                    </TableCell>
                    <TableCell align="left" sx={{ borderColor: "transparent" }}>
                      <Link to={`/admin/users/1`}>{item.card.clientName}</Link>
                    </TableCell>
                    <TableCell align="left" sx={{ borderColor: "transparent" }}>
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
            rowsPerPageOptions={[5]}
            onPageChange={(e, page) => {
              setPage(page);
            }}
            onRowsPerPageChange={(e) => {
              setPage(0);
              setRowsPerPage(e.target.value);
            }}
          />
        </TableContainer>
        {/* )} */}
      </Card>
    </>
  );
};

export default ActivitiesTable;
