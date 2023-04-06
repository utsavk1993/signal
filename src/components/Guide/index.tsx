import { ReactElement, useState, FC } from 'react';
import { Container, Typography, Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UserDailyMenu from '../UserDailyMenu';
import FamilyDailyMenu from '../FamilyDailyMenu';

enum Guides {
  YOU = 'you',
  FAMILY = 'family',
}

const useStyles = makeStyles((theme) => ({
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

const Guide: FC = (): ReactElement => {
  const [guide, setGuide] = useState<null | string>('');
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h2" align="center" className={classes.title}>
          Canada's Food Guide
        </Typography>
        <Typography variant="subtitle1" align="center">
          Discover healthy eating recommendations for you and your family based on age, gender, and more.
        </Typography>
        <Grid container spacing={2} justifyContent="center" className={classes.button}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => setGuide(Guides.YOU)}>
              For you
            </Button>
          </Grid>
        </Grid>
        { guide === Guides.YOU && <UserDailyMenu /> }
      </Container>
    </div>
  );
};

export default Guide;