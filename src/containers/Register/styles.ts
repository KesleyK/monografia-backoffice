const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "common.white",
    },
    card: {
        width: "30%",
        backgroundColor: "common.white",
        boxShadow: "rgba(0,0,0,.4) 0 2px 5px",
        borderRadius: "3px",
        padding: "50px",
    },
    input: {
        margin: "5px 0",
    },
    button: {
        backgroundColor: "secondary.main",
        marginTop: "20px",

        "&:hover": {
            backgroundColor: "secondary.dark",
        },
    },
};

export default styles;
