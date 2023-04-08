import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  table: {
    minWidth: 650,
  },
  accordion: {
    flexDirection: 'column',
  }
}));