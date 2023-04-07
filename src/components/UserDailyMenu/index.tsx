import { ReactElement, useState, FC } from 'react';
import { Button, FormControl, TextField, InputLabel, MenuItem, Select, Typography, Grid } from "@material-ui/core";
import FoodGuide from '../FoodGuide';
import { useStyles } from '../shared/styles';
import { AGE_RANGES } from '../shared/enum';

interface UserDailyMenuProps {
  setGuide: (guide: string) => void;
}

const UserDailyMenu: FC<UserDailyMenuProps> = ({ setGuide }: UserDailyMenuProps): ReactElement => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [displayFoodGuide, setDisplayFoodGuide] = useState<boolean>(false);
  const classes = useStyles();

  return displayFoodGuide ? <FoodGuide age={age} gender={gender} name={name} /> : (
    <>
      <Typography variant="h4" gutterBottom className={classes.typography}>
        Input Parameters
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={event => setName(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth className={classes.formControl}>
            <InputLabel>Age</InputLabel>
            <Select
              value={age}
              onChange={event => setAge(event.target.value as string)}
              label="Gender"
            >
              {
                AGE_RANGES.map(ageRange => (
                  <MenuItem key={ageRange.value} value={ageRange.value}>{ageRange.label}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth className={classes.formControl}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={gender}
              onChange={event => setGender(event.target.value as string)}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setGuide('')}
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDisplayFoodGuide(true)}
            disabled={!age || !gender || !name}
          >
            Continue
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
  
export default UserDailyMenu;