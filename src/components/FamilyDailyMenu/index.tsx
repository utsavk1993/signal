import { ReactElement, useState, FC, Fragment } from 'react';
import { Button, FormControl, TextField, InputLabel, MenuItem, Select, Typography, Grid } from "@material-ui/core";
import { useStyles } from '../shared/styles';
import { AGE_RANGES } from '../shared/enum';
import FoodGuide from '../FoodGuide';

type Member = {
  name: string;
  age: string;
  gender: string;
  [key: string]: any;
};

interface FamilyDailyMenuProps {
  setGuide: (guide: string) => void;
}

const FamilyDailyMenu: FC<FamilyDailyMenuProps> = ({ setGuide }: FamilyDailyMenuProps): ReactElement => {
  const [displayFoodGuide, setDisplayFoodGuide] = useState<boolean>(false);
  const [members, setMembers] = useState<Array<Member>>([{ name: '', age: '', gender: '' }]);
  const classes = useStyles();

  const handleAddMember = () => {
    setMembers([...members, { name: '', age: '', gender: '' }]);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const isSubmitDisabled = () => {

    if(members.length === 0) {
      return true;
    }

    for (let i = 0; i < members.length; i++) {
      if (!members[i].name || !members[i].age || !members[i].gender) {
        return true;
      }
    }
    return false;
  };

  const renderFoodGuideComp = () => {
    return members.map((member, index) => (
      <div key={index}>
        <FoodGuide age={member.age} gender={member.gender} name={member.name} />
      </div>
    ));
  };

  return (
    <>
      {displayFoodGuide ? renderFoodGuideComp() : (
        <>
          <Typography variant="h4" gutterBottom className={classes.typography}>
            Input Parameters
          </Typography>
          <Grid container spacing={2}>
            {
              members.map((member, index) => (
                <Fragment key={index}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Name"
                      variant="outlined"
                      value={member.name}
                      onChange={event => handleChange(index, 'name', event.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl variant="outlined" fullWidth className={classes.formControl}>
                      <InputLabel>Age</InputLabel>
                      <Select
                        value={member.age}
                        onChange={event => handleChange(index, 'age', event.target.value as string)}
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
                        value={member.gender}
                        onChange={event => handleChange(index, 'gender', event.target.value as string)}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Fragment>
              ))
            }
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddMember}
              >
                Add member
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setGuide('')}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setDisplayFoodGuide(true)}
                disabled={isSubmitDisabled()}
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}
  
export default FamilyDailyMenu;