import * as React from 'react';
import styles from './ItemCard.module.scss';
import { IItemCardProps } from './IItemCardProps';
import { Image, PrimaryButton, Text } from 'office-ui-fabric-react';

export default class DisplayCollection extends React.Component<IItemCardProps, {}> {

  constructor(props){
    super(props);

    const {
      item
    } = this.props;
  }

  public componentDidMount(): void {
    
  }

  public render(): React.ReactElement<IItemCardProps> {
    

    return (
      <section 
        className={styles.itemCard}
      >
        <Image src='' />
        <Text></Text>
      </section>
    );
  }
}
