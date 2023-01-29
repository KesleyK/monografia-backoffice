import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface ITabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

interface ITabs {
    components: JSX.Element[];
    labels: string[];
}

function TabPanel(props: ITabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`
    };
}

export function BasicTabs(props: ITabs) {
    const [value, setValue] = React.useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {props.labels.map((label, index) => (
                        <Tab key={index} label={label} {...a11yProps(index)} />
                    ))}
                </Tabs>
            </Box>
            {props.components.map((component, index) => (
                <TabPanel value={value} index={index} key={index}>
                    {component}
                </TabPanel>
            ))}
        </Box>
    );
}
