import React, { FunctionComponent } from 'react';
import { makeStyles } from '@material-ui/core';

const ContentCards: FunctionComponent<ContentCardsProps> = (props) => {
  const styles = useStyles(props);

  return (<><p>custom component {props.cardContentGlob}</p></>);
}

export default ContentCards;

const useStyles = makeStyles((theme) => ({
}));

type ContentCardsProps = {
  cardContentGlob: string
}
