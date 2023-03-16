import React, { FunctionComponent } from 'react';
import { StaticQuery, graphql } from 'gatsby'

const SiteContact: FunctionComponent<SiteContactProps> = (props) => {

  const emailMatchRegex = /^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i;
  const httpMatchRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const phoneMatchRegex = /^\+?([0-9]+-?)+$/;
  
  return (
    <StaticQuery
      query={graphql`
        query {
          allConfigJson(filter: {organization: {businessName: {ne: null}}}) {
            nodes {
              organization {
                contact {
                  email
                  phone
                  supportEmail
                  supportChannel
                  smsNumber
                }
              }
            }      
          }
        }
      `}
      render={(data: SiteContextData) => {
        const value = data.allConfigJson.nodes[0].organization.contact[props.field];
        if (emailMatchRegex.test(value)) {
          return (
            <a href={`mailto:${value}`}>
              {value}
            </a>
          );

        } if (httpMatchRegex.test(value)) {
          return (
            <a href={`${value}`} 
              target='_blank'
              rel='noopener'
            >
              {value}
            </a>
          );

        } if (phoneMatchRegex.test(value)) {
          return (
            <a href={`tel:${value}`}>
              {value}
            </a>
          );

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
  allConfigJson: {
    nodes: {
      organization: {
        contact: { [field: string]: string}
      }
    }[]
  }
}
