import React, { FunctionComponent } from 'react';
import { StaticQuery, graphql } from "gatsby"

const SiteContact: FunctionComponent<SiteContactProps> = (props) => {

  const emailMatchRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const httpMatchRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const telMatchRegex = /^\+?([0-9]+-?)+$/;
  
  return (
    <StaticQuery
      query={graphql`
        query {
          configJson {
            contact {
              email
              phone
              supportEmail
              supportChannel
            }
          }
        }
      `}
      render={(data: SiteContextData) => {
        const value = data.configJson.contact[props.field];
        if (emailMatchRegex.test(value)) {
          return (<a href={`mailto:${value}`}>{value}</a>);
        } if (httpMatchRegex.test(value)) {
          return (<a href={`${value}`}>{value}</a>);
        } if (telMatchRegex.test(value)) {
          return (<a href={`tel:${value}`}>{value}</a>);
        } else {
          return (<>{value}</>);
        }        
      }}
    />
  );
}

export default SiteContact;

type SiteContactProps = {
  field: string
}

type SiteContextData = {
  configJson: {
    contact: { [field: string]: string}
  }
}
