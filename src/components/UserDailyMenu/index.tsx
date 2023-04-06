import { ReactElement, useState, FC } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, makeStyles } from "@material-ui/core";
import FoodGuide from '../FoodGuide';

const AGE_RANGES = [
  { value: '2 to 3', label: '2 to 3' },
  { value: '4 to 8', label: '4 to 8' },
  { value: '9 to 13', label: '9 to 13' },
  { value: '14 to 18', label: '14 to 18' },
  { value: '19 to 30', label: '19 to 30' },
  { value: '31 to 50', label: '31 to 50' },
  { value: '51 to 70', label: '51 to 70' },
  { value: '71+', label: '71+' },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "45vh",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const UserDailyMenu: FC = (): ReactElement => {
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [displayFoodGuide, setDisplayFoodGuide] = useState<boolean>(false);
  const classes = useStyles();

  return displayFoodGuide ? <FoodGuide age={age} gender={gender} /> : (
    <Box className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Select Parameters
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="age-label">Age</InputLabel>
        <Select
          labelId="age-label"
          id="age"
          value={age}
          onChange={event => setAge(event.target.value as string)}
        >
          {
            AGE_RANGES.map(ageRange => (
              <MenuItem key={ageRange.value} value={ageRange.value}>{ageRange.label}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          value={gender}
          onChange={event => setGender(event.target.value as string)}
        >
          <MenuItem value={"Male"}>Male</MenuItem>
          <MenuItem value={"Female"}>Female</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setDisplayFoodGuide(true)}
        disabled={!age || !gender}
      >
        Continue
      </Button>
    </Box>
  );
}
  
export default UserDailyMenu;