import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

interface ITableRow {
    key: string;
    columns: string[];
    rowData?: any;
    disabledButton?: boolean;
}

interface IProps {
    labels: string[];
    rows: ITableRow[];
    onButtonClicked?: (key, rowData) => any;
    buttonComponent?: React.ElementType;
    buttonProps?: any;
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
                    {props.rows.map(({ key, rowData, columns, disabledButton }, columIndex) => (
                        <TableRow key={columIndex} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            {columns.map((column, valueIndex) => (
                                <TableCell key={`${columIndex}-${valueIndex}`} align="center">
                                    {column}
                                </TableCell>
                            ))}

                            {props.onButtonClicked ? (
                                <TableCell align="right">
                                    <props.buttonComponent
                                        disabled={disabledButton}
                                        onClick={() => props.onButtonClicked(key, rowData)}
                                        {...props.buttonProps}
                                    />
                                </TableCell>
                            ) : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
