import * as React from 'react';
import styles from './ItemCard.module.scss';
import { IItemCardProps } from './IItemCardProps';
import { Image, PrimaryButton, Text } from 'office-ui-fabric-react';
import { ListItemModel } from '../ListItemModel';
import * as moment from 'moment';

interface IItemCardStates { 
  Item : any, 
  ImageLink: {
    type?: string;
    fileName?: string;
    fieldName?: string;
    serverUrl?: string;
    fieldId?: string;
    serverRelativeUrl?: string;
  }
}

export default class ItemCard extends React.Component<IItemCardProps, IItemCardStates> {

  MOMENT_DATE = "";

  constructor(props){
    super(props);

    this.state = {
      Item: this.props.item,
      ImageLink: {}
    };
  }

  public componentDidMount(): void {
    // console.log("Upcomming Item", this.state.Item);
    
    // console.log("moment value",this.MOMENT_DATE);
    if (this.state.Item.Image != null) {
      this.setState({
        ImageLink: JSON.parse(this.state.Item.Image)
      });
      
    }
    
    // console.log("Fields", this.props.field1, this.props.field2, this.props.field3);
  }

  public render(): React.ReactElement<IItemCardProps> {
    if(this.props.field3 != ""){
      let product_date = new Date(this.state.Item[this.props.field3]);
      var now = moment(product_date);
      this.MOMENT_DATE = `${now.date()}/${now.month()+1}/${now.year()}`;
    }
    
    if (this.state.Item.Link == undefined || this.state.Item.Link == "") {
      return (
        <a href={"https://www.google.com"} style={{textDecoration:"none", color:'#000000'}} target='_blank'>
          {(this.props.field1 != undefined && this.props.field2 != undefined && this.props.field3 != undefined && this.props.field1 != "" && this.props.field2 != "" && this.props.field3 != "") ?
          <div 
            className={styles.itemCard}
          >
              <div className={styles.thumbnail}>
                {this.state.ImageLink.serverRelativeUrl != null ? 
                  <img src={this.state.ImageLink.serverUrl + this.state.ImageLink.serverRelativeUrl} title={this.props.field1} /> :
                  <img src={"https://media.istockphoto.com/id/1357365823/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=PM_optEhHBTZkuJQLlCjLz-v3zzxp-1mpNQZsdjrbns="} title={"Image not available"} />
                }

                
              </div>
              
              <Text className={styles.textStyle} title={this.state.Item[this.props.field1]}><b>{this.state.Item[this.props.field1]}</b></Text>

              <Text className={styles.headingText}> Application </Text>
              <Text className={styles.textStyle} >{this.state.Item[this.props.field2]}</Text>

              <Text className={styles.headingText}> Launch Date </Text>
              <Text className={styles.textStyle} >{this.MOMENT_DATE}</Text>
          </div> :
          <></>
        }
        </a>
      );
    }
    return (
      <a href={this.state.Item.Link.Url} style={{textDecoration:"none", color:'#000000'}} target='blank'>
        {(this.props.field1 != undefined && this.props.field2 != undefined && this.props.field3 != undefined && this.props.field4 != undefined && this.props.field1 != "" && this.props.field2 != "" && this.props.field4 != "") ?
        <div 
          className={styles.itemCard}
        >
            <div className={styles.thumbnail}>
              {this.state.ImageLink.serverRelativeUrl != null ? 
                <img src={this.state.ImageLink.serverUrl + this.state.ImageLink.serverRelativeUrl} title={this.state.Item.Link.Description} /> :
                <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"} title={"Image not available"} />
              }

              
            </div>
            
            <Text className={styles.textStyle} title={this.state.Item[this.props.field1]}><b>{this.state.Item[this.props.field1]}</b></Text>

            <Text className={styles.headingText}> Application </Text>
            <Text className={styles.textStyle} >{this.state.Item[this.props.field2]}</Text>

            <div className={styles.msGridClass}>
              <div className={styles.msGridRow}>
                  <div className={[styles['msGridCol'], styles['bottomFirstCol']].join(" ")}>
                    <Text className={styles.headingText}> Date </Text>
                    <Text className={styles.textStyle} >{this.MOMENT_DATE}</Text>
                  </div>
                  <div className={[styles['msGridCol'], styles['bottomFirstCol']].join(" ")}>
                    <Text className={styles.headingText}> Classification </Text>
                    {this.state.Item[this.props.field4] == "New" ?
                      <Text className={styles.classificationTextStyleWithBackground} >{this.state.Item[this.props.field4]}</Text> :
                      <Text className={styles.textStyle} >{this.state.Item[this.props.field4]}</Text>
                    }                    
                  </div>
              </div>
          </div>
        </div> :
        <></>
      } 
      </a>
    );
  }
}
