import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { FaBeer } from 'react-icons/fa';

const CardView = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          <FaBeer style={{ fontSize: 40, color: 'green' }} />
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          Here is a beer icon!
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardView;
