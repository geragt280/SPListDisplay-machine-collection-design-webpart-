import * as React from 'react';
import styles from './DisplayCollection.module.scss';
import { IDisplayCollectionProps } from './IDisplayCollectionProps';
import { Check, css, PrimaryButton } from 'office-ui-fabric-react';
import { ListItemModel } from './ListItemModel';
import ItemCard from './ItemCard/ItemCard';
import { Guid } from '@microsoft/sp-core-library';
import { PagedItemCollection } from '@pnp/sp/items';
import Select from 'react-select';

interface DisplayCollectionStates {
  Items : ListItemModel[];
  currentPage: number;
  totalPages: number;
  selectedfilterItem: { value?:string, label?:string };
  filterItems: { value?:string, label?:string }[];
}

export default class DisplayCollection extends React.Component<IDisplayCollectionProps, DisplayCollectionStates> {

  constructor(props){
    super(props);

    this.state = { 
      Items: [],
      currentPage: 1,
      totalPages: 1,
      selectedfilterItem: null,
      filterItems: []
    };
  }

  private SPLIST_ID = this.props.description;

  // options = [
  //   { value: 'Choice1', label: 'Choice1' },
  //   { value: 'Choice2', label: 'Choice2' },
  //   { value: 'Choice3', label: 'Choice3' }
  // ]

  private _onClickNext(){
    console.log("Next");
  }

  public componentDidMount(): void {
    this.GetListItems();
    this.GetChoiceFields();
    window.localStorage.clear();
  }

  GetListItems = async () => {
    const listInfo = await this.props.pnpsp.web.lists.getById(this.SPLIST_ID);
    const items: PagedItemCollection<ListItemModel[]> = await listInfo.items.getPaged();
    console.log("List information", items.results);
    this.setState({
      Items: items.results
    });
  }

  GetChoiceFields = async () => {
    const list = this.props.pnpsp.web.lists.getById(this.SPLIST_ID);
    const r = await list.fields.getByInternalNameOrTitle("Application")();
    console.log("Fields", r);
    let choiceItems : { value?:string, label?:string }[] = [];
    if (r.Choices.length) {
      r.Choices.map(e => choiceItems.push({label:e, value:e}))
      this.setState({
        filterItems: choiceItems
      });
    }
  }

  GetFilteredItems = async (filterName) => {
    console.log("filternaem", filterName);
    if (filterName != null) {
      const listInfo = await this.props.pnpsp.web.lists.getById(this.SPLIST_ID);
    const items: PagedItemCollection<ListItemModel[]> = await listInfo.items.filter(`Application eq '${filterName.label}'`).getPaged();
    console.log("List information", items.results);
    this.setState({
      Items: items.results
    });
    }
    else{
      this.GetListItems();
    }
  
  }

  private RenderPersonCard = (item) => {
    return (
      <div className={css(styles.column, styles.mslg3)} >
        <ItemCard item={item} key={Guid.newGuid().toString()} />
      </div>
    );
  }

  private onFilterChange = (e) => {
    console.log("entered", e);
    this.setState({
      selectedfilterItem: e
    });

    this.GetFilteredItems(e);
  }

  public render(): React.ReactElement<IDisplayCollectionProps> {
  
    return (
      <section className={css(styles.grid, styles.displayCollection)}>
        <h1>{this.props.wptitle != "" ? this.props.wptitle : "Webpart Title" }</h1>
        <div>
          Filter <Select options={this.state.filterItems} className={styles.filterStyle} onChange={this.onFilterChange} placeholder='Select Application' isClearable={true} value={this.state.selectedfilterItem}/>
        </div>
        <div className={styles.row}>
            {this.state.Items.map( currentItem => this.RenderPersonCard(currentItem))}
        </div>
        {/* <div className={css(styles.row, styles.pagination)}>
            <div className={css(styles.column, styles.mslg12, styles.panel)}>
              <div className={styles.panelBody}>
                <div className={styles.status}>
                  Status
                </div>
                <ul className={styles.pager}>
                  <li>
                    <PrimaryButton 
                      // disabled={((this.state.currentPage - 1) * this.props.pageSize + 1) <= 1} onClick={this._onClickPrevious}
                      >Previous</PrimaryButton>
                  </li>
                  <li>
                    <PrimaryButton 
                      // disabled={((this.state.currentPage - 1) * this.props.pageSize) + this.state.items.length >= this.state.itemCount} 
                      onClick={this._onClickNext}
                      >Next</PrimaryButton>
                  </li>

                </ul>
              </div></div>
          </div> */}
      </section>
    );
  }
}
