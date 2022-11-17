import * as React from 'react';
import styles from './ItemCard.module.scss';
import { IItemCardProps } from './IItemCardProps';
import { Image, PrimaryButton, Text } from 'office-ui-fabric-react';
import { ListItemModel } from '../ListItemModel';

interface IItemCardStates { 
  Item : ListItemModel, 
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

  constructor(props){
    super(props);

    this.state = {
      Item: this.props.item,
      ImageLink: {}
    };
  }

  public componentDidMount(): void {
    // console.log("Upcomming Item", this.state.Item);
    if (this.state.Item.Image !== null) {
      this.setState({
        ImageLink: JSON.parse(this.state.Item.Image)
      });
    }
  }

  public render(): React.ReactElement<IItemCardProps> {
    

    return (
      <a href={this.state.Item.Link.Url} style={{textDecoration:"none"}} target='blank'><div 
        className={styles.itemCard}
      >
            <div className={styles.thumbnail}>
              <img src={this.state.ImageLink.serverUrl + this.state.ImageLink.serverRelativeUrl} title={this.state.Item.Link.Description} />
              
            </div>
            <Text className={styles.textStyle}>{this.state.Item.Title}</Text>
      </div></a>
    );
  }
}
