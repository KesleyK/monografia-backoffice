const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.dark"
    },
    card: {
        width: "30%",
        backgroundColor: "common.white",
        boxShadow: "rgba(0,0,0,.4) 0 2px 5px",
        borderRadius: "3px",
        padding: "50px"
    },
    button: {
        backgroundColor: "primary.dark",
        marginTop: "10px",

        "&:hover": {
            backgroundColor: "primary.main"
        }
    }
};

export default styles;
