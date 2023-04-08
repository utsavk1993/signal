import { ReactElement, FC, useEffect, useState, ChangeEvent } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { uniqBy } from 'lodash';
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
  const [expandCategory, setExpandCategory] = useState<string>('');
  const [data, setData] = useState<any>(null);

  const classes = useStyles();

  const handleChange = (panel: string) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : '');
  }

  const handleCategoryChange = (panel: string) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
    setExpandCategory(isExpanded ? panel : '');
  }

  const constructData = async () => {
    const [servingsPerDay, fgDirectionalStatements, foodGroups, foods]: any = await Promise.all(
      csvFiles.map(file => parseCSV(file))
    );

    const categoryMap: any = {};

    foodGroups.forEach((group: any) => {
      categoryMap[group.fgcat_id] = group.fgcat;
    });

    const foodGroupToCategory = foodGroups.reduce((acc: any, curr: any) => {
      if(!acc[curr.fgid]) {
        acc[curr.fgid] = {
          [curr.fgcat_id]: curr.fgcat,
        };
      } else {
        acc[curr.fgid][curr.fgcat_id] = curr.fgcat;
      }
      return acc;
    }, {});

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

    const foodGroupsWithServings = foodGroups.reduce((acc: any, group: any) => {
      const recommendedServings = filteredServings.find((serving: any) => serving.fgid === group.fgid)?.servings;
  
      const groupFoods = foods.filter((food: any) => food.fgid === group.fgid).map((food: any) => {
        return {
          name: food.food,
          servingSize: food.srvg_sz,
          category: food.fgcat_id,
          categoryName: categoryMap[food.fgcat_id],
        }
      });
      
      if(!acc.find((foodGroup: any) => foodGroup.name === group.foodgroup)) {
        acc.push({
          name: group.foodgroup,
          recommendedServings,
          foods: groupFoods,
          foodGroupId: group.fgid,
        });
      }

      return acc;
    }, []);

    const categorizedFoods = foodGroupsWithServings.reduce((acc: any, curr: any) => {
      curr.foods.forEach((food: any) => {
        if (!acc[food.category]) {
          acc[food.category] = [];
        }
        acc[food.category].push(food);
      });
      return acc;
    }, {});

    return {
      age,
      gender,
      foodGroups: uniqBy(foodGroupsWithServings, 'name'),
      categories: categorizedFoods,
      directionalStatements: getDirectionalStatementsByFgid(),
      categoryMap,
      foodGroupToCategory
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

  return (
    <>
      <Typography variant="h5" style={{ paddingTop: '10px' }}>
        Guide for {name}, {gender} aged between {age}
      </Typography>
      <div className={classes.root}>
        {data.foodGroups.map((foodGroup: any) => (
          <Accordion expanded={expanded === foodGroup.name} onChange={handleChange(foodGroup.name)} key={foodGroup.foodGroupId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div>
              <Typography variant='h6'>
                {foodGroup.name} with <b>{foodGroup.recommendedServings} recommended servings</b>
              </Typography>
              <Typography className={classes.heading}>
                Directions: {data.directionalStatements[foodGroup.foodGroupId].join(' ')}
              </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
            <div className={classes.root}>
              {Object.keys(data.foodGroupToCategory[foodGroup.foodGroupId]).map((category: any) => (
                <Accordion expanded={expandCategory === category} onChange={handleCategoryChange(category)} key={category}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                      {data.foodGroupToCategory[foodGroup.foodGroupId][category]}
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
                        {data.categories[category].map((food: any) => (
                          <TableRow key={food.name + food.servingSize}>
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
              ))}
            </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default FoodGuide;