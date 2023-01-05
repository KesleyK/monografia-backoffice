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
    columns: Array<string>;
}

interface IProps {
    labels: Array<string>;
    rows: Array<ITableRow>;
    onButtonClicked?: (key) => any;
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
                            <TableCell key={index}>{label}</TableCell>
                        ))}
                        {props.onButtonClicked ? <TableCell></TableCell> : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map(({ key, columns }, columIndex) => (
                        <TableRow key={columIndex} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            {columns.map((column, valueIndex) => (
                                <React.Fragment key={`${columIndex}-${valueIndex}`}>
                                    <TableCell>{column}</TableCell>

                                    {props.onButtonClicked ? (
                                        <TableCell align="right">
                                            <props.buttonComponent
                                                onClick={() => props.onButtonClicked(key)}
                                                {...props.buttonProps}
                                            />
                                        </TableCell>
                                    ) : null}
                                </React.Fragment>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
