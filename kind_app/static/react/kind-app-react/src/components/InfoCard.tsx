import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// Define the props interface
interface InfoCardProps {
  title: string;
  content: string;
  image?: string; // image is optional
}

const InfoCard: React.FC<InfoCardProps> = ({ title, content, image }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      {image && (
        <CardMedia
          sx={{ height: 140 }}
          image={image}
          title={title}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {content}
        </Typography>
      </CardContent>
      <CardActions>
      </CardActions>
    </Card>
  );
};

export default InfoCard;
