import { compose, mapProps, branch,renderComponent, getContext } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const contentQuery = gql`
  query contentQuery($contentIds:[ID]! $slugs:[ContentSlugIdInput]!){
    content(ids:$contentIds slugs:$slugs){
      id
      __typename
      slug
      ... on TextContent{
        text
      }
      ... on JSONContent{
        data
      }
      ... on ContentCollection{
        content {
          id
          __typename
          slug
          ... on TextContent {
            text
          }
        }
      }
    }
  }
`;

export const injectContent = (...args)=>compose(
  getContext({
    trxCMA:PropTypes.object.isRequired
  }),
  graphql(contentQuery,{
    options:props=>({
      variables:hocArgsToVars(props.trxCMA.website,args)
    })
  }),
  branch(
    props=>props.data.loading,
    renderComponent(()=>null)
  ),
  mapProps(props=>{
    const {
      data:{
        content
      },
      ...remainingProps
    } = props;

    return {
      content:{
        ...simplifyContentItems(content),
        __raw:content
      },  
      ...remainingProps
    }
  })
)

function simplifyContentItems(content){
  if(content === null || content === undefined){
    console.warn('Unexpected null content. Check all your context exists in TRX-CMA')
    return null;
  }

  return content.reduce((acc,curr) => {
    const {__typename} = curr;
    switch (__typename) {
      case 'TextContent':
        return {
          ...acc,
          [curr.slug]:curr.text
        }
      case 'JSONContent':
        return {
          ...acc,
          [curr.slug]:curr.data
        }
      case 'ContentCollection':
        return {
          ...acc,
          [curr.slug]:{
            ...simplifyContentItems(curr.content),
            [Symbol.iterator]:function*(){
              console.log('WOW this',this)
            }
          },
        }
      default:
        throw new Error(`Unable to simplify content of type "${__typename}"`)
    }
  },{})
}

function hocArgsToVars(website,args){
  return args.reduce((acc,curr)=>({
    ...acc,
    slugs:[
      ...acc.slugs,
      {
        website,
        slug:curr
      }
    ]
  }),{
    contentIds:[],
    slugs:[]
  })
}