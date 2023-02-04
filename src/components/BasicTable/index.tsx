import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface ITableRow {
    key: string | number;
    columns: string[];
    rowData?: any;
    disabledButton?: boolean;
    buttonComponent?: React.ElementType;
    buttonProps?: any;
}

interface IProps {
    labels: string[];
    rows: ITableRow[];
    onButtonClicked?: (key, rowData) => any;
    loading?: boolean;
}

export function BasicTable(props: IProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {props.labels.map((label, index) => (
                            <TableCell key={index} align="center">
                                {label}
                            </TableCell>
                        ))}
                        {props.onButtonClicked ? <TableCell></TableCell> : null}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {props.rows.map((row, columIndex) => (
                        <TableRow key={columIndex} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            {row.columns.map((column, valueIndex) => (
                                <TableCell key={`${columIndex}-${valueIndex}`} align="center">
                                    {column}
                                </TableCell>
                            ))}

                            {props.onButtonClicked ? (
                                <TableCell align="right">
                                    <row.buttonComponent
                                        disabled={row.disabledButton}
                                        onClick={() => props.onButtonClicked(row.key, row.rowData)}
                                        {...row.buttonProps}
                                    />
                                </TableCell>
                            ) : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {props.loading && !props.rows.length ? (
                <Box sx={{ display: "flex", justifyContent: "center", padding: 5 }}>
                    <CircularProgress />
                </Box>
            ) : null}

            {!props.loading && !props.rows.length ? (
                <Box sx={{ display: "flex", justifyContent: "center", padding: 5, backgroundColor: "#ecececcc" }}>
                    <Typography>Nenhum dado cadastrado!</Typography>
                </Box>
            ) : null}
        </TableContainer>
    );
}
