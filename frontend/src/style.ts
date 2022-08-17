import './App.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 400 
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '40%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        [theme.breakpoints.down("sm")]: {
          width: '77%'
        },
    
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        background: 'linear-gradient(45deg, #992eff 30%, #1cffd6 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        height: 48,
        padding: '0 30px',
    },
    root: {
        marginRight: 10,
        marginBottom: 10,
        width: '77%',
        [theme.breakpoints.between(1280, 4000)]: {
          width: '20%'
        },
        [theme.breakpoints.between(960, 1280)]: {
          width: '40%'
        },
    },
    image:{
        width: 50,
        height: 50
    },
    cardHeader:{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent:'center',
        alignItems: 'center'
    },
    flexRow:{
      display: 'flex',
      justifyContent: 'center',
      marginTop: 20,
      [theme.breakpoints.down("sm")]: {
        flexDirection: 'column',
        alignItems:'center'
      },
      [theme.breakpoints.up("md")]: {
        flexDirection: 'column',
        alignItems:'center'
      },
      [theme.breakpoints.up("lg")]: {
        flexDirection: 'row',
      },
    },
    center:{
        textAlign: 'center',
        marginTop: '5%',
    },
    infoText:{
        textAlign: 'left',
        fontSize: 14,
        lineHeight: 2,
    },
    formContainer:{
        display: 'flex',
        justifyContent:'center',
    },
    error:{
        color: 'red',
        textAlign: 'start',
        fontSize: 12
    }
}));

export default useStyles;