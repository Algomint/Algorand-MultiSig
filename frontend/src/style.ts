import "./App.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  navbar: {
    background: "linear-gradient(45deg, #000000 30%, #606060 90%)",
  },
  heading: {
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "22px",
  },
  paragraph: {
    marginBottom: theme.spacing(4),
    fontSize: "18px",
  },
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  page: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "200%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    //background: 'linear-gradient(45deg, #992eff 30%, #1cffd6 90%)',
    background: "linear-gradient(45deg, #000000 30%, #606060 90%)",
    border: 0,
    borderRadius: 3,
    borderColor: "black",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px",
  },
  table: {
    marginTop: theme.spacing(5),
  },
}));

export default useStyles;
