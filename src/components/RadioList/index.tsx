import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Radio from "@mui/material/Radio";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";

export function RadioList({ items, setItems, checked, setChecked }) {
    const handleToggle = (index: number) => {
        setChecked([index]);
    };

    const onChangingText = (index: number, value: string) => {
        const updatedItems = [...items];
        updatedItems[index] = value;
        setItems(updatedItems);
    };

    const onDeletingItem = (index: number) => {
        const isItemChecked = checked.indexOf(index) !== -1;

        if (isItemChecked) {
            setChecked([]);
        }

        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const onAddingNewItem = () => {
        const updatedItems = [...items];
        updatedItems.push("Nova resposta");
        setItems(updatedItems);
    };

    return (
        <List dense sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
            {items.map((_, index) => {
                const labelId = `radio-list-secondary-label-${index}`;

                return (
                    <ListItem key={index} disablePadding>
                        <TextField
                            id={labelId}
                            value={items[index]}
                            onChange={(e) => onChangingText(index, e.target.value)}
                        />

                        <Radio
                            edge="end"
                            onChange={() => handleToggle(index)}
                            checked={checked.indexOf(index) !== -1}
                            inputProps={{ "aria-labelledby": labelId }}
                        />

                        <IconButton aria-label="delete" onClick={() => onDeletingItem(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                );
            })}

            <ListItemButton sx={{ width: "fit-content" }} onClick={onAddingNewItem}>
                <AddIcon />
                <Typography>Inserir nova resposta</Typography>
            </ListItemButton>
        </List>
    );
}
