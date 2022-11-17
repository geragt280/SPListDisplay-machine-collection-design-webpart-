import * as React from 'react';
import styles from './DisplayCollection.module.scss';
import { IDisplayCollectionProps } from './IDisplayCollectionProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from 'office-ui-fabric-react';
import { ListItemModel } from './ListItemModel';

interface DisplayCollectionStates {
  Items : ListItemModel[];
}

export default class DisplayCollection extends React.Component<IDisplayCollectionProps, DisplayCollectionStates> {

  constructor(props){
    super(props);

    this.state = { Items: [] };
  }

  

  public componentDidMount(): void {
    
  }

  GetListItems = async () => {
    const items: ListItemModel[] = await this.props.pnpsp.web.lists.getById("e181acd1-1669-4095-bd75-d4348c2be8f7").items();
    console.log("List information", items);
  }

  public render(): React.ReactElement<IDisplayCollectionProps> {
    const {
      hasTeamsContext,
    } = this.props;

    return (
      <section className={styles.displayCollection}>
        <h1>Products Coming</h1>
        <PrimaryButton onClick={this.GetListItems}>Check Me</PrimaryButton>
      </section>
    );
  }
}
