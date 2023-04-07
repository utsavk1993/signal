import { ReactElement, FC, useEffect, useState, ChangeEvent } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { groupBy, uniqBy } from 'lodash';
import { parseCSV } from './utils';
import servingsPerDay from '../../data/servings_per_day-en_ONPP.csv';
import fgDirectionalStatements from '../../data/fg_directional_satements-en_ONPP.csv';
import foodGroups from '../../data/foodgroups-en_ONPP.csv';
import foods from '../../data/foods-en_ONPP_rev.csv';
import { useStyles } from './FoodGuide.styles';

interface FoodGuideProps {
  age: string;
  gender: string;
  name: string;
}

const csvFiles = [
  servingsPerDay,
  fgDirectionalStatements,
  foodGroups,
  foods,
];

const FoodGuide: FC<FoodGuideProps> = ({ age, gender, name }: FoodGuideProps): ReactElement => {
  const [expanded, setExpanded] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const groupedFoods = data ? groupBy(data.foodGroups, 'categorizedFoods') : null;

  const classes = useStyles();

  const handleChange = (panel: string) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  }

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
    const [servingsPerDay, fgDirectionalStatements, foodGroups, foods]: any = await Promise.all(
      csvFiles.map(file => parseCSV(file))
    );

    const getDirectionalStatementsByFgid = () => {
      const statementsByFgid: { [key: string]: string[] } = {};

      fgDirectionalStatements.forEach((statement: any) => {
        const { fgid, 'directional-statement': directionStatement } = statement;
        if (!statementsByFgid[fgid]) {
          statementsByFgid[fgid] = [];
        }
        statementsByFgid[fgid].push(directionStatement);
      });

      return statementsByFgid;
    };

    const filteredServings = servingsPerDay.filter((serving: any) => serving.ages === age && serving.gender === gender);

    const foodGroupsWithServings = foodGroups.map((group: any) => {
      const recommendedServings = filteredServings.find((serving: any) => serving.fgid === group.fgid)?.servings;
  
      const groupFoods = foods.filter((food: any) => food.fgid === group.fgid).map((food: any) => {
        return {
          name: food.food,
          servingSize: food.srvg_sz,
          category: food.fgcat_id,
        }
      });
  
      return {
        name: group.foodgroup,
        recommendedServings,
        foods: groupFoods,
        foodGroupId: group.fgid,
      }
    });

    const categorizedFoods = foodGroupsWithServings.reduce((acc: any, curr: any) => {
      curr.foods.forEach((food: any) => {
        if (!acc[food.category]) {
          acc[food.category] = [];
        }
        acc[food.category].push(food);
      });
      return acc;
    }, {});

    // const foodGroupsWithServings = foodGroups.map((group: any) => {
    //   const recommendedServings = filteredServings.find((serving: any) => serving.fgid === group.fgid)?.servings;

    //   const groupFoods = foods.filter((food: any) => food.fgid === group.fgid).map((food: any) => {
    //     return {
    //       name: food.food,
    //       servingSize: food.srvg_sz,
    //     }
    //   });

    //   return {
    //     name: group.foodgroup,
    //     recommendedServings,
    //     foods: groupFoods
    //   }
    // });

    return {
      age,
      gender,
      foodGroups: uniqBy(foodGroupsWithServings, 'name'),
      categories: categorizedFoods,
      directionalStatements: getDirectionalStatementsByFgid(),
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

  console.log(data);

  return (
    <>
      <Typography variant="h5" style={{ paddingTop: '10px' }}>
        Guide for {name}, {gender} aged between {age}
      </Typography>
      <div className={classes.root}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="Food Guide table">
            <TableHead>
              <TableRow>
                <TableCell>Food Group</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.foodGroups.map((foodGroup: any) => (
                <TableRow key={foodGroup.name}>
                  <TableCell component="th" scope="row">
                    <Accordion expanded={expanded === foodGroup.name} onChange={handleChange(foodGroup.name)}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>
                          {foodGroup.name} with {foodGroup.recommendedServings} recommended servings
                          <br />
                          Directions: {data.directionalStatements[foodGroup.foodGroupId].join(' ')}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper}>
                          <Table
                            className={classes.table}
                            aria-label={`${foodGroup.name} foods`}
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="center">Serving Size</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {foodGroup.foods.map((food: any) => (
                                <TableRow key={food.name}>
                                  <TableCell component="th" scope="row">
                                    {food.name}
                                  </TableCell>
                                  <TableCell align="center">{food.servingSize}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default FoodGuide;