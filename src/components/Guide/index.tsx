import { ReactElement, useState, FC } from 'react';
import { Container, Typography, Grid, Button } from '@material-ui/core';
import UserDailyMenu from '../UserDailyMenu';
import { useStyles } from './Guide.styles';

enum Guides {
  YOU = 'you',
  FAMILY = 'family',
}

const Guide: FC = (): ReactElement => {
  const [guide, setGuide] = useState<string>('');
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
        {
          !guide && (
            <Grid container spacing={2} justifyContent="center" className={classes.button}>
              <Grid item xs={3}>
                <Button fullWidth variant="contained" color="primary" onClick={() => setGuide(Guides.YOU)}>
                  For you
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button fullWidth variant="contained" color="primary" onClick={() => setGuide(Guides.FAMILY)}>
                  For your loved ones
                </Button>
            </Grid>
            </Grid>
          )
        }
        { guide === Guides.YOU && <UserDailyMenu /> }
      </Container>
    </div>
  );
};

export default Guide;