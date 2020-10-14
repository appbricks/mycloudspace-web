import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const Home: FunctionComponent<HomeProps> = (props) => {
  const styles = useStyles(props);

  return (
    <></>
  );
}

export default Home;

const useStyles = makeStyles((theme) => ({
}));

type HomeProps = {
}
