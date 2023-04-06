// @ts-nocheck
import { ReactElement, FC, useEffect, useState } from 'react';
// import { Typography, Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { groupBy, uniq, uniqBy } from 'lodash';
import { parseCSV } from './utils';
import servingsPerDay from '../../data/servings_per_day-en_ONPP.csv';
import fgDirectionalStatements from '../../data/fg_directional_satements-en_ONPP.csv';
import foodGroups from '../../data/foodgroups-en_ONPP.csv';
import foods from '../../data/foods-en_ONPP_rev.csv';

interface FoodGuideProps {
  age: string;
  gender: string;
}

const csvFiles = [
  servingsPerDay,
  fgDirectionalStatements,
  foodGroups,
  foods,
];

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  foodGroup: {
    marginBottom: theme.spacing(2),
  },
  foodGroupTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  foodGroupServings: {
    fontStyle: 'italic',
    marginBottom: theme.spacing(1),
  },
  food: {
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  foodTitle: {
    fontWeight: 'bold',
  },
  foodServingSize: {
    fontStyle: 'italic',
    marginBottom: theme.spacing(0.5),
  },
}));

const FoodGuide: FC<FoodGuideProps> = ({ age, gender }: FoodGuideProps): ReactElement => {
  const classes = useStyles();
  const [data, setData] = useState<any>(null);

  // const constructData = async () => {
  //   const [servingsPerDay, fgDirectionalStatements, foodGroups, foods] = await Promise.all(
  //     csvFiles.map(file => parseCSV(file))
  //   );

  //   const ageAndGenderServings = servingsPerDay.filter(serving => {
  //     return serving.ages === age && serving.gender === gender;
  //   });

  //   const foodsByFoodGroupId = groupBy(foods, 'fgid');

  //   const foodGroupsData = foodGroups.map(foodGroup => {
  //     const foodGroupFoods = foodsByFoodGroupId[foodGroup.fgid] || [];
  //     const foodGroupServings = ageAndGenderServings.filter(serving => {
  //       return serving.fgid === foodGroup.fgid;
  //     });
  
  //     return {
  //       id: foodGroup.fgid,
  //       name: foodGroup.foodgroup,
  //       servings: foodGroupServings,
  //       foods: foodGroupFoods
  //     };
  //   });

  //   const directionalStatementsData = fgDirectionalStatements.map(directionalStatement => {
  //     const foodGroupIds = directionalStatement.fgid.split(',').map(id => parseInt(id.trim()));
  
  //     const associatedFoodGroups = foodGroupsData.filter(foodGroup => {
  //       return foodGroupIds.includes(foodGroup.fgid);
  //     });
  
  //     return {
  //       id: directionalStatement.fgid,
  //       text: directionalStatement['directional-statement'],
  //       foodGroups: associatedFoodGroups
  //     };
  //   });

  //   return {
  //     ageRange: age,
  //     gender,
  //     foodGroups: foodGroupsData,
  //     directionalStatements: directionalStatementsData,
  //   }
  // };

  const constructData = async () => {
    const [servingsPerDay, fgDirectionalStatements, foodGroups, foods] = await Promise.all(
      csvFiles.map(file => parseCSV(file))
    );

    console.log(servingsPerDay, fgDirectionalStatements, foodGroups, foods);

    const filteredServings = servingsPerDay.filter((serving: any) => serving.ages === age && serving.gender === gender);

    const foodGroupsWithServings = foodGroups.map((group: any) => {
      const recommendedServings = filteredServings.find((serving: any) => serving.fgid === group.fgid)?.servings;

      const groupFoods = foods.filter((food: any) => food.fgid === group.fgid).map((food: any) => {
        return {
          name: food.food,
          servingSize: food.srvg_sz,
        }
      });

      return {
        name: group.foodgroup,
        recommendedServings,
        foods: groupFoods
      }
    });

    return {
      age,
      gender,
      foodGroups: uniqBy(foodGroupsWithServings, 'name')
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = await constructData();
      setData(data);
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!data) {
    return <Typography>Loading...</Typography>;
  }

  // const renderFoods = (foods: any[]) => {
  //   if (foods.length === 0) {
  //     return <Typography variant="body2" color="textSecondary">No foods selected</Typography>;
  //   }

  //   return (
  //     <List>
  //       {foods.map((food) => (
  //         <ListItem key={food.name}>
  //           <ListItemText primary={food.name} secondary={`${food.servingSize} - ${food.calories} calories`} />
  //         </ListItem>
  //       ))}
  //     </List>
  //   );
  // }

  // const renderFoodGroups = () => {
  //   return data.foodGroups.map((group: any) => (
  //     <Grid item xs={12} sm={6} md={4} key={group.name}>
  //       <Card>
  //         <CardHeader title={group.name} subheader={`${group.selectedServings} of ${group.recommendedServings} servings`} />
  //         <CardContent>
  //           {renderFoods(group.foods)}
  //         </CardContent>
  //       </Card>
  //     </Grid>
  //   ));
  // }

  return (
    <>
      <Typography variant="h4">{age} {gender}</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Food Group</TableCell>
              <TableCell>Recommended Servings</TableCell>
              <TableCell>Selected Servings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.foodGroups.map((foodGroup) => (
              <TableRow key={foodGroup.name}>
                <TableCell component="th" scope="row">
                  {foodGroup.name}
                </TableCell>
                <TableCell>{foodGroup.recommendedServings}</TableCell>
                <TableCell>
                <ul>
              {foodGroup.foods.map((food) => (
                <li key={food.name}>
                  {food.name} ({food.servingSize})
                </li>
              ))}
            </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
  
export default FoodGuide;

