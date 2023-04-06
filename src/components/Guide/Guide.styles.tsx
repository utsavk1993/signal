import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(4),
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    marginTop: theme.spacing(4),
  },
}));